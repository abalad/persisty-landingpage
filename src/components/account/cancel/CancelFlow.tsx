"use client";

import { AlertCircle, Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { createElement, useEffect, useRef, useState, type ReactNode } from "react";
import { FEATURE_ICONS } from "@/components/plans/featureIcons";
import { buttonClass } from "@/components/site/Button";
import type { Locale } from "@/i18n/routing";
import { formatPrice, priceFor } from "@/lib/pricing";
import { discountedCents, readStatus, REASONS, retention, steps, type CancelStep, type Offer, type Reason, type RetentionAction, type RetentionErrorKey, type RetentionStatus } from "@/lib/retention";
import { CancelMascot } from "./CancelMascot";
import type { CancelMood } from "./mascotScene";
import styles from "./cancel.module.css";

type Done = "kept" | "discount" | "free_month" | "cancelled" | "refunded";

interface Props {
  /** The team's organisation; the personal one when absent. */
  orgId?: string;
  plan: "pro" | "team";
  /** A personal subscription paid next to a team's plan: no offers, nothing is lost. */
  duplicate: boolean;
  /** The team the plan comes through (duplicate) or the team being cancelled. */
  teamName?: string | null;
  onClose: (changed: boolean) => void;
  /** The retention call; fixtures pass a stand-in so the dialog can be seen without an account. */
  api?: typeof retention;
}

/** What the person loses at the period's end, by plan: the catalog's names. */
const LOSES: Record<"pro" | "team", string[]> = {
  pro: ["accountRotation", "requestQueue", "restorePoints"],
  team: ["teamBilling", "accountRotation", "requestQueue"],
};

const MOOD: Record<CancelStep, CancelMood> = { reason: "sad", discount: "hopeful", free_month: "pleading", confirm: "goodbye" };

/**
 * Cancelling a paid plan, in a dialog: why, then the offers left (25% for
 * two months, then a free month), then the confirmation, with the mascot
 * taking each step. Staying is always the lime button; going on is always a
 * visible link. Escape or the close button leave the plan as it is.
 */
export function CancelFlow({ orgId, plan, duplicate, teamName, onClose, api = retention }: Props) {
  const t = useTranslations("auth.account.cancel");
  const plans = useTranslations("pricing.plans");
  const names = useTranslations("pricing.features");
  const lines = useTranslations("features");
  const locale = useLocale() as Locale;
  const dialog = useRef<HTMLDialogElement>(null);
  const planName = plans(`${plan}.name`);

  const [status, setStatus] = useState<RetentionStatus | null>(null);
  const [loadError, setLoadError] = useState<RetentionErrorKey | null>(null);
  const [index, setIndex] = useState(0);
  const [reason, setReason] = useState<Reason | null>(null);
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState<RetentionAction | null>(null);
  const [error, setError] = useState<RetentionErrorKey | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    dialog.current?.showModal();
    let alive = true;
    void api("status", { orgId }).then((res) => {
      if (!alive) return;
      if (res.ok) setStatus(readStatus(res.data));
      else setLoadError(res.error);
    });
    return () => {
      alive = false;
    };
  }, [orgId, api]);

  const flow = status ? steps(status, duplicate) : (["reason"] as CancelStep[]);
  const at = Math.min(index, flow.length - 1);
  const step = flow[at];
  // The offers already on screen up to this step: the final call says which were shown.
  const shown = flow.slice(0, at + 1).filter((s): s is Offer => s === "discount" || s === "free_month");

  const close = () => {
    dialog.current?.close();
    onClose(done !== null);
  };

  async function act(action: RetentionAction, outcome: Done) {
    if (busy) return;
    setBusy(action);
    setError(null);
    const res = await api(action, { orgId, reason, details, offers: shown });
    setBusy(null);
    if (!res.ok) return setError(res.error);
    setDone(outcome);
  }

  const mood: CancelMood = done ? (done === "cancelled" || done === "refunded" ? "goodbye" : "celebrate") : MOOD[step];
  const date = status?.periodEnd ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(status.periodEnd)) : "";
  const money = (cents: number, currency: "BRL" | "USD") => formatPrice(locale, cents, currency, { explicit: true });
  const full = status?.price ?? priceFor(locale, plan === "team" ? "team" : "pro");
  const fullCents = "amount" in full ? full.amount : full.cents;
  const refund = status?.refund ?? null;

  const keepButton = (
    <button type="button" className={buttonClass("primary", "lg")} onClick={() => void act("keep", "kept")} disabled={busy !== null} aria-busy={busy === "keep"}>
      {t("keep", { plan: planName })}
    </button>
  );
  const onward = (label: string) => (
    <button type="button" className={styles.onward} onClick={() => setIndex((i) => i + 1)} disabled={busy !== null}>
      {label}
    </button>
  );

  let title = "";
  let body: ReactNode = null;
  let actions: ReactNode = null;

  if (done) {
    title = t(`done.${done}`, { plan: planName, date });
    body = done === "cancelled" ? <p className={styles.lead}>{t("undoHint")}</p> : null;
    actions = (
      <button type="button" className={buttonClass("secondary", "lg")} onClick={close} autoFocus>
        {t("close")}
      </button>
    );
  } else if (!status && !loadError) {
    title = t("reasonTitle");
    body = (
      <p className={styles.loading} role="status">
        <Loader2 aria-hidden="true" />
        {t("loading")}
      </p>
    );
  } else if (step === "reason") {
    title = t("reasonTitle");
    body = (
      <>
        <p className={styles.lead}>{t("reasonBody")}</p>
        <fieldset className={styles.reasons}>
          <legend className="visually-hidden">{t("reasonTitle")}</legend>
          {REASONS.map((r) => (
            <label key={r} className={styles.reason}>
              <input type="radio" name="cancel-reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
              <span>{t(`reasons.${r}`)}</span>
            </label>
          ))}
        </fieldset>
        <label className={styles.detailsLabel}>
          {t("detailsLabel")}
          <textarea className={styles.details} value={details} maxLength={1000} rows={2} onChange={(e) => setDetails(e.target.value)} />
          <span className={styles.hint}>{t("detailsHint")}</span>
        </label>
      </>
    );
    actions = (
      <>
        {keepButton}
        {loadError ? null : onward(t("continue"))}
      </>
    );
  } else if (step === "discount") {
    title = t("discountTitle");
    body = (
      <>
        <div className={styles.offer}>
          <span className={styles.offerBig}>25%</span>
          <p>
            {t("discountBody", {
              price: money(discountedCents(fullCents), full.currency),
              full: money(fullCents, full.currency),
              per: plan === "team" ? t("perSeat") : t("perMonth"),
            })}
          </p>
        </div>
        <Loses plan={plan} title={t("losesTitle")} names={names} lines={lines} />
      </>
    );
    actions = (
      <>
        <button type="button" className={buttonClass("primary", "lg")} onClick={() => void act("discount", "discount")} disabled={busy !== null} aria-busy={busy === "discount"}>
          {t("discountAccept")}
        </button>
        {onward(t("discountDecline"))}
      </>
    );
  } else if (step === "free_month") {
    title = t("freeTitle");
    body = (
      <div className={styles.offer}>
        <span className={styles.offerBig}>30</span>
        <p>{t("freeBody", { plan: planName })}</p>
      </div>
    );
    actions = (
      <>
        <button type="button" className={buttonClass("primary", "lg")} onClick={() => void act("free_month", "free_month")} disabled={busy !== null} aria-busy={busy === "free_month"}>
          {t("freeAccept")}
        </button>
        {onward(t("freeDecline", { plan: planName }))}
      </>
    );
  } else {
    title = refund ? t("refundTitle") : t("confirmTitle", { plan: planName });
    body = duplicate ? (
      <p className={styles.lead}>{t("duplicateBody", { name: teamName ?? "" })}</p>
    ) : refund ? (
      <p className={styles.lead}>{t("refundBody", { amount: money(refund.amount, refund.currency), plan: planName })}</p>
    ) : (
      <>
        <p className={styles.lead}>
          {t("confirmBody", { plan: planName, date })} {plan === "team" && teamName ? t("confirmTeam", { name: teamName }) : null}
        </p>
        <ul className={styles.facts}>
          <li>{t("nothingLost")}</li>
          <li>{t("undoHint")}</li>
        </ul>
      </>
    );
    actions = (
      <>
        {keepButton}
        <button
          type="button"
          className={buttonClass("secondary", "lg")}
          onClick={() => void (refund && !duplicate ? act("refund", "refunded") : act("cancel", "cancelled"))}
          disabled={busy !== null}
          aria-busy={busy === "cancel" || busy === "refund"}
        >
          {refund && !duplicate ? t("refundConfirm", { amount: money(refund.amount, refund.currency) }) : t("confirm")}
        </button>
      </>
    );
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="cancel-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className={styles.frame}>
        <CancelMascot mood={mood} />
        <div className={styles.content}>
          <div className={styles.top}>
            <span className={styles.step}>{done || !status ? "" : t("step", { n: Math.min(index, flow.length - 1) + 1, total: flow.length })}</span>
            <button type="button" className={styles.close} onClick={close} aria-label={t("close")}>
              <X aria-hidden="true" />
            </button>
          </div>
          <div className={styles.body} key={done ?? step}>
            <h2 id="cancel-title" className={styles.title}>
              {title}
            </h2>
            {body}
            {error || loadError ? (
              <p className={styles.error} role="alert">
                <AlertCircle aria-hidden="true" />
                {t(`errors.${error ?? loadError}`)}
              </p>
            ) : null}
          </div>
          <div className={styles.actions}>{actions}</div>
        </div>
      </div>
    </dialog>
  );
}

function Loses({ plan, title, names, lines }: { plan: "pro" | "team"; title: string; names: (k: string) => string; lines: (k: string) => string }) {
  return (
    <div className={styles.loses}>
      <span className={styles.losesTitle}>{title}</span>
      <ul>
        {LOSES[plan].map((id) => (
          <li key={id}>
            <span className={styles.losesIcon} aria-hidden="true">
              {FEATURE_ICONS[id] ? createElement(FEATURE_ICONS[id]) : null}
            </span>
            <span>
              <b>{names(id)}</b>
              <span>{lines(`${id}.line`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

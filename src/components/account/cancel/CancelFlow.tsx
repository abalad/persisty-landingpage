"use client";

import { AlertCircle, Check, Loader2, ShieldCheck, Undo2, X } from "lucide-react";
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
  /** A plan already set to end, inside the 7 days of a first purchase: straight to the refund. */
  refundOnly?: boolean;
}

/** What the person goes without at the period's end, by plan: the catalog's names. */
const LOSES: Record<"pro" | "team", string[]> = {
  pro: ["accountRotation", "requestQueue", "restorePoints"],
  team: ["teamBilling", "accountRotation", "requestQueue"],
};

const MOOD: Record<CancelStep, CancelMood> = { reason: "puzzled", discount: "hopeful", free_month: "pleading", confirm: "goodbye" };

/** "28 de outubro", with the year only when it is not this one. */
function dayOf(locale: Locale, iso: string): string {
  const date = new Date(iso);
  const year = date.getFullYear() === new Date().getFullYear() ? undefined : "numeric";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year }).format(date);
}

/**
 * Cancelling a paid plan, in a dialog: why, then the offers left (25% for
 * two months, then a free month), then the confirmation. The mascot takes
 * each step and says one line in its bubble; the step beside it says the
 * rest in as few words as it can. Staying is always the lime button; going
 * on is always a visible link. Escape or the close button leave the plan as
 * it is.
 */
export function CancelFlow({ orgId, plan, duplicate, teamName, onClose, api = retention, refundOnly = false }: Props) {
  const t = useTranslations("auth.account.cancel");
  const plans = useTranslations("pricing.plans");
  const names = useTranslations("pricing.features");
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
  /** The refund was refused by the server: the confirmation falls back to cancelling at the period's end. */
  const [refundRefused, setRefundRefused] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  /** When the current step appeared: the button that ends the plan ignores clicks for a moment, so a double click on "No" never confirms. */
  const shownAt = useRef(0);

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

  const flow = status ? steps(status, duplicate, refundOnly) : (["reason"] as CancelStep[]);
  const at = Math.min(index, flow.length - 1);
  const step = flow[at];
  // The offers already on screen up to this step: the final call says which were shown.
  const shown = flow.slice(0, at + 1).filter((s): s is Offer => s === "discount" || s === "free_month");

  // Each step (and the result) takes the focus to its title, so a screen reader hears it and no button carries over.
  useEffect(() => {
    shownAt.current = performance.now();
    titleRef.current?.focus();
  }, [step, done, status]);

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
    if (!res.ok) {
      if (action === "refund" && res.error === "not_refundable") setRefundRefused(true);
      return setError(res.error);
    }
    setDone(outcome);
  }

  const mood: CancelMood = done ? (done === "cancelled" || done === "refunded" ? "settled" : "celebrate") : MOOD[step];
  const date = status?.periodEnd ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(status.periodEnd)) : "";
  const day = status?.periodEnd ? dayOf(locale, status.periodEnd) : "";
  const money = (cents: number, currency: "BRL" | "USD") => formatPrice(locale, cents, currency, { explicit: true });
  const full = status?.price ?? priceFor(locale, plan === "team" ? "team" : "pro");
  const fullCents = "amount" in full ? full.amount : full.cents;
  const fullPrice = money(fullCents, full.currency);
  const refund = refundRefused ? null : (status?.refund ?? null);
  /** `at`: the click's own time stamp, on the same clock as `performance.now()`. */
  const ending = (at: number, action: RetentionAction, outcome: Done) => {
    if (at - shownAt.current < 450) return;
    void act(action, outcome);
  };

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
  let say = "";
  let body: ReactNode = null;
  let actions: ReactNode = null;

  if (done) {
    title = t(`done.${done}`, { plan: planName, date });
    say = t(done === "cancelled" || done === "refunded" ? "say.cancelled" : "say.kept");
    body = (
      <>
        {done === "cancelled" ? <p className={styles.lead}>{t("undoHint")}</p> : null}
        <div className={styles.doneActions}>
          <button type="button" className={buttonClass("secondary", "lg")} onClick={close}>
            {t("close")}
          </button>
        </div>
      </>
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
    say = t("say.reason");
    body = (
      <>
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
          <span className="visually-hidden">{t("detailsLabel")}</span>
          <textarea className={styles.details} value={details} maxLength={1000} rows={2} placeholder={t("detailsLabel")} onChange={(e) => setDetails(e.target.value)} />
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
    say = t("say.discount");
    body = (
      <>
        <div className={styles.offer}>
          <p className={styles.price}>
            <span className={styles.offerBig}>{money(discountedCents(fullCents), full.currency)}</span>
            <span className={styles.per}>{plan === "team" ? t("perSeatShort") : t("perMonthShort")}</span>
            <s className={styles.was} aria-hidden="true">
              {fullPrice}
            </s>
          </p>
          <p className={styles.terms}>{t("discountTerms", { full: fullPrice })}</p>
        </div>
        <div className={styles.loses}>
          <span className={styles.losesTitle}>{t("losesTitle", { plan: planName })}</span>
          <ul>
            {LOSES[plan].map((id) => (
              <li key={id}>
                <span className={styles.losesIcon} aria-hidden="true">
                  {FEATURE_ICONS[id] ? createElement(FEATURE_ICONS[id]) : null}
                </span>
                {names(id)}
              </li>
            ))}
          </ul>
        </div>
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
    title = t("freeTitle", { plan: planName });
    say = t("say.free_month");
    const zero = money(0, full.currency);
    body = (
      <div className={styles.offer}>
        <p className={styles.price}>
          <span className={`${styles.offerBig} ${styles.offerHuge}`}>30</span>
          <span className={styles.per}>{t("freeUnit")}</span>
        </p>
        <ul className={styles.gains}>
          <li>
            <Check aria-hidden="true" />
            {day ? t("freeCharge", { date: day, zero }) : t("freeChargeNext", { zero })}
          </li>
          <li>
            <Check aria-hidden="true" />
            {t("freeKeeps", { plan: planName })}
          </li>
          <li>
            <Check aria-hidden="true" />
            {t("freeAfter", { full: fullPrice, per: plan === "team" ? t("perSeat") : t("perMonth") })}
          </li>
        </ul>
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
    say = t(refund ? "say.refund" : duplicate ? "say.duplicate" : "say.confirm");
    body = refund ? (
      <>
        <p className={styles.lead}>{t("refundWhy")}</p>
        <dl className={styles.sheet}>
          <div>
            <dt>{t("refundBack")}</dt>
            <dd>{money(refund.amount, refund.currency)}</dd>
          </div>
          <div>
            <dt>{t("refundEnds", { plan: planName })}</dt>
            <dd>{t("refundNow")}</dd>
          </div>
          <div>
            <dt>{t("chargesLabel")}</dt>
            <dd>{t("chargesNone")}</dd>
          </div>
        </dl>
        <p className={styles.hint}>
          {t("refundBank")} {duplicate ? t("duplicateBody", { name: teamName ?? "" }) : null}
        </p>
      </>
    ) : duplicate ? (
      <p className={styles.lead}>{t("duplicateBody", { name: teamName ?? "" })}</p>
    ) : (
      <>
        <dl className={styles.sheet}>
          <div>
            <dt>{day ? t("confirmUntil", { date: day }) : t("confirmUntilEnd")}</dt>
            <dd>{t("confirmUntilValue", { plan: planName })}</dd>
          </div>
          <div>
            <dt>{t("confirmAfter")}</dt>
            <dd>{plan === "team" && teamName ? t("confirmTeam", { name: teamName }) : t("confirmAfterValue")}</dd>
          </div>
          <div>
            <dt>{t("chargesLabel")}</dt>
            <dd>{t("chargesNone")}</dd>
          </div>
        </dl>
        <ul className={styles.facts}>
          <li>
            <ShieldCheck aria-hidden="true" />
            {t("nothingLost")}
          </li>
          <li>
            <Undo2 aria-hidden="true" />
            {day ? t("undoUntil", { date: day }) : t("undoHint")}
          </li>
        </ul>
      </>
    );
    actions = (
      <>
        {keepButton}
        <button
          key="end"
          type="button"
          className={buttonClass("danger", "lg")}
          onClick={(e) => (refund ? ending(e.timeStamp, "refund", "refunded") : ending(e.timeStamp, "cancel", "cancelled"))}
          disabled={busy !== null}
          aria-busy={busy === "cancel" || busy === "refund"}
        >
          {refund ? t("refundConfirm", { amount: money(refund.amount, refund.currency) }) : t("confirm")}
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
        <CancelMascot mood={mood} line={say} />
        <div className={styles.content}>
          <div className={styles.top}>
            <span className={styles.step}>{done || !status ? "" : t("step", { n: at + 1, total: flow.length })}</span>
            <button type="button" className={styles.close} onClick={close} aria-label={t("close")}>
              <X aria-hidden="true" />
            </button>
          </div>
          <div className={done ? `${styles.body} ${styles.bodyDone}` : styles.body} key={done ?? step}>
            <h2 id="cancel-title" className={styles.title} ref={titleRef} tabIndex={-1}>
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
          {actions ? (
            <div className={styles.actions} key={`actions-${done ?? step}`}>
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

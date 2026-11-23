"use client";

import { AlertCircle, Loader2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { buttonClass } from "@/components/site/Button";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { isValidCode, normalizeCode, type AuthErrorKey } from "@/lib/auth";
import { accountStillThere, DELETED_KEY, deletion, goneLines, isFresh, readPreview, recapItems, supabaseAuth, type DeletionAuth, type DeletionPreview, type DeletionResult, type GoneLine } from "@/lib/deletion";
import { formatPrice } from "@/lib/pricing";
import signIn from "../auth.module.css";
import { CancelMascot } from "../cancel/CancelMascot";
import type { CancelMood } from "../cancel/mascotScene";
import styles from "../cancel/cancel.module.css";
import local from "./delete.module.css";

/** `what`: step 1, what goes and what stays. `code` and `confirm`: step 2, with an e-mailed code or without one after a recent sign-in. */
type Stage = "what" | "code" | "confirm";
type Problem = "wrongCode" | "failed" | "changed" | AuthErrorKey;

interface Props {
  onClose: () => void;
  /** Opens the existing cancelling dialog instead; absent when there is nothing to cancel. */
  onCancelInstead?: () => void;
  /** The delete-account call; fixtures pass a stand-in. */
  api?: typeof deletion;
  /** The sign-in calls; fixtures pass a stand-in. */
  auth?: DeletionAuth;
  /** Whether the account still exists, asked with the token the deletion used when it answers with an error: it may have gone all the same. */
  stillSignedIn?: (token: string | null) => Promise<boolean>;
}

const RESEND_AFTER = 60;
/** How long an e-mailed code works: going back and on again within it sends no other. */
const CODE_LIFE_MS = 10 * 60_000;
/** The button that deletes ignores clicks this soon after its step appears, so a double click on "Continue" never confirms. */
const GUARD_MS = 450;
/** Up to this many characters an e-mail address fits a line whole, on a phone too. */
const SHORT_ADDRESS = 24;
const MOOD: Record<Stage, CancelMood> = { what: "puzzled", code: "pleading", confirm: "pleading" };

/**
 * Deleting the account, in the cancelling dialog's frame: step 1 says what
 * goes and what stays with the person, step 2 confirms it with the sign-in's
 * e-mailed code, or without one when the person signed in with a code a
 * moment ago. While it deletes, nothing closes the dialog. Once the account
 * is gone the session ends here and the page after takes over.
 */
export function DeleteFlow({ onClose, onCancelInstead, api = deletion, auth = supabaseAuth, stillSignedIn = accountStillThere }: Props) {
  const t = useTranslations("auth.account.delete");
  const signInErrors = useTranslations("auth.signIn.errors");
  const plans = useTranslations("pricing.plans");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  /** When the current step appeared, on the clock of `performance.now()` and of events' `timeStamp`. */
  const shownAt = useRef(0);
  /** When the last code went out (ms): within its life, going back and on again reuses it. */
  const sentAt = useRef(0);
  /** A call is out: a second click or Enter never starts another, since two deletions at once fail one of them. */
  const working = useRef(false);

  const [preview, setPreview] = useState<DeletionPreview | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [stage, setStage] = useState<Stage>("what");
  const [code, setCode] = useState("");
  const [wait, setWait] = useState(0);
  const [sending, setSending] = useState(false);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  /** Counts the previews asked for: the session turning into another account's asks again. */
  const [loads, setLoads] = useState(0);

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  useEffect(() => {
    let alive = true;
    void api("preview", locale).then((res) => {
      if (!alive) return;
      if (res.ok) setPreview(readPreview(res.data));
      else setLoadFailed(true);
    });
    return () => {
      alive = false;
    };
  }, [api, locale, loads]);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  // Each step takes the focus to its title, or to the field when there is a code to type.
  const loaded = preview !== null;
  useEffect(() => {
    shownAt.current = performance.now();
    if (stage === "code") codeRef.current?.focus();
    else titleRef.current?.focus();
  }, [stage, loaded, loadFailed]);

  // While it deletes, Escape does nothing: stopping the key itself also stops the browser's second, uncancellable close.
  useEffect(() => {
    if (!busy) return;
    const hold = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    document.addEventListener("keydown", hold, true);
    return () => document.removeEventListener("keydown", hold, true);
  }, [busy]);

  /** Moves to a step; the guard against a double click starts now, not once the step has painted. */
  const show = (next: Stage) => {
    shownAt.current = performance.now();
    setStage(next);
  };

  const close = () => {
    if (busy) return;
    dialog.current?.close();
    onClose();
  };

  /** E-mails a code; the wait before another starts when it went out, and when it was refused for asking too often. A call that throws reads as no network. */
  async function mail(email: string): Promise<AuthErrorKey | null> {
    let err: AuthErrorKey | null;
    try {
      err = await auth.sendCode(email);
    } catch {
      err = "network";
    }
    if (!err) sentAt.current = Date.now();
    if (!err || err === "rateLimited") setWait(RESEND_AFTER);
    return err;
  }

  /** Checks the typed code. Supabase says `otp_expired` for a wrong code and for an old one alike; a call that throws reads as no network. */
  async function verify(email: string, typed: string): Promise<Problem | null> {
    try {
      const err = await auth.verifyCode(email, typed);
      return err === "expired" || err === "unknown" ? "wrongCode" : err;
    } catch {
      return "network";
    }
  }

  /** Whether the account is still there, asked with the token the deletion used; a check that throws leaves it where it was. */
  async function stillThere(token: string | null): Promise<boolean> {
    try {
      return await stillSignedIn(token);
    } catch {
      return true;
    }
  }

  /** The token the deletion goes with, kept for asking afterwards whether the account is still there. */
  async function currentToken(): Promise<string | null> {
    try {
      return await auth.accessToken();
    } catch {
      return null;
    }
  }

  async function onward() {
    if (!preview || working.current) return;
    working.current = true;
    setSending(true);
    setProblem(null);
    try {
      const token = await auth.accessToken();
      if (token && isFresh(token, Date.now())) return show("confirm");
      if (Date.now() - sentAt.current < CODE_LIFE_MS) return show("code");
      const err = await mail(preview.email);
      // Without a code on its way, the step stays here with the reason.
      if (err && err !== "rateLimited") return setProblem(err);
      setCode("");
      setProblem(err);
      show("code");
    } catch {
      setProblem("network");
    } finally {
      working.current = false;
      setSending(false);
    }
  }

  async function resend() {
    if (!preview || working.current) return;
    working.current = true;
    setSending(true);
    setProblem(null);
    try {
      const err = await mail(preview.email);
      setProblem(err);
      if (!err) setCode("");
    } finally {
      working.current = false;
      setSending(false);
      codeRef.current?.focus();
    }
  }

  /** `at`: the event's time stamp; a click that comes too soon after the step appeared is the tail of a double click. */
  async function confirm(at: number) {
    if (!preview || working.current || at - shownAt.current < GUARD_MS) return;
    if (stage === "code" && !isValidCode(normalizeCode(code))) return;
    working.current = true;
    setBusy(true);
    setProblem(null);
    /** On its way to the page after: the dialog stays as it is until the page changes. */
    let leaving = false;
    try {
      if (stage === "code") {
        const err = await verify(preview.email, code);
        if (err) {
          setProblem(err);
          codeRef.current?.focus();
          codeRef.current?.select();
          return;
        }
      }

      const token = await currentToken();
      // The account reviewed goes with the deletion: the function refuses it for any other.
      const res: DeletionResult = await api("delete", locale, preview.email).catch(() => ({ ok: false, error: "network" }) as const);
      if (!res.ok && res.error === "changed") {
        // The session is now another account's (another tab signed in as someone else): its own preview, from step 1, with the reason.
        sentAt.current = 0;
        setWait(0);
        setCode("");
        setPreview(null);
        setLoadFailed(false);
        show("what");
        setProblem("changed");
        setLoads((n) => n + 1);
        return;
      }
      if (!res.ok && res.error === "stale") {
        // The recent sign-in ran out with the dialog open: the code form, with a code on its way.
        setBusy(false);
        setSending(true);
        setCode("");
        show("code");
        setProblem(await mail(preview.email));
        return;
      }
      // A failure the server answered may still have deleted the account (the answer lost on the way, say): ask before saying it failed.
      if (res.ok || !(await stillThere(token))) {
        leaving = true;
        const sent = res.ok && res.data.confirmation_sent === true;
        try {
          sessionStorage.setItem(DELETED_KEY, JSON.stringify({ email: preview.email, sent }));
        } catch {
          // Private mode: the page after says less.
        }
        try {
          await auth.signOut();
        } catch {
          // The account is gone either way; the page after needs no session.
        }
        router.replace("/account-deleted");
        return;
      }
      // A code works once, and it has just signed the person in: a retry needs no other, so the form without a code takes over.
      if (stage === "code") show("confirm");
      setProblem("failed");
    } catch {
      setProblem("failed");
    } finally {
      if (!leaving) {
        working.current = false;
        setBusy(false);
        setSending(false);
      }
    }
  }

  const planName = (plan: "pro" | "team") => plans(`${plan}.name`);
  const listFormat = new Intl.ListFormat(locale, { type: "conjunction" });
  const strong = (chunks: ReactNode) => <strong className={local.em}>{chunks}</strong>;
  /** An e-mail address in bold, kept whole; a long one may break after its "@", never at a hyphen or a dot. */
  const address = (email: string) => {
    const at = email.lastIndexOf("@");
    if (at <= 0 || email.length <= SHORT_ADDRESS) {
      return (
        <strong className={`${local.em} ${local.address}`}>
          <span>{email}</span>
        </strong>
      );
    }
    return (
      <strong className={`${local.em} ${local.address} ${local.long}`}>
        <span>{email.slice(0, at + 1)}</span>
        <wbr />
        <span>{email.slice(at + 1)}</span>
      </strong>
    );
  };
  /** Each name in bold and the words between them not: "**Acme** e **Beta**". */
  const strongList = (names: string[]) =>
    listFormat.formatToParts(names).map((part, i) =>
      part.type === "element" ? (
        <strong key={i} className={local.em}>
          {part.value}
        </strong>
      ) : (
        part.value
      ),
    );

  function goneLine(line: GoneLine): ReactNode {
    switch (line.kind) {
      case "account": {
        const key = line.computers === 0 ? "accountNone" : line.computers === 1 ? "accountOne" : "account";
        return t.rich(`gone.${key}`, { email: line.email, count: line.computers, b: () => address(line.email) });
      }
      case "subscription":
        return line.refund
          ? t("gone.subscriptionRefund", { plan: planName(line.plan), amount: formatPrice(locale, line.refund.amount, line.refund.currency, { explicit: true }) })
          : t("gone.subscription", { plan: planName(line.plan) });
      case "teams":
        return line.names.length === 1 ? t.rich("gone.team", { name: line.names[0], b: strong }) : t.rich("gone.teams", { names: listFormat.format(line.names), b: () => strongList(line.names) });
      case "membership":
        return t.rich("gone.membership", { name: line.name, b: strong });
    }
  }

  const alert = (text: string) => (
    <p id="delete-error" className={`${signIn.error} ${local.alert}`} role="alert">
      <AlertCircle aria-hidden="true" />
      {text}
    </p>
  );
  const problemAlert = problem ? alert(problem === "wrongCode" || problem === "failed" || problem === "changed" ? t(problem) : signInErrors(problem)) : null;
  const heading = (text: string, lead: ReactNode) => (
    <div className={local.head}>
      <h2 id="delete-title" className={styles.title} ref={titleRef} tabIndex={-1}>
        {text}
      </h2>
      {lead ? (
        <p id="delete-lead" className={styles.lead}>
          {lead}
        </p>
      ) : null}
    </div>
  );

  let body: ReactNode;
  let last: ReactNode = null;
  let actions: ReactNode = null;
  let centred = false;
  /** Step 1 sits in the middle of the column: a short one (a free account) leaves no empty band, a long one fills it as it is. */
  let middle = false;

  if (!preview) {
    // A preview that did not load: its title and the reason, in the middle of the column.
    centred = loadFailed;
    body = (
      <>
        {heading(t("whatTitle"), null)}
        {loadFailed ? (
          alert(t("loadError"))
        ) : (
          <p className={styles.loading} role="status">
            <Loader2 aria-hidden="true" />
            {t("loading")}
          </p>
        )}
      </>
    );
  } else if (stage === "what") {
    middle = true;
    body = (
      <>
        {heading(t("whatTitle"), t("whatLead"))}
        <div className={local.group}>
          <h3 className={local.groupTitle}>{t("goneTitle")}</h3>
          <ul className={local.lines} role="list">
            {goneLines(preview).map((line, i) => (
              <li key={i}>{goneLine(line)}</li>
            ))}
          </ul>
        </div>
        {/* The column holds one more panel only in the place of what stays; it comes back with the next try. */}
        {problemAlert ?? (
          <div className={local.group}>
            <h3 className={local.groupTitle}>{t("keptTitle")}</h3>
            <ul className={local.lines} role="list">
              <li>{t("kept")}</li>
            </ul>
          </div>
        )}
      </>
    );
    actions = (
      <>
        {onCancelInstead ? (
          <button
            type="button"
            className={styles.onward}
            onClick={() => {
              dialog.current?.close();
              onCancelInstead();
            }}
            disabled={sending}
          >
            {t("cancelInstead")}
          </button>
        ) : null}
        <button type="button" className={buttonClass("danger", "md", local.act)} onClick={() => void onward()} aria-busy={sending}>
          {sending ? <Loader2 className={local.spin} aria-hidden="true" /> : null}
          {t("continue")}
        </button>
      </>
    );
  } else {
    const recap = recapItems(preview);
    const items = listFormat.format(recap.map((item) => (item.kind === "account" ? t("recapItem.account") : item.kind === "plan" ? t("recapItem.plan", { plan: planName(item.plan) }) : t("recapItem.team", { name: item.name }))));
    const recapLine = <p className={local.last}>{t.rich(recap.length > 1 ? "recapMany" : "recapOne", { items, b: strong })}</p>;
    const valid = isValidCode(normalizeCode(code));

    if (stage === "code") {
      body = (
        <>
          {heading(t("codeTitle"), t.rich("codeLead", { email: preview.email, b: () => address(preview.email) }))}
          <form
            className={local.form}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void confirm(e.timeStamp);
            }}
          >
            <label className={signIn.label}>
              {t("codeLabel")}
              <input
                ref={codeRef}
                className={`${signIn.input} ${signIn.code} ${local.codeField}`}
                type="text"
                name="code"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={14}
                value={code}
                readOnly={busy}
                onChange={(e) => {
                  setCode(e.target.value);
                  setProblem(null);
                }}
                aria-invalid={problem === "wrongCode"}
                aria-describedby={problem ? "delete-error delete-lead" : "delete-lead"}
              />
            </label>
            {problemAlert}
            <p className={local.resend}>
              {wait > 0 ? (
                t("resendIn", { seconds: wait })
              ) : (
                <button type="button" onClick={() => void resend()} disabled={sending || busy}>
                  {t("resend")}
                </button>
              )}
            </p>
          </form>
        </>
      );
      last = recapLine;
    } else {
      centred = true;
      body = (
        <>
          {heading(t("confirmTitle"), t("confirmLead"))}
          {recapLine}
          {problemAlert}
        </>
      );
    }
    actions = (
      <>
        <button
          type="button"
          className={styles.onward}
          onClick={() => {
            setProblem(null);
            show("what");
          }}
          disabled={busy || sending}
        >
          {t("back")}
        </button>
        <button
          type="button"
          className={buttonClass("danger", "md", `${local.act} ${local.solid}`)}
          onClick={(e) => void confirm(e.timeStamp)}
          disabled={stage === "code" && !valid && !busy}
          aria-busy={busy}
        >
          {busy ? <Loader2 className={local.spin} aria-hidden="true" /> : null}
          {busy ? t("busy") : t("submit")}
        </button>
      </>
    );
  }

  const say = !preview ? "" : busy ? t("say.busy") : t(`say.${stage}`);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="delete-title"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close();
      }}
    >
      <div className={styles.frame}>
        <CancelMascot mood={MOOD[stage]} line={say} />
        <div className={styles.content}>
          <div className={styles.top}>
            <span className={styles.step}>{preview ? t("step", { n: stage === "what" ? 1 : 2 }) : ""}</span>
            {busy ? null : (
              <button type="button" className={styles.close} onClick={close} aria-label={t("close")}>
                <X aria-hidden="true" />
              </button>
            )}
          </div>
          <div className={`${styles.body} ${local.body}${centred ? ` ${styles.bodyDone}` : ""}${middle ? ` ${local.middle}` : ""}`} key={preview ? stage : "loading"}>
            {body}
          </div>
          {last}
          {actions ? <div className={`${styles.actions} ${local.foot}`}>{actions}</div> : null}
        </div>
      </div>
    </dialog>
  );
}

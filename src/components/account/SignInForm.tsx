"use client";

import { AlertCircle, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { buttonClass } from "@/components/site/Button";
import { Link, useRouter } from "@/i18n/navigation";
import { authErrorKey, intentFromQuery, isValidCode, isValidEmail, normalizeCode, safeNext, type AuthErrorKey } from "@/lib/auth";
import { intentQuery } from "@/lib/intentQuery";
import { supabase } from "@/lib/supabase";
import styles from "./auth.module.css";

type Step = "email" | "code";
type ErrorKey = AuthErrorKey | "invalidCode";
const RESEND_AFTER = 60;

export function SignInForm() {
  const t = useTranslations("auth.signIn");
  const router = useRouter();
  const query = useSearchParams();
  const intent = intentFromQuery(query);
  const next = safeNext(query.get("next")) + intentQuery(intent);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKey | null>(null);
  const [wait, setWait] = useState(0);

  useEffect(() => {
    let alive = true;
    supabase()
      .auth.getSession()
      .then(({ data }) => {
        if (alive && data.session) router.replace(next);
      });
    return () => {
      alive = false;
    };
  }, [router, next]);

  useEffect(() => {
    if (wait <= 0) return;
    const id = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(id);
  }, [wait]);

  async function sendCode(e?: FormEvent) {
    e?.preventDefault();
    if (!isValidEmail(email)) return setError("invalidEmail");
    setBusy(true);
    setError(null);
    const { error: err } = await supabase().auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
    setBusy(false);
    if (err) return setError(authErrorKey(err));
    setStep("code");
    setCode("");
    setWait(RESEND_AFTER);
  }

  async function verify(e: FormEvent) {
    e.preventDefault();
    const token = normalizeCode(code);
    if (!isValidCode(token)) return setError("invalidCode");
    setBusy(true);
    setError(null);
    const { error: err } = await supabase().auth.verifyOtp({ email: email.trim(), token, type: "email" });
    if (err) {
      setBusy(false);
      return setError(authErrorKey(err));
    }
    router.replace(next);
  }

  return (
    <div className={styles.card}>
      <Image className={styles.icon} src="/app-icon.png" alt="" width={48} height={48} />
      <div>
        <h1 className={styles.title}>{step === "email" ? t("title") : t("codeTitle")}</h1>
        <p className={styles.body}>
          {step === "email" ? t("body") : t.rich("codeBody", { email: email.trim(), b: (chunks) => <strong className={styles.email}>{chunks}</strong> })}
        </p>
      </div>

      {intent.notify || intent.interest ? <p className={styles.intent}>{intent.interest ? t("intentEnterprise") : t("intentNotify")}</p> : null}

      {step === "email" ? (
        <form className={styles.form} onSubmit={sendCode} noValidate>
          <label className={styles.label}>
            {t("email")}
            <input
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              placeholder={t("emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error === "invalidEmail"}
              aria-describedby={error ? "auth-error" : undefined}
              autoFocus
              required
            />
          </label>
          <ErrorLine error={error} label={error ? t(`errors.${error}`) : ""} />
          <button type="submit" className={buttonClass("primary", "lg", styles.submit)} disabled={busy}>
            {busy ? t("sending") : t("send")}
            {busy ? null : <ArrowRight aria-hidden="true" style={{ width: 16, height: 16 }} />}
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={verify} noValidate>
          <label className={styles.label}>
            {t("code")}
            <input
              className={`${styles.input} ${styles.code}`}
              type="text"
              name="code"
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              aria-invalid={error === "invalidCode" || error === "expired"}
              aria-describedby={error ? "auth-error" : undefined}
              autoFocus
              required
            />
          </label>
          <ErrorLine error={error} label={error ? t(`errors.${error}`) : ""} />
          <button type="submit" className={buttonClass("primary", "lg", styles.submit)} disabled={busy}>
            {busy ? t("verifying") : t("verify")}
          </button>
          <div className={styles.row}>
            <button type="button" className={styles.textButton} disabled={wait > 0 || busy} onClick={() => sendCode()}>
              {wait > 0 ? t("resendIn", { seconds: wait }) : t("resend")}
            </button>
            <button
              type="button"
              className={styles.textButton}
              onClick={() => {
                setStep("email");
                setError(null);
              }}
            >
              {t("changeEmail")}
            </button>
          </div>
        </form>
      )}

      <p className={styles.fine}>{t("privacy")}</p>
      <p className={styles.fine}>
        {t.rich("terms", {
          terms: (chunks) => <Link href="/terms">{chunks}</Link>,
          privacy: (chunks) => <Link href="/privacy">{chunks}</Link>,
        })}
      </p>
    </div>
  );
}

function ErrorLine({ error, label }: { error: ErrorKey | null; label: string }) {
  if (!error) return <span id="auth-error" role="alert" aria-live="assertive" hidden />;
  return (
    <p id="auth-error" className={styles.error} role="alert">
      <AlertCircle aria-hidden="true" />
      {label}
    </p>
  );
}

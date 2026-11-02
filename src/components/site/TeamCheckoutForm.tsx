"use client";

import { AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import auth from "@/components/account/auth.module.css";
import type { Locale } from "@/i18n/routing";
import { DEFAULT_SEATS, MAX_SEATS, TEAM_NAME_MAX, teamProblem, type TeamOrder } from "@/lib/billing";
import { formatPlanPrice } from "@/lib/pricing";
import { buttonClass } from "./Button";
import styles from "./checkout.module.css";

interface Props {
  busy: boolean;
  /** A failed call's message, shown under the form. */
  error: string | null;
  onSubmit: (order: TeamOrder) => void;
  onBack: () => void;
}

/** The team's name and seats before Stripe, with the month's total in the visitor's currency. */
export function TeamCheckoutForm({ busy, error, onSubmit, onBack }: Props) {
  const t = useTranslations("pricing.checkout");
  const locale = useLocale() as Locale;
  const [name, setName] = useState("");
  const [seats, setSeats] = useState(String(DEFAULT_SEATS));
  const [shown, setShown] = useState(false);

  const order: TeamOrder = { name, seats: Number(seats) };
  const problem = teamProblem(order);
  const message = shown && problem ? t(`problems.${problem}`) : error;

  function submit(e: FormEvent) {
    e.preventDefault();
    setShown(true);
    if (problem || busy) return;
    onSubmit({ name: name.trim(), seats: order.seats });
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <label className={auth.label}>
        {t("teamName")}
        <input
          className={auth.input}
          name="team_name"
          value={name}
          maxLength={TEAM_NAME_MAX}
          placeholder={t("teamNamePlaceholder")}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={shown && (problem === "name" || problem === "nameLong")}
          autoFocus
          required
        />
      </label>
      <label className={auth.label}>
        {t("seats")}
        <input
          className={auth.input}
          name="seats"
          type="number"
          inputMode="numeric"
          min={1}
          max={MAX_SEATS}
          step={1}
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          aria-invalid={shown && problem === "seats"}
          aria-describedby="seats-hint"
          required
        />
        <span id="seats-hint" className={styles.hint}>
          {t("seatsHint")}
        </span>
      </label>
      <p className={styles.total} aria-live="polite">
        {problem === "seats" ? " " : t("total", { total: formatPlanPrice(locale, "team", order.seats) })}
      </p>
      {message ? (
        <p className={auth.error} role="alert">
          <AlertCircle aria-hidden="true" />
          {message}
        </p>
      ) : null}
      <button type="submit" className={buttonClass("primary", "md")} disabled={busy} aria-busy={busy}>
        {busy ? t("busy") : t("continue")}
      </button>
      <button type="button" className={buttonClass("ghost", "md")} onClick={onBack} disabled={busy}>
        {t("back")}
      </button>
    </form>
  );
}

"use client";

import { Copy, UserPlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { buttonClass, ButtonIcon } from "@/components/site/Button";
import type { Locale } from "@/i18n/routing";
import { isValidEmail } from "@/lib/auth";
import { freeSeats, inviteErrorKey, inviteLink, inviteMember, openPortal, removeMember, revokeInvite, type Team } from "@/lib/billing";
import auth from "./auth.module.css";
import styles from "./account.module.css";

interface Props {
  team: Team;
  userId: string;
  /** Reads the team again after a change. */
  onChanged: () => Promise<void>;
  onStatus: (status: { ok: boolean; text: string }) => void;
  /** The account page's relative time, "2 days ago". */
  relative: (iso: string) => string;
}

/** A team the account owns or administers: seats, members, pending invites and the invite form. */
export function TeamMembers({ team, userId, onChanged, onStatus, relative }: Props) {
  const t = useTranslations("auth.account.teams");
  const plan = useTranslations("auth.account.plan");
  const account = useTranslations("auth.account");
  const billing = useTranslations("pricing.checkout.errors");
  const locale = useLocale() as Locale;
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  const seats = team.seats ?? { seats: team.subscription.seats, members: team.members.length, pending: team.invites.length };
  const full = freeSeats(seats) === 0;
  const used = seats.members + seats.pending;
  const link = inviteLink(locale);

  async function run(key: string, action: () => Promise<{ ok: true } | { ok: false; code?: string }>, okText: string) {
    if (busy) return;
    setBusy(key);
    const result = await action();
    if (result.ok) {
      await onChanged();
      onStatus({ ok: true, text: okText });
    } else {
      onStatus({ ok: false, text: t(`errors.${inviteErrorKey(result.code)}`) });
    }
    setBusy(null);
    return result.ok;
  }

  async function invite(e: FormEvent) {
    e.preventDefault();
    if (full) return;
    if (!isValidEmail(email)) return onStatus({ ok: false, text: t("errors.invalidEmail") });
    const address = email.trim().toLowerCase();
    if (await run("invite", () => inviteMember(team.id, address), t("invited", { email: address }))) setEmail("");
  }

  async function portal() {
    if (busy) return;
    setBusy("portal");
    const error = await openPortal({ locale, go: () => {} }, team.id);
    if (error) {
      onStatus({ ok: false, text: billing(error) });
      setBusy(null);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      onStatus({ ok: true, text: t("copied") });
    } catch {
      onStatus({ ok: true, text: link });
    }
  }

  return (
    <div className={styles.box} data-team={team.id}>
      <div className={styles.row}>
        <div className={styles.rowMain}>
          <span className={styles.rowTitle}>{team.name}</span>
          <span className={styles.rowText}>{t("seats", { used, seats: seats.seats })}</span>
        </div>
        <button type="button" className={buttonClass("secondary", "md")} onClick={portal} disabled={busy !== null} aria-busy={busy === "portal"}>
          {busy === "portal" ? plan("opening") : plan("manage")}
        </button>
      </div>

      {team.members.map((m) => {
        const name = m.display_name?.trim() || m.email || t("noName");
        return (
          <div key={m.user_id} className={styles.row}>
            <div className={styles.device}>
              <div>
                <div className={styles.deviceName}>
                  {name}
                  {m.user_id === userId ? ` (${t("you")})` : null}
                </div>
                <div className={styles.deviceMeta}>{t(`roles.${m.role}`)}</div>
              </div>
              {m.role === "owner" ? null : confirming === m.user_id ? (
                <div className={styles.actions}>
                  <button type="button" className={buttonClass("ghost", "md")} onClick={() => setConfirming(null)}>
                    {t("cancel")}
                  </button>
                  <button
                    type="button"
                    className={buttonClass("secondary", "md")}
                    disabled={busy !== null}
                    onClick={async () => {
                      await run(`member-${m.user_id}`, () => removeMember(team.id, m.user_id), account("saved"));
                      setConfirming(null);
                    }}
                  >
                    {t("confirmRemove")}
                  </button>
                </div>
              ) : (
                <button type="button" className={buttonClass("ghost", "md")} onClick={() => setConfirming(m.user_id)}>
                  {t("remove")}
                </button>
              )}
              {confirming === m.user_id ? (
                <p className={styles.rowText} style={{ gridColumn: "1 / -1" }}>
                  {t("removeHint", { name })}
                </p>
              ) : null}
            </div>
          </div>
        );
      })}

      {team.invites.map((inv) => (
        <div key={inv.id} className={styles.row}>
          <div className={styles.device}>
            <div>
              <div className={styles.deviceName}>{inv.email}</div>
              <div className={styles.deviceMeta}>{t("pending", { when: relative(inv.created_at) })}</div>
            </div>
            <button
              type="button"
              className={buttonClass("ghost", "md")}
              disabled={busy !== null}
              onClick={() => run(`invite-${inv.id}`, () => revokeInvite(inv.id), account("saved"))}
            >
              {t("revoke")}
            </button>
          </div>
        </div>
      ))}

      <div className={styles.row}>
        <form className={styles.invite} onSubmit={invite} noValidate>
          <label className={auth.label}>
            {t("inviteEmail")}
            <input
              className={auth.input}
              type="email"
              name="invite_email"
              autoComplete="off"
              inputMode="email"
              placeholder={t("invitePlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={full}
            />
          </label>
          <button type="submit" className={buttonClass("primary", "md")} disabled={full || busy !== null} aria-busy={busy === "invite"}>
            <ButtonIcon>
              <UserPlus />
            </ButtonIcon>
            {busy === "invite" ? t("inviting") : t("invite")}
          </button>
        </form>
        {full ? (
          <div className={styles.full}>
            <span className={styles.rowText}>{t("full")}</span>
            <button type="button" className={buttonClass("secondary", "md")} onClick={portal} disabled={busy !== null}>
              {t("buySeats")}
            </button>
          </div>
        ) : null}
      </div>

      <div className={styles.row}>
        <div className={styles.rowMain}>
          <span className={styles.rowText}>{t("linkHint")}</span>
          <code className={styles.link}>{link}</code>
        </div>
        <button type="button" className={buttonClass("ghost", "md")} onClick={copy}>
          <ButtonIcon>
            <Copy />
          </ButtonIcon>
          {t("copyLink")}
        </button>
      </div>
    </div>
  );
}

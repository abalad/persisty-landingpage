import { useTranslations } from "next-intl";
import { cx } from "./parts";
import x from "./extra.module.css";

/**
 * The Team panel of My account on this site, as an owner sees it: seats,
 * people with their role, a pending invite and the invite by e-mail. It reuses
 * the account page's own words, so the replica says what the page says.
 */
export function TeamBillingMock() {
  const t = useTranslations("auth.account.teams");
  const plan = useTranslations("auth.account.plan");
  const m = useTranslations("mock.teamBilling");

  return (
    <div className={x.settings}>
      <div className={x.settingsTitle}>{m("title")}</div>
      <div className={x.box}>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>{m("team")}</span>
            <span className={x.boxSub}>{t("seats", { used: 3, seats: 5 })}</span>
          </div>
          <span className={cx(x.btn, x.btnGhost)}>{plan("manage")}</span>
        </div>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>
              Ana Souza ({t("you")})
            </span>
            <span className={x.boxSub}>{t("roles.owner")}</span>
          </div>
        </div>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>Bruno Lima</span>
            <span className={x.boxSub}>{t("roles.member")}</span>
          </div>
          <span className={cx(x.btn, x.btnGhost)}>{t("remove")}</span>
        </div>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>carla@rota.example</span>
            <span className={x.boxSub}>{t("pending", { when: m("when") })}</span>
          </div>
          <span className={cx(x.btn, x.btnGhost)}>{t("revoke")}</span>
        </div>
        <div className={x.boxRow} style={{ alignItems: "end" }}>
          <div className={x.boxMain} style={{ gap: "calc(6 * var(--u))" }}>
            <span className={x.label}>{t("inviteEmail")}</span>
            <span className={x.field} style={{ color: "var(--color-fg-subtle)" }}>
              {t("invitePlaceholder")}
            </span>
          </div>
          <span className={x.btn}>{t("invite")}</span>
        </div>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxSub} style={{ whiteSpace: "normal" }}>
              {t("linkHint")}
            </span>
          </div>
          <span className={cx(x.btn, x.btnGhost)}>{t("copyLink")}</span>
        </div>
      </div>
    </div>
  );
}

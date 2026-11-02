"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/site/Button";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import { renewOrder } from "@/lib/billing";
import { useAccount } from "../AccountProvider";
import { TeamMembers } from "../TeamMembers";
import styles from "../account.module.css";

/** The teams this account is in: people and invites for owners and admins, a line for members, and lapsed teams to subscribe again. */
export function TeamPanel() {
  const t = useTranslations("auth.account");
  const { user, billing, reloadBilling, setStatus, relative } = useAccount();
  const teams = billing?.teams ?? [];
  const lapsed = billing?.lapsedTeams ?? [];

  return (
    <section aria-labelledby="p-team" className={styles.panel}>
      <h2 id="p-team" className={styles.panelTitle}>
        {t("nav.team")}
      </h2>
      {teams.length === 0 && lapsed.length === 0 ? (
        <div className={styles.box}>
          <div className={styles.row}>
            <span className={`${styles.rowText} ${styles.rowMain}`}>{t("team.none")}</span>
            <ButtonLink href="/team" variant="secondary" trailingIcon={<ArrowRight />}>
              {t("team.see")}
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className={styles.teams}>
          {teams.map((team) =>
            team.seats ? (
              <TeamMembers key={team.id} team={team} userId={user.id} onChanged={reloadBilling} onStatus={setStatus} relative={relative} />
            ) : (
              <div key={team.id} className={styles.box}>
                <div className={styles.row}>
                  <span className={styles.rowText}>{t("teams.member", { name: team.name, plan: t(`plan.${team.subscription.plan}`) })}</span>
                </div>
              </div>
            ),
          )}
          {lapsed.map((team) => (
            <div key={team.id} className={styles.box}>
              <div className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{team.name}</span>
                  <span className={styles.rowText}>{t("teams.lapsed")}</span>
                </div>
                <SubscribeButton plan="team" variant="secondary" prefill={renewOrder(team)}>
                  {t("teams.subscribeAgain")}
                </SubscribeButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

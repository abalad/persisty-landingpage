"use client";

import { CreditCard, LayoutGrid, LogOut, Mail, MonitorSmartphone, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { buttonClass, ButtonIcon } from "@/components/site/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { accountSections, SECTION_PATH, type AccountSection } from "@/lib/account";
import { useAccount } from "./AccountProvider";
import styles from "./account.module.css";

const ICONS: Record<AccountSection, ReactNode> = {
  overview: <LayoutGrid />,
  billing: <CreditCard />,
  team: <Users />,
  devices: <MonitorSmartphone />,
  notifications: <Mail />,
};

/** My account's frame: who is signed in, the menu of its parts, and the part being shown. */
export function AccountShell({ children }: { children: ReactNode }) {
  const t = useTranslations("auth.account");
  const { user, billing, devices, notice, loadFailed, status, signOut } = useAccount();
  const pathname = usePathname();
  const sections = accountSections(billing);

  return (
    <>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.who}>{t("signedInAs", { email: user.email ?? "" })}</p>
        </div>
        <button type="button" className={buttonClass("secondary", "md")} onClick={() => void signOut()}>
          <ButtonIcon>
            <LogOut />
          </ButtonIcon>
          {t("signOut")}
        </button>
      </div>

      {loadFailed ? (
        <p className={`${styles.status} ${styles.statusError} ${styles.banner}`} role="alert">
          {t("loadError")}
        </p>
      ) : null}
      {notice ? (
        <p className={`${styles.notice} ${styles.banner}`} role="status">
          {t(`checkout.${notice}`)}
        </p>
      ) : null}

      <div className={styles.shell}>
        <nav className={styles.nav} aria-label={t("nav.label")}>
          {sections.map((s) => {
            const href = SECTION_PATH[s];
            const current = pathname === href;
            return (
              <Link key={s} href={href} className={styles.navItem} aria-current={current ? "page" : undefined}>
                <span className={styles.navIcon} aria-hidden="true">
                  {ICONS[s]}
                </span>
                <span>{t(`nav.${s}`)}</span>
                {s === "devices" ? <span className={styles.navCount}>{t("devices.count", { count: devices.length })}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className={styles.content}>
          {children}
          <p className={`${styles.status} ${status && !status.ok ? styles.statusError : ""}`} role="status" aria-live="polite">
            {status?.text ?? ""}
          </p>
        </div>
      </div>
    </>
  );
}

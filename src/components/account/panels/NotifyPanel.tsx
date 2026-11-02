"use client";

import { ArrowRight, Bell, BellOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { buttonClass, ButtonIcon, ButtonLink } from "@/components/site/Button";
import { useAccount } from "../AccountProvider";
import styles from "../account.module.css";

const PLATFORM_NAME = { macos: "macOS", windows: "Windows", linux: "Linux", mac: "macOS" } as Record<string, string>;

/** The e-mail when a new version of Persisty is out, for the systems this person asked about. */
export function NotifyPanel() {
  const t = useTranslations("auth.account");
  const locale = useLocale();
  const { meta, save } = useAccount();
  const notifying = meta.notify_release === true;
  const platforms = (Array.isArray(meta.notify_platforms) ? (meta.notify_platforms as string[]) : []).map((p) => PLATFORM_NAME[p] ?? p);
  const list = new Intl.ListFormat(locale, { type: "conjunction" });

  return (
    <section aria-labelledby="p-notify" className={styles.panel}>
      <h2 id="p-notify" className={styles.panelTitle}>
        {t("nav.notifications")}
      </h2>
      <div className={styles.box}>
        <div className={styles.row}>
          <div className={styles.rowMain}>
            <span className={styles.rowText}>
              {notifying ? (platforms.length ? t("notify.onPlatforms", { platforms: list.format(platforms) }) : t("notify.on")) : t("notify.off")}
            </span>
          </div>
          <div className={styles.actions}>
            <button type="button" className={buttonClass(notifying ? "secondary" : "primary", "md")} onClick={() => void save({ ...meta, notify_release: !notifying, locale })}>
              <ButtonIcon>{notifying ? <BellOff /> : <Bell />}</ButtonIcon>
              {notifying ? t("notify.turnOff") : t("notify.turnOn")}
            </button>
            <ButtonLink href="/download" variant="ghost" trailingIcon={<ArrowRight />}>
              {t("notify.download")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

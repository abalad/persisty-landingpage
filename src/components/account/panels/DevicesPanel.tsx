"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonClass } from "@/components/site/Button";
import { useAccount } from "../AccountProvider";
import styles from "../account.module.css";

const PLATFORM_NAME = { macos: "macOS", windows: "Windows", linux: "Linux", mac: "macOS" } as Record<string, string>;

/** The computers signed in to this account; removing one signs it out at its next license check. */
export function DevicesPanel() {
  const t = useTranslations("auth.account");
  const { devices, removeDevice, relative } = useAccount();
  const [confirming, setConfirming] = useState<string | null>(null);

  return (
    <section aria-labelledby="p-devices" className={styles.panel}>
      <h2 id="p-devices" className={styles.panelTitle}>
        {t("nav.devices")} <span className={styles.panelCount}>{t("devices.count", { count: devices.length })}</span>
      </h2>
      <div className={styles.box}>
        <div className={styles.row}>
          <span className={styles.rowText}>{devices.length ? t("devices.hint") : t("devices.empty")}</span>
        </div>
        {devices.map((d) => (
          <div key={d.id} className={styles.row}>
            <div className={styles.device}>
              <div>
                <div className={styles.deviceName}>{d.name}</div>
                <div className={styles.deviceMeta}>
                  {PLATFORM_NAME[d.platform] ?? d.platform} · {d.app_version} · {t("devices.lastSeen", { when: relative(d.last_seen_at) })}
                </div>
              </div>
              {confirming === d.id ? (
                <div className={styles.actions}>
                  <button type="button" className={buttonClass("ghost", "md")} onClick={() => setConfirming(null)}>
                    {t("devices.cancel")}
                  </button>
                  <button
                    type="button"
                    className={buttonClass("secondary", "md")}
                    onClick={async () => {
                      setConfirming(null);
                      await removeDevice(d.id);
                    }}
                  >
                    {t("devices.confirm")}
                  </button>
                </div>
              ) : (
                <button type="button" className={buttonClass("ghost", "md")} onClick={() => setConfirming(d.id)}>
                  {t("devices.revoke")}
                </button>
              )}
              {confirming === d.id ? (
                <p className={styles.rowText} style={{ gridColumn: "1 / -1" }}>
                  {t("devices.confirmHint", { name: d.name })}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

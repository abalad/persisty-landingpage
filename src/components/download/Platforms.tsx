"use client";

import { ArrowDownToLine, Bell, Laptop, Monitor, TerminalSquare } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Badge } from "@/components/site/Badge";
import { ButtonLink } from "@/components/site/Button";
import { usePlatform } from "@/components/site/DownloadButton";
import { formatSize, latestFor, PLATFORM_ORDER, primaryFile, type DesktopPlatform } from "@/lib/releases";
import styles from "./Platforms.module.css";

const GLYPH: Record<DesktopPlatform, ReactNode> = {
  mac: <Laptop />,
  windows: <Monitor />,
  linux: <TerminalSquare />,
};

export function Platforms() {
  const t = useTranslations("download");
  const locale = useLocale();
  const mine = usePlatform();
  const order = [...PLATFORM_ORDER].sort((a, b) => Number(b === mine) - Number(a === mine));

  return (
    <ul className={styles.list}>
      {order.map((p) => {
        const latest = latestFor(p);
        // The AppImage, or the .deb alone if that was all a release had for Linux.
        const main = latest ? (primaryFile(latest.files) ?? latest.files[0]) : undefined;
        const deb = latest?.files.find((f) => f.kind === "deb" && f !== main);
        const variant = p === mine ? "primary" : "secondary";
        return (
          <li key={p} id={p} className={`${styles.row} ${p === mine ? styles.mine : ""}`}>
            <span className={styles.glyph} aria-hidden="true">
              {GLYPH[p]}
            </span>
            <div className={styles.main}>
              <div className={styles.nameLine}>
                <span className={styles.name}>{t(`platforms.${p}.name`)}</span>
                <span className={styles.detail}>{t(`platforms.${p}.detail`)}</span>
                <Badge status={!main ? "in-development" : p === "mac" ? "available" : "preview"} />
                {p === mine ? <span className={styles.yours}>{t("yours")}</span> : null}
              </div>
              <p className={styles.note}>
                {main ? t.rich(`platforms.${p}.released`, { name: main.name, code: (chunks) => <code>{chunks}</code> }) : t(`platforms.${p}.note`)}
              </p>
            </div>
            <div className={styles.action}>
              {latest && main ? (
                <>
                  <ButtonLink href={main.url} variant={variant} icon={<ArrowDownToLine />}>
                    {t("download")}
                  </ButtonLink>
                  <span className={styles.file}>
                    {latest.version} · {formatSize(main.size, locale)}
                  </span>
                  {deb ? (
                    <a className={styles.alt} href={deb.url}>
                      {t("deb")} · {formatSize(deb.size, locale)}
                    </a>
                  ) : null}
                </>
              ) : (
                <ButtonLink href={`/sign-in?next=${encodeURIComponent("/account")}&notify=${p}`} variant={variant} icon={<Bell />}>
                  {t("notify")}
                </ButtonLink>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

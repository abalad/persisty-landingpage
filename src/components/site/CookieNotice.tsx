"use client";

import { Cookie } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { buttonClass } from "@/components/site/Button";
import { Link } from "@/i18n/navigation";
import type { Consent } from "@/lib/consent";
import styles from "./CookieNotice.module.css";

/**
 * The cookie notice: one line, the policy link and two equal pills, so that
 * declining is exactly as easy as accepting. It never blocks the page. When
 * someone opens it again from the footer (`focus`), the focus moves into it.
 */
export function CookieNotice({ onChoice, focus = false }: { onChoice: (choice: Consent) => void; focus?: boolean }) {
  const t = useTranslations("consent");
  const region = useRef<HTMLElement>(null);
  useEffect(() => {
    if (focus) region.current?.focus();
  }, [focus]);
  return (
    <div className={styles.wrap}>
      <section ref={region} className={styles.notice} aria-label={t("label")} tabIndex={-1}>
        <Cookie className={styles.icon} aria-hidden="true" />
        <p className={styles.text}>
          {t("text")}{" "}
          <Link className={styles.link} href="/privacy">
            {t("privacy")}
          </Link>
        </p>
        <div className={styles.actions}>
          <button type="button" className={buttonClass("secondary", "md")} onClick={() => onChoice("denied")}>
            {t("decline")}
          </button>
          <button type="button" className={buttonClass("secondary", "md")} onClick={() => onChoice("granted")}>
            {t("accept")}
          </button>
        </div>
      </section>
    </div>
  );
}

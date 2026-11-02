"use client";

import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { SubscribeButton } from "@/components/site/SubscribeButton";
import type { Locale } from "@/i18n/routing";
import { formatPlanPrice } from "@/lib/pricing";
import { triedAnchor } from "@/lib/tried";
import styles from "./plans.module.css";

/**
 * For someone the app sent here after blocking a Pro feature
 * (`/pro?tried=<anchor>#<anchor>`): a bar under the nav that stays while they
 * read, naming the feature, with the price and Subscribe beside it. People who
 * already pay are told where to sign in, so nobody buys twice.
 */
export function TriedBar() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}

function Bar() {
  const t = useTranslations("plans.common.tried");
  const locale = useLocale() as Locale;
  const anchor = triedAnchor(useSearchParams().get("tried"));
  const [closed, setClosed] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const open = anchor !== null && !closed;

  // The bar covers the top of the page: anchors scroll below it, and the page lands on the feature again once it is there.
  useEffect(() => {
    const root = document.documentElement;
    if (!open || !bar.current) {
      root.style.removeProperty("--tried-bar");
      return;
    }
    const el = bar.current;
    const measure = () => root.style.setProperty("--tried-bar", `${el.offsetHeight}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--tried-bar");
    };
  }, [open]);

  useEffect(() => {
    if (!anchor) return;
    document.getElementById(anchor)?.scrollIntoView({ block: "start" });
  }, [anchor]);

  if (!open) return null;
  return (
    <div ref={bar} className={styles.tried} role="region" aria-label={t("label")}>
      <div className={`container ${styles.triedInner}`}>
        <p className={styles.triedText}>
          <strong>{t("text", { feature: t(`names.${anchor}`) })}</strong>
          <span>{t("already")}</span>
        </p>
        <div className={styles.triedActions}>
          <span className={styles.triedPrice}>{t("price", { price: formatPlanPrice(locale, "pro") })}</span>
          <SubscribeButton plan="pro">{t("subscribe")}</SubscribeButton>
          <button type="button" className={styles.triedClose} onClick={() => setClosed(true)} aria-label={t("close")}>
            <X aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

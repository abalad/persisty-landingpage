"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/site/Button";
import { DELETED_KEY } from "@/lib/deletion";
import { CancelMascot } from "../cancel/CancelMascot";
import styles from "./deleted.module.css";

interface Kept {
  email?: string;
  sent?: boolean;
}

/** The page after the account is gone: what the deletion left in the browser's session says whether, and where, the confirmation went. */
export function Deleted() {
  const t = useTranslations("auth.account.delete");
  const [kept, setKept] = useState<Kept>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DELETED_KEY);
      sessionStorage.removeItem(DELETED_KEY);
      // After the first paint, which the server also made without it.
      if (raw) {
        const value = JSON.parse(raw) as Kept;
        queueMicrotask(() => setKept(value));
      }
    } catch {
      // No storage, or something else in the key: the page says the account is gone and nothing more.
    }
  }, []);

  const sent = kept.sent === true && typeof kept.email === "string" && kept.email !== "";

  return (
    <div className={styles.page}>
      <div className={styles.mascot}>
        <CancelMascot mood="settled" line="" />
      </div>
      <h1 className={styles.title}>{t("deletedTitle")}</h1>
      <p className={styles.body}>
        {sent ? <>{t.rich("deletedSent", { email: kept.email as string, b: (c) => <strong>{c}</strong> })} </> : null}
        {t("deletedFree")}
      </p>
      <ButtonLink href="/" className={styles.home}>
        {t("home")}
      </ButtonLink>
    </div>
  );
}

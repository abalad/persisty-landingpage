import { useTranslations } from "next-intl";
import styles from "./Badge.module.css";

/** `preview`: a build that is out but unsigned and not tested on real machines. */
export type Availability = "available" | "preview" | "in-development" | "planned";

/** Availability is always spelled out; the dot only repeats it. */
export function Badge({ status }: { status: Availability | "pro" }) {
  const t = useTranslations("badge");
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {status === "pro" ? null : <span className={styles.dot} aria-hidden="true" />}
      {t(status)}
    </span>
  );
}

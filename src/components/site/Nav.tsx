import { ArrowDownToLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AccountLink } from "./AccountLink";
import { ButtonLink } from "./Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import styles from "./Nav.module.css";

export function Nav() {
  const t = useTranslations("nav");
  const links = [
    { href: "/", label: t("start") },
    { href: "/#product", label: t("features") },
    { href: "/pricing", label: t("pricing") },
    { href: "/docs", label: t("docs") },
    { href: "/changelog", label: t("changelog") },
  ];

  return (
    <header className={styles.bar}>
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <nav className={`container ${styles.inner}`} aria-label={t("label")}>
        <Logo label={t("home")} spin />
        <ul className={styles.links}>
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <span className={styles.desktopOnly}>
            <LocaleSwitcher />
          </span>
          <span className={styles.desktopOnly}>
            <AccountLink />
          </span>
          <ButtonLink href="/download" icon={<ArrowDownToLine />}>
            {t("download")}
          </ButtonLink>
          <span className={styles.mobileOnly}>
            <MobileMenu
              links={[...links, { href: "/account", label: t("signIn") }]}
              openLabel={t("menu")}
              closeLabel={t("close")}
            />
          </span>
        </div>
      </nav>
    </header>
  );
}

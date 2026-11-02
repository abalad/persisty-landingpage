import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { contactHref } from "@/lib/site";
import styles from "./Footer.module.css";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const contact = contactHref("contact");
  const columns = [
    {
      title: t("product"),
      links: [
        { href: "/free", label: t("planFree") },
        { href: "/pro", label: t("planPro") },
        { href: "/team", label: t("planTeam") },
        { href: "/pricing", label: nav("pricing") },
        { href: "/download", label: nav("download") },
        { href: "/changelog", label: nav("changelog") },
      ],
    },
    {
      title: t("learn"),
      links: [
        { href: "/docs", label: nav("docs") },
        { href: "/docs/getting-started", label: t("gettingStarted") },
        { href: "/security", label: t("security") },
        { href: "/privacy", label: t("privacy") },
      ],
    },
    {
      title: t("company"),
      links: [
        ...(contact ? [{ href: contact, label: t("contact") }] : []),
        { href: "/account", label: t("account") },
        { href: "/brand", label: t("brand") },
        { href: "/terms", label: t("terms") },
      ],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Logo label={nav("home")} />
            <p className={styles.tagline}>{t("tagline")}</p>
          </div>
          {columns.map((c) => (
            <div key={c.title} className={styles.col}>
              <h2>{c.title}</h2>
              <ul>
                {c.links.map((l) => (
                  <li key={l.href + l.label}>
                    {/^(https?:|mailto:)/.test(l.href) ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <span>{t("copyright", { year: 2026 })}</span>
          <LocaleSwitcher placement="up" />
        </div>
      </div>
    </footer>
  );
}

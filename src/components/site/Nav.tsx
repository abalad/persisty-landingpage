import { ArrowDownToLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { createElement } from "react";
import { FEATURE_ICONS } from "@/components/plans/featureIcons";
import { Glimpse } from "@/components/plans/Glimpse";
import { Link } from "@/i18n/navigation";
import { MENU_FEATURES, SHOWN_PLANS, featureHref, planPath, type ShownPlanId } from "@/lib/plans";
import { AccountLink } from "./AccountLink";
import { Badge } from "./Badge";
import { ButtonLink } from "./Button";
import { FeaturesMenu, type MenuPlan } from "./FeaturesMenu";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import styles from "./Nav.module.css";

/** The feature each plan's menu shows on the right. */
const FEATURED = { free: "recovery", pro: "accountRotation", team: "teamBilling" } as const;

export function Nav() {
  const t = useTranslations("nav");
  const menu = useTranslations("nav.featuresMenu");
  const plans = useTranslations("pricing.plans");
  const names = useTranslations("pricing.features");
  const lines = useTranslations("features");

  const menuPlans: MenuPlan[] = SHOWN_PLANS.map((plan) => {
    const id = plan.id as ShownPlanId;
    const featured = plan.features.find((f) => f.id === FEATURED[id])!;
    return {
      id,
      name: plans(`${id}.name`),
      line: menu(`${id}.line`),
      href: planPath(id),
      seeAll: menu(`${id}.seeAll`),
      items: MENU_FEATURES[id].map((fid) => {
        const f = plan.features.find((x) => x.id === fid)!;
        return {
          href: featureHref(id, f),
          name: names(fid),
          line: lines(`${fid}.line`),
          icon: FEATURE_ICONS[fid] ? createElement(FEATURE_ICONS[fid]) : null,
          badge: f.status === "planned" ? <Badge status="planned" /> : undefined,
        };
      }),
      featured: { title: menu(`${id}.featuredTitle`), body: menu(`${id}.featuredBody`), href: featureHref(id, featured), glimpse: <Glimpse id={FEATURED[id]} /> },
    };
  });

  const links = [
    { href: "/", label: t("start") },
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
          <li>
            <Link href={links[0].href}>{links[0].label}</Link>
          </li>
          <li>
            <FeaturesMenu label={t("features")} plans={menuPlans} />
          </li>
          {links.slice(1).map((l) => (
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
              links={[
                links[0],
                {
                  label: t("features"),
                  plans: menuPlans.map((p) => ({
                    name: p.name,
                    href: p.href,
                    seeAll: p.seeAll,
                    items: p.items.map((it) => ({ href: it.href, label: it.name })),
                  })),
                },
                ...links.slice(1),
                { href: "/account", label: t("signIn") },
              ]}
              openLabel={t("menu")}
              closeLabel={t("close")}
            />
          </span>
        </div>
      </nav>
    </header>
  );
}

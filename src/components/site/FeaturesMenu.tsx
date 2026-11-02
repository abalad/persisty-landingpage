"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { ShownPlanId } from "@/lib/plans";
import styles from "./FeaturesMenu.module.css";

export interface MenuItem {
  href: string;
  name: string;
  line: string;
  icon: ReactNode;
  badge?: ReactNode;
}

export interface MenuPlan {
  id: ShownPlanId;
  name: string;
  line: string;
  href: string;
  seeAll: string;
  items: MenuItem[];
  featured: { title: string; body: string; href: string; glimpse: ReactNode };
}

/**
 * "Features" in the nav: the plans on the left, the chosen plan's features in
 * the middle, one of them shown on the right. Every plan's HTML comes ready
 * from the server (search engines see the links); the script only opens,
 * closes and switches the plan. Adapted from the KoraPoker site's menu.
 */
export function FeaturesMenu({ label, plans }: { label: string; plans: MenuPlan[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ShownPlanId>(plans[0]?.id ?? "free");
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const isOpen = open && openOn === pathname;

  const show = (next: boolean) => {
    setOpen(next);
    setOpenOn(next ? pathname : null);
  };

  useEffect(() => {
    if (!isOpen) return;
    const outside = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) show(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Focus inside the panel goes back to the button instead of vanishing with it.
      if (root.current?.contains(document.activeElement) && document.activeElement !== button.current) button.current?.focus();
      show(false);
    };
    // Under 1000px the nav folds into the mobile menu; this panel has no place there.
    const narrow = window.matchMedia("(max-width: 1000px)");
    const fold = () => narrow.matches && show(false);
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    narrow.addEventListener("change", fold);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
      narrow.removeEventListener("change", fold);
    };
    // `show` only sets state; it is the same on every render in effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /** One Tab stop on the plans (the open one); the arrows, Home and End move between them. */
  const move = (e: ReactKeyboardEvent<HTMLButtonElement>, current: ShownPlanId) => {
    const i = plans.findIndex((p) => p.id === current);
    const to =
      e.key === "ArrowDown" || e.key === "ArrowRight" ? i + 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? plans.length - 1 : null;
    if (to === null) return;
    e.preventDefault();
    const next = plans[(to + plans.length) % plans.length];
    setActive(next.id);
    document.getElementById(`${id}-tab-${next.id}`)?.focus();
  };

  const close = () => show(false);

  return (
    <div ref={root} className={styles.root}>
      <button ref={button} type="button" className={styles.trigger} aria-expanded={isOpen} aria-controls={`${id}-panel`} onClick={() => show(!isOpen)}>
        {label}
        <ChevronDown aria-hidden="true" className={styles.chevron} />
      </button>
      <div className={styles.panel} id={`${id}-panel`} hidden={!isOpen}>
        <div className={styles.plans} role="tablist" aria-orientation="vertical" aria-label={label}>
          {plans.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`${id}-tab-${p.id}`}
              aria-selected={p.id === active}
              aria-controls={`${id}-plan-${p.id}`}
              tabIndex={p.id === active ? 0 : -1}
              className={styles.plan}
              onMouseEnter={() => setActive(p.id)}
              onFocus={() => setActive(p.id)}
              onClick={() => setActive(p.id)}
              onKeyDown={(e) => move(e, p.id)}
            >
              <span className={styles.planName}>{p.name}</span>
              <span className={styles.planLine}>{p.line}</span>
            </button>
          ))}
        </div>
        {plans.map((p) => (
          <div key={p.id} id={`${id}-plan-${p.id}`} className={styles.body} role="tabpanel" aria-labelledby={`${id}-tab-${p.id}`} hidden={p.id !== active}>
            <div className={styles.main}>
              <div className={styles.head}>
                <span className={styles.headName}>{p.name}</span>
                <Link href={p.href} className={styles.seeAll} onClick={close}>
                  {p.seeAll}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </div>
              <ul className={styles.items}>
                {p.items.map((it) => (
                  <li key={it.href + it.name}>
                    <Link href={it.href} className={styles.item} onClick={close}>
                      <span className={styles.icon} aria-hidden="true">
                        {it.icon}
                      </span>
                      <span className={styles.text}>
                        <span className={styles.name}>
                          {it.name}
                          {it.badge}
                        </span>
                        <span className={styles.line}>{it.line}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href={p.featured.href} className={styles.featured} onClick={close}>
              {p.featured.glimpse}
              <span className={styles.featuredTitle}>{p.featured.title}</span>
              <span className={styles.featuredBody}>{p.featured.body}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

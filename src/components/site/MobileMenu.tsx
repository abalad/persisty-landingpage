"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./MobileMenu.module.css";

/** A plain link, or a group that opens: "Features", with each plan and its features. */
export type MobileLink =
  | { href: string; label: string; plans?: undefined }
  | { href?: undefined; label: string; plans: { name: string; href: string; seeAll: string; items: { href: string; label: string }[] }[] };

interface MobileMenuProps {
  links: MobileLink[];
  openLabel: string;
  closeLabel: string;
}

export function MobileMenu({ links, openLabel, closeLabel }: MobileMenuProps) {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on; navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean | ((was: boolean) => boolean)) =>
    setOpenOn((prev) => ((typeof next === "function" ? next(prev === pathname) : next) ? pathname : null));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open ? (
        <div id="mobile-menu" className={styles.panel}>
          {links.map((l) =>
            l.plans ? (
              <details key={l.label} className={styles.group}>
                <summary>{l.label}</summary>
                {l.plans.map((p) => (
                  <details key={p.href} className={styles.plan}>
                    <summary>{p.name}</summary>
                    <ul>
                      {p.items.map((it) => (
                        <li key={it.href + it.label}>
                          <Link href={it.href} onClick={() => setOpen(false)}>
                            {it.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={p.href} className={styles.seeAll} onClick={() => setOpen(false)}>
                          {p.seeAll}
                        </Link>
                      </li>
                    </ul>
                  </details>
                ))}
              </details>
            ) : (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ),
          )}
          <div className={styles.locale}>
            <LocaleSwitcher placement="up" />
          </div>
        </div>
      ) : null}
    </>
  );
}

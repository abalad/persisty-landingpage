import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./Button.module.css";

/** `danger`: the graphite pill in coral, for the button that ends something (a subscription). */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return [styles.button, styles[variant], styles[size], extra].filter(Boolean).join(" ");
}

export function ButtonIcon({ children }: { children: ReactNode }) {
  return (
    <span className={styles.icon} aria-hidden="true">
      {children}
    </span>
  );
}

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  className?: string;
  children: ReactNode;
}

/** A pill that navigates. Internal paths go through the locale-aware Link. */
export function ButtonLink({ href, variant, size, icon, trailingIcon, className, children }: ButtonLinkProps) {
  const cls = buttonClass(variant, size, className);
  const content = (
    <>
      {icon ? <ButtonIcon>{icon}</ButtonIcon> : null}
      <span>{children}</span>
      {trailingIcon ? <ButtonIcon>{trailingIcon}</ButtonIcon> : null}
    </>
  );
  if (/^(https?:|mailto:|#)/.test(href)) {
    return (
      <a className={cls} href={href}>
        {content}
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
      {content}
    </Link>
  );
}

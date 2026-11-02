"use client";

import { AlertCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import auth from "@/components/account/auth.module.css";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { onPageRestored } from "@/lib/bfcache";
import { subscribe, type BillingErrorKey, type Navigation, type TeamOrder } from "@/lib/billing";
import type { PaidPlan } from "@/lib/pricing";
import { buttonClass, type ButtonVariant } from "./Button";
import styles from "./checkout.module.css";
import { TeamCheckoutForm } from "./TeamCheckoutForm";

interface Props {
  plan: PaidPlan;
  variant?: ButtonVariant;
  children: ReactNode;
  /** Team only: subscribing an existing team again, the form starts from it and the checkout names it. */
  prefill?: Required<TeamOrder>;
}

/**
 * "Subscribe": sign-in when needed, then Stripe's checkout. Team asks for
 * the team's name and seats first. Coming back from sign-in with
 * `?plan=` in the address carries on where the visitor left off.
 */
export function SubscribeButton(props: Props) {
  return (
    <Suspense
      fallback={
        <button type="button" className={buttonClass(props.variant ?? "primary", "md")} disabled>
          {props.children}
        </button>
      }
    >
      <Subscribe {...props} />
    </Suspense>
  );
}

function Subscribe({ plan, variant = "primary", children, prefill }: Props) {
  const t = useTranslations("pricing.checkout");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const query = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<BillingErrorKey | null>(null);
  const [form, setForm] = useState(false);
  const running = useRef(false);
  const resumed = useRef(false);

  async function start(team?: TeamOrder) {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError(null);
    const nav: Navigation = { locale, go: (path) => router.push(path) };
    const result = await subscribe(plan, nav, team);
    if (result === "teamForm") setForm(true);
    if (typeof result === "object") setError(result.error);
    // Stripe is loading: the button stays busy so it is not pressed twice.
    if (result !== "checkout" && result !== "portal") {
      running.current = false;
      setBusy(false);
    }
  }

  // Back from Stripe can bring the page back exactly as it was left: busy.
  useEffect(
    () =>
      onPageRestored(() => {
        running.current = false;
        setBusy(false);
      }),
    [],
  );

  useEffect(() => {
    if (prefill || resumed.current || query.get("plan") !== plan) return;
    resumed.current = true;
    // Back from Stripe should not start the checkout again.
    window.history.replaceState(null, "", window.location.pathname);
    void start();
    // Once, when the page opens with this plan chosen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, plan, prefill]);

  if (form) {
    return (
      <TeamCheckoutForm
        busy={busy}
        error={error ? t(`errors.${error}`) : null}
        initial={prefill}
        onSubmit={(order) => void start(prefill ? { ...order, orgId: prefill.orgId } : order)}
        onBack={() => {
          setForm(false);
          setError(null);
        }}
      />
    );
  }

  return (
    <div className={styles.stack}>
      <button type="button" className={buttonClass(variant, "md")} onClick={() => void start()} disabled={busy} aria-busy={busy}>
        {busy ? t("busy") : children}
      </button>
      {error ? (
        <p className={auth.error} role="alert">
          <AlertCircle aria-hidden="true" />
          {t(`errors.${error}`)}
        </p>
      ) : null}
    </div>
  );
}

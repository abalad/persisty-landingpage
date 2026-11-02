import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Suspense, use } from "react";
import { AccountProvider } from "@/components/account/AccountProvider";
import { AccountShell } from "@/components/account/AccountShell";
import styles from "@/components/account/account.module.css";

/** Every part of My account shares one load of the account and the menu beside it. */
export default function AccountLayout({ children, params }: LayoutProps<"/[locale]/account">) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("auth.account");
  const loading = (
    <p className={styles.loading} role="status">
      <Loader2 aria-hidden="true" />
      {t("loading")}
    </p>
  );
  return (
    <div className={`container ${styles.page}`}>
      <Suspense fallback={loading}>
        <AccountProvider fallback={loading}>
          <AccountShell>{children}</AccountShell>
        </AccountProvider>
      </Suspense>
    </div>
  );
}

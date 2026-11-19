"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { buttonClass } from "@/components/site/Button";
import { useRouter } from "@/i18n/navigation";
import { planSummary } from "@/lib/account";
import { cancelTarget, paysSomething } from "@/lib/deletion";
import { useAccount } from "../AccountProvider";
import { CancelFlow } from "../cancel/CancelFlow";
import o from "../panels/overview.module.css";
import { DeleteFlow } from "./DeleteFlow";

type Dialog = "delete" | "cancel" | null;

/**
 * The last section of My account: one sentence on what deleting does and the
 * button that opens the dialog. `open` starts it open, for `/account/delete`,
 * where closing it, or the cancelling dialog it handed over to, goes back to
 * My account (a reload there would open the deletion again). The dialog's link
 * to cancelling instead hands over to the cancelling dialog.
 */
export function DeleteSection({ open }: { open?: boolean }) {
  const t = useTranslations("auth.account.delete");
  const router = useRouter();
  const { billing, reloadBilling } = useAccount();
  const [dialog, setDialog] = useState<Dialog>(open ? "delete" : null);
  const target = billing ? cancelTarget(billing) : null;
  const pays = billing ? paysSomething(billing) : false;
  const teamName = billing ? planSummary(billing)?.viaTeam : undefined;

  return (
    <section aria-labelledby="o-delete" className={o.team}>
      <div className={o.teamMain}>
        <h2 id="o-delete" className={o.teamTitle}>
          {t("sectionTitle")}
        </h2>
        <p className={o.upBody}>{t(pays ? "sectionBody" : "sectionBodyFree")}</p>
      </div>
      <button type="button" className={buttonClass("danger", "md")} onClick={() => setDialog("delete")}>
        {t("open")}
      </button>
      {dialog === "delete" ? (
        <DeleteFlow
          onClose={() => {
            setDialog(null);
            if (open) router.replace("/account");
          }}
          onCancelInstead={target ? () => setDialog("cancel") : undefined}
        />
      ) : null}
      {dialog === "cancel" && target ? (
        <CancelFlow
          orgId={target.orgId}
          plan={target.plan}
          duplicate={target.duplicate}
          teamName={teamName}
          onClose={(changed) => {
            setDialog(null);
            if (open) router.replace("/account");
            if (changed) void reloadBilling();
          }}
        />
      ) : null}
    </section>
  );
}

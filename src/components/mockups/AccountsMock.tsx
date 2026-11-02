"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimeline } from "@/hooks/useTimeline";
import { AgentGlyph, cx } from "./parts";
import x from "./extra.module.css";

interface Account {
  email: string;
  plan: string;
  five: number;
  seven: number;
  local?: boolean;
  out?: string;
}

/** A request arrives, the roomiest account lights up, the session is placed. */
const STEPS = [900, 2600, 1800];

export function AccountsMock() {
  const t = useTranslations("mock.accounts");
  const reduced = useReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  const live = useTimeline(STEPS, visible && !reduced, 2);
  const step = reduced ? 2 : live;
  const placed = step >= 1;

  const accounts: Account[] = [
    { email: "ana@example.com", plan: "Max", five: 34, seven: 61, local: true },
    { email: "ana@empresa.example", plan: "Team", five: 92, seven: 48, out: t("renewsAt", { time: t("renewsTime") }) },
    { email: "dev@rota.example", plan: "Pro", five: placed ? 13 : 12, seven: 22 },
  ];
  const target = 2;

  return (
    <div ref={ref} className={x.settings}>
      <div className={x.settingsTitle}>{t("title")}</div>
      <div className={x.group}>{t("group")}</div>
      <div className={x.box}>
        {accounts.map((a, i) => (
          <div key={a.email} className={cx(x.boxRow, placed && i === target && x.boxRowLit)}>
            <AgentGlyph kind="claude" />
            <div className={x.boxMain}>
              <span className={x.boxTitle}>
                {a.email} <span className={x.planTag}>{a.plan}</span>
              </span>
              {a.out || a.local ? (
                <span className={x.boxSub} style={a.out ? { color: "var(--color-warn)" } : undefined}>
                  {a.out ? a.out : t("thisComputer")}
                </span>
              ) : null}
            </div>
            <div className={x.meters}>
              <span>5 h</span>
              <span className={cx(x.track, a.five >= 90 && x.trackWarn)}>
                <span style={{ width: `${a.five}%` }} />
              </span>
              <b>{a.five}%</b>
              <span>7 d</span>
              <span className={x.track}>
                <span style={{ width: `${a.seven}%` }} />
              </span>
              <b>{a.seven}%</b>
            </div>
          </div>
        ))}
      </div>
      <div className={x.box}>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>{t("rotation")}</span>
            <span className={x.boxSub} style={{ whiteSpace: "normal" }}>
              {t("rotationHint")}
            </span>
          </div>
          <span className={x.toggle} />
        </div>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>{t("rotationLimit")}</span>
            <span className={x.boxSub} style={{ whiteSpace: "normal" }}>
              {t("rotationLimitHint")}
            </span>
          </div>
          <span className={cx(x.field, x.select)} style={{ minWidth: "calc(84 * var(--u))", gap: "calc(8 * var(--u))" }}>
            90% <span aria-hidden="true">▾</span>
          </span>
        </div>
        <div className={x.boxRow}>
          <div className={x.boxMain}>
            <span className={x.boxTitle}>{t("rotationResume")}</span>
          </div>
          <span className={x.toggle} />
        </div>
      </div>
      <div className={x.route}>
        {step >= 0 ? (
          <span className={cx(!reduced && x.routeIn)} key={step === 0 ? "ask" : "placed"} style={{ display: "inline-flex", alignItems: "center", gap: "calc(8 * var(--u))", flexWrap: "wrap" }}>
            <AgentGlyph kind="claude" />
            <strong>{t("newSession")}</strong>
            {placed ? (
              <>
                <ArrowRight />
                {t("goesTo")} <strong>{accounts[target].email}</strong>
                <span>· {t("because")}</span>
              </>
            ) : null}
          </span>
        ) : null}
      </div>
    </div>
  );
}

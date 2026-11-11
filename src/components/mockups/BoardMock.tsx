"use client";

import { AlertCircle, ChevronRight, Hand, KeyRound, Loader2, MessageCircleQuestion, SquareKanban, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimeline } from "@/hooks/useTimeline";
import { formatPrice } from "@/lib/pricing";
import { CommandButtons, Rail, StatusBar, TopBar, Window, cx } from "./parts";
import { focusShot, READ_ZOOM, type Rect } from "./tour";
import { TOUR_QUERY, WindowTour, type TourChapter, type TourCopy } from "./WindowTour";
import s from "./app.module.css";
import b from "./board.module.css";

type Column = "needs_you" | "working" | "answered" | "error";
const COLUMNS: Column[] = ["needs_you", "working", "answered", "error"];
const TONE: Record<Column, string> = { needs_you: "var(--color-warn)", working: "var(--color-info)", answered: "var(--color-ok)", error: "var(--color-danger)" };

/** One session on the board: its name and how long ago, what it wants, where it lives. */
interface Card {
  id: string;
  name: string;
  time: string;
  what: ReactNode;
  where: string;
  unread?: boolean;
  focal?: boolean;
}

/** The catalogue's agent works, then answers: the one card that changes column. */
const STEPS = [5200, 6800];
const ANSWERED = 1;
/** One card's height and the gap above it, in app pixels: what Answered grows by. */
const CARD_ROOM = 118;
/** How long a card takes to glide to its new column (ms). */
const GLIDE_MS = 520;

/**
 * Every agent session of every project in four columns: the oldest wait first and framed in amber, what each one asks,
 * does, said or hit. The catalogue's agent finishes while you look: its card glides from Working to Answered.
 */
function BoardScene({ step, animate, className }: { step: number; animate: boolean; className?: string }) {
  const t = useTranslations("mock");
  const locale = useLocale() as Locale;
  const root = useRef<HTMLDivElement>(null);
  const before = useRef(new Map<string, { x: number; y: number }>());
  const answered = step === ANSWERED;
  const min = (count: number) => t("board.minutes", { count });

  const cards: Record<Column, Card[]> = {
    needs_you: [
      {
        id: "checkout",
        name: "checkout",
        time: min(14),
        focal: true,
        where: "Rota · feat/checkout",
        what: (
          <>
            <KeyRound aria-hidden="true" />
            <span className={b.tool}>Bash</span>
            <code className={b.code}>pnpm test:e2e checkout.spec.ts</code>
          </>
        ),
      },
      { id: "frete", name: t("board.names.shipping"), time: min(6), where: "Quintal", what: <Asked text={t("board.shippingAsks")} /> },
      { id: "api", name: "api", time: min(2), unread: true, where: "Rota", what: <Asked text={t("board.apiAsks")} /> },
    ],
    working: [
      ...(answered
        ? []
        : [
            {
              id: "catalogo",
              name: t("sessions.catalog"),
              time: t("board.now"),
              where: "Quintal · feat/filtros",
              what: (
                <>
                  <span className={b.tool}>{t("board.editing")}</span>
                  <code className={b.code}>src/catalogo/filtros.ts (+18 −4)</code>
                </>
              ),
            },
          ]),
      {
        id: "migracao",
        name: t("board.names.migration"),
        time: min(1),
        where: "Bússola",
        what: (
          <>
            <span className={b.tool}>{t("board.running")}</span>
            <code className={b.code}>cargo test --workspace</code>
          </>
        ),
      },
    ],
    answered: [
      ...(answered ? [{ id: "catalogo", name: t("sessions.catalog"), time: t("board.now"), unread: true, where: "Quintal · feat/filtros", what: <Said text={t("board.catalogSaid")} /> }] : []),
      { id: "docs", name: "docs", time: min(3), unread: true, where: "Maré", what: <Said text={t("board.docsSaid")} /> },
      { id: "login", name: "login", time: min(12), where: "Pulso", what: <Said text={t("board.loginSaid")} /> },
    ],
    error: [
      {
        id: "relatorio",
        name: t("board.names.report"),
        time: min(8),
        unread: true,
        where: "Vela",
        what: (
          <>
            <AlertCircle aria-hidden="true" />
            <span className={b.text}>{t("board.rateLimit")}</span>
          </>
        ),
      },
    ],
  };
  const unread = COLUMNS.reduce((n, c) => n + cards[c].filter((x) => x.unread).length, 0);

  // The card that changed column glides there from where it was (FLIP), as the app's View Transition does. Positions
  // are taken against the board itself, so scrolling the page between two steps moves nothing.
  useLayoutEffect(() => {
    const host = root.current;
    if (!host) return;
    const origin = host.getBoundingClientRect();
    // Inside the phone's tour the window is scaled: the glide is written in its own pixels.
    const scale = origin.width / (host.offsetWidth || origin.width || 1);
    const now = new Map<string, { x: number; y: number }>();
    for (const el of host.querySelectorAll<HTMLElement>("[data-card]")) {
      const r = el.getBoundingClientRect();
      now.set(el.dataset.card!, { x: (r.left - origin.left) / scale, y: (r.top - origin.top) / scale });
    }
    if (animate) {
      for (const el of host.querySelectorAll<HTMLElement>("[data-card]")) {
        const was = before.current.get(el.dataset.card!);
        const is = now.get(el.dataset.card!);
        if (!was || !is) continue;
        const dx = was.x - is.x;
        const dy = was.y - is.y;
        if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: Math.abs(dx) > 1 ? GLIDE_MS : 260, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
      }
    }
    before.current = now;
  }, [step, animate]);

  return (
    <Window label={t("board.label")} className={className}>
      <TopBar
        project="Rota"
        tabs={[
          { name: "checkout", kind: "claude", tone: "warn" },
          { name: "api", kind: "claude", tone: "warn" },
          { name: "dev", kind: "shell", tone: "ok" },
        ]}
        right={
          <>
            <CommandButtons command="dev" />
            <span className={cx(s.pillBtn, b.toggle)}>
              <SquareKanban />
            </span>
          </>
        }
      />
      <div className={s.body}>
        <Rail projects={[{ project: "rota", active: true, dot: "warn" }, { project: "quintal", dot: "warn" }, { project: "bussola", dot: "info" }, { project: "mare", dot: "ok" }, { project: "pulso" }, { project: "vela", dot: "danger" }]} />
        <div className={s.main}>
          <div ref={root} className={b.board}>
            <div className={b.head}>
              <span className={b.title}>{t("board.title")}</span>
              <span className={b.scope}>
                <span className={b.scopeOn}>{t("board.scopeAll")}</span>
                <span>{t("board.scopeProject")}</span>
              </span>
              <span className={b.summary}>
                <span className={cx(s.chip, s.warn)}>
                  <Hand aria-hidden="true" />
                  {t("board.needsYou", { count: cards.needs_you.length })}
                  <span className={b.oldest}>{min(14)}</span>
                </span>
                <span className={cx(s.chip, s.info)}>
                  <Loader2 aria-hidden="true" className={s.spin} />
                  {t("board.working", { count: cards.working.length })}
                </span>
                <span key={unread} className={cx(s.chip, s.neutral)}>
                  {t("board.unread", { count: unread })}
                </span>
              </span>
              <span className={b.close}>
                <X aria-hidden="true" />
                {t("board.close")}
              </span>
            </div>
            <div className={b.columns}>
              {COLUMNS.map((column) => (
                <div key={column} className={cx(b.column, b[`col_${column}`])} style={{ "--tone": TONE[column] } as CSSProperties}>
                  <div className={b.columnHead}>
                    <span className={b.columnDot} />
                    <span className={b.columnName}>{t(`board.columns.${column}`)}</span>
                    <span key={cards[column].length} className={b.count}>
                      {cards[column].length}
                    </span>
                  </div>
                  <ul className={b.cards}>
                    {cards[column].map((card) => (
                      <CardItem key={card.id} card={card} column={column} hint={t("board.openHint")} />
                    ))}
                  </ul>
                  {column === "answered" ? (
                    <span className={b.parked}>
                      <ChevronRight aria-hidden="true" />
                      {t("board.parked", { count: 2 })}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <StatusBar
            spec={{
              model: "Opus 5.5",
              spendLabel: t("status.spend"),
              spend: formatPrice(locale, answered ? 46 : 44),
              ctxLabel: t("status.ctx"),
              ctx: "41%",
              five: 34,
              seven: 53,
              right: "ana@example.com · Max · ~/projetos/rota",
            }}
          />
        </div>
      </div>
    </Window>
  );
}

function CardItem({ card, column, hint }: { card: Card; column: Column; hint: string }) {
  return (
    <li data-card={card.id} className={cx(b.card, card.focal && b.focal)}>
      <span className={b.top}>
        {/* A waiting card is the call itself; the dot marks news to read (a reply, an error). */}
        {card.unread && column !== "needs_you" ? <span className={b.unreadDot} /> : null}
        <span className={cx(b.name, card.unread && b.unread)}>{card.name}</span>
        <span className={b.time}>{card.time}</span>
      </span>
      <span className={cx(b.what, column === "error" && b.danger)}>{card.what}</span>
      <span className={b.meta}>
        <span className={b.where}>{card.where}</span>
        {card.focal ? (
          <span className={b.hint}>
            <kbd>A</kbd> {hint}
          </span>
        ) : null}
      </span>
    </li>
  );
}

function Asked({ text }: { text: string }) {
  return (
    <>
      <MessageCircleQuestion aria-hidden="true" />
      <span className={b.text}>{text}</span>
    </>
  );
}

function Said({ text }: { text: string }) {
  return <span className={b.text}>{text}</span>;
}

/** On a phone: the whole board, who waits and what for, the catalogue's card going from Working to Answered, the header's count. */
const TOUR: TourChapter[] = [
  { key: "overview", ms: 2600 },
  {
    key: "needs",
    ms: 3400,
    frame: (view, stage, part) => {
      const col = part(b.col_needs_you);
      return col ? focusShot(view, stage, { x: col.x - 8, y: col.y - 6, w: col.w + 16, h: col.h + 12 }, READ_ZOOM, "start", 0) : null;
    },
  },
  {
    key: "moves",
    ms: 6400,
    frame: (view, stage, part) => {
      const working = part(b.col_working);
      const answered = part(b.col_answered);
      if (!working || !answered) return null;
      // Measured before Answered gets the catalogue's card: room for one more, so its last line is never cut.
      const area: Rect = { x: working.x - 8, y: working.y - 6, w: answered.x + answered.w - working.x + 16, h: Math.max(working.h, answered.h) + CARD_ROOM };
      // Both columns in view, so the card is seen leaving one and arriving in the other.
      const k = Math.min(READ_ZOOM, view.w / area.w, view.h / area.h);
      return focusShot(view, stage, area, k, "center", 0);
    },
  },
  {
    key: "summary",
    ms: 3000,
    frame: (view, stage, part) => {
      const head = part(b.head);
      return head ? focusShot(view, stage, head, 0.8, "start", 0) : null;
    },
  },
];

export function BoardWindow() {
  const t = useTranslations("mock");
  const toured = useMediaQuery(TOUR_QUERY);
  if (!toured) return <BoardDesktop />;
  return <WindowTour copy={t.raw("tours.board") as TourCopy} chapters={TOUR} steps={{ chapter: "moves", durations: [2400, 4000] }} render={(step, animate) => <BoardScene step={step} animate={animate} />} />;
}

function BoardDesktop() {
  const reduced = useReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  const step = useTimeline(STEPS, visible && !reduced);
  return (
    <div ref={ref}>
      <BoardScene step={reduced ? ANSWERED : step} animate={!reduced} />
    </div>
  );
}

/** The board at rest, drawn smaller than its design (a window behind another): no floor on its scale. */
export function BoardStill() {
  return <BoardScene step={0} animate={false} className={s.unclamped} />;
}

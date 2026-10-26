"use client";

import { Check, FlaskConical, Globe, Hand, Loader2, PenLine, Rocket, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { TESTS_TOTAL, agentAt, deployAt, devAt, testsAt } from "@/components/studio/beat";
import type { AnchorKey, Workshop } from "@/components/studio/scene";
import type { ScreenLabels } from "@/components/studio/screens";
import still from "@/components/studio/studio.json";
import styles from "./HeroStudio.module.css";
import { readStudioEnv, wantsLive3d } from "./studioMode";

/** The page's ground: the picture was rendered on it and the live scene clears to it. */
const GROUND = 0x0a0c10;
/**
 * The picture is the scene's first frame. Where only the picture shows, the
 * cards start from a moment it agrees with: the agent editing, no bubble yet,
 * the rocket still on its pad.
 */
const STILL_MS = 5_000;
const KEYS: AnchorKey[] = ["agent", "tests", "dev", "deploy"];
/** Where each card sits from the point it is pinned to, in CSS pixels at full size. */
const CARD_OFFSET: Record<AnchorKey, { x: number; y: number }> = {
  agent: { x: -36, y: -34 },
  tests: { x: 46, y: -30 },
  dev: { x: 40, y: -34 },
  deploy: { x: -44, y: -26 },
};

/** What the cards show, rounded so React only re-renders when something visible changes. */
function viewAt(ms: number) {
  const agent = agentAt(ms);
  const deploy = deployAt(ms);
  const dev = devAt(ms);
  return {
    agent: { kind: agent.kind, file: agent.file, diff: agent.diff },
    tests: testsAt(ms),
    dev: { line: dev.lines[2] as string, bars: dev.bars, rps: dev.rps },
    deploy: { state: deploy.state, pct: Math.round(deploy.progress * 100), since: deploy.since },
  };
}
type View = ReturnType<typeof viewAt>;
const viewKey = (v: View) => `${v.agent.kind}|${v.agent.file}|${v.tests.passed}|${v.tests.suite}|${v.dev.line}|${v.deploy.state}|${v.deploy.pct}|${v.deploy.since}`;

/**
 * The hero's scene: the desktop app's clay studio, where Persisty's mascots
 * work (an agent at its desk, tests on a belt, a dev server, a rocket for each
 * deploy), with a card pinned to each part like the labels in a product shot.
 *
 * The picture of its first frame is on screen at once, cards already pinned.
 * Once the page has loaded and the hero is in view, the live 3D (three.js,
 * loaded on demand) takes over from that same frame. It sleeps when the hero
 * scrolls away or the tab is hidden, phones included. Reduced motion,
 * Save-Data and devices under 4 GB keep the picture, and so does a browser
 * without WebGL; there the cards still move. With reduced motion nothing moves.
 */
export function HeroStudio() {
  const t = useTranslations("home.hero.studio");
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const cards = useRef<Partial<Record<AnchorKey, HTMLDivElement | null>>>({});
  const leaders = useRef<Partial<Record<AnchorKey, SVGLineElement | null>>>({});
  const bars = useRef<Partial<Record<"agent" | "tests" | "deploy", HTMLSpanElement | null>>>({});
  const labels = useRef(t.raw("screen") as { [K in keyof ScreenLabels["agent"] | "launching" | "live"]: string });
  const [view, setView] = useState<View>(() => viewAt(0));
  const [mode, setMode] = useState<"picture" | "3d">("picture");
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const box = host.current;
    const el = canvas.current;
    if (!box || !el) return;
    const env = readStudioEnv();
    const reduced = env.reducedMotion;
    const wants3d = wantsLive3d(env);

    let cancelled = false;
    let workshop: Workshop | null = null;
    // The cards' clock. Waiting for the 3D it holds at the picture's frame, so the scene takes over without a jump.
    let clock = wants3d ? 0 : STILL_MS;
    let moving = !reduced && !wants3d;
    let onScreen = true;
    let raf = 0;
    let last = 0;
    let shown = "";
    let requested = false;

    const anchorOf = (key: AnchorKey) => {
      if (workshop) return workshop.anchor(key);
      const a = still.anchors[key];
      return { x: a.x * box.clientWidth, y: a.y * box.clientHeight };
    };
    const placeCards = () => {
      // Smaller stages get slightly smaller cards; cards that would touch are pushed apart.
      const k = Math.min(1, Math.max(0.78, box.clientWidth / 760));
      // A smaller stage has room for three cards, a phone's for two: the dev server steps aside, then the deploy.
      const room = box.clientWidth >= 540 ? 4 : box.clientWidth >= 440 ? 3 : 2;
      const keys = KEYS.filter((key) => !(key === "dev" && room < 4) && !(key === "deploy" && room < 3));
      for (const key of KEYS) {
        const shown = keys.includes(key);
        const card = cards.current[key];
        if (card) card.style.visibility = shown ? "" : "hidden";
        leaders.current[key]?.setAttribute("visibility", shown ? "visible" : "hidden");
      }
      const spots = keys
        .map((key) => {
          const a = anchorOf(key);
          const o = CARD_OFFSET[key];
          const card = cards.current[key];
          return { key, a, x: a.x + o.x * k, y: a.y + o.y * k, w: (card?.offsetWidth ?? 0) * k, h: (card?.offsetHeight ?? 0) * k };
        })
        .sort((p, q) => p.x - q.x);
      const W = box.clientWidth;
      const H = box.clientHeight;
      const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
      // Cards hang from their point: x is the middle, y the bottom edge.
      const touch = (a: (typeof spots)[number], b: (typeof spots)[number]) =>
        Math.abs(a.x - b.x) < (a.w + b.w) / 2 + 10 && a.y - a.h < b.y + 8 && b.y - b.h < a.y + 8;
      // Apart sideways first; never past the stage's edges; then, if they still touch, one below the other.
      for (let i = 1; i < spots.length; i++) {
        for (let j = 0; j < i; j++) {
          const a = spots[j]!;
          const b = spots[i]!;
          if (touch(a, b)) b.x = a.x + (a.w + b.w) / 2 + 10;
        }
      }
      // On a phone the stage runs edge to edge: the cards keep to the page's margin.
      const edge = W < 540 ? 16 : 4;
      for (const s of spots) s.x = clamp(s.x, s.w / 2 + edge, W - s.w / 2 - edge);
      // A push can land on a third card: repeat until no pair touches.
      for (let pass = 0; pass < spots.length; pass++) {
        let moved = false;
        for (let i = 1; i < spots.length; i++) {
          for (let j = 0; j < i; j++) {
            const a = spots[j]!;
            const b = spots[i]!;
            if (!touch(a, b)) continue;
            if (b.y >= a.y) b.y = a.y + b.h + 8;
            else a.y = b.y + a.h + 8;
            moved = true;
          }
        }
        if (!moved) break;
      }
      for (const s of spots) s.y = clamp(s.y, s.h + 4, H - 4);
      for (const { key, a, x, y } of spots) {
        const card = cards.current[key];
        const leader = leaders.current[key];
        if (!card || !leader) continue;
        card.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%) scale(${k.toFixed(3)})`;
        leader.setAttribute("x1", a.x.toFixed(1));
        leader.setAttribute("y1", a.y.toFixed(1));
        leader.setAttribute("x2", x.toFixed(1));
        leader.setAttribute("y2", y.toFixed(1));
      }
    };
    const show = (ms: number) => {
      const set = (key: "agent" | "tests" | "deploy", value: number) => {
        const node = bars.current[key];
        if (node) node.style.transform = `scaleX(${Math.min(1, Math.max(0, value)).toFixed(3)})`;
      };
      set("agent", agentAt(ms).progress);
      set("tests", testsAt(ms).passed / TESTS_TOTAL);
      set("deploy", deployAt(ms).progress);
      const next = viewAt(ms);
      const key = viewKey(next);
      if (key !== shown) {
        shown = key;
        setView(next);
      }
    };

    const tick = (now: number) => {
      // A long gap (a hidden tab, a slow frame) does not fast-forward the studio.
      clock += last ? Math.min(100, now - last) : 0;
      last = now;
      workshop?.frame(clock);
      placeCards();
      show(clock);
      raf = requestAnimationFrame(tick);
    };
    const run = () => {
      const go = moving && onScreen && document.visibilityState === "visible";
      if (go && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      } else if (!go && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const fit = () => {
      workshop?.resize(box.clientWidth, box.clientHeight, Math.min(1.5, window.devicePixelRatio || 1));
      if (workshop && !raf) workshop.frame(clock);
      placeCards();
    };
    const onPointer = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      workshop?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    };

    const start3d = async () => {
      const { createWorkshop } = await import("@/components/studio/scene");
      if (cancelled) return;
      const l = labels.current;
      workshop = createWorkshop(el, {
        light: false,
        background: GROUND,
        screenLabels: {
          agent: { reading: l.reading, editing: l.editing, testing: l.testing, asking: l.asking, applying: l.applying, done: l.done },
          launching: l.launching,
          live: l.live,
        },
      });
      if (!workshop) {
        // No WebGL: the picture stays and the cards carry on.
        moving = true;
        return run();
      }
      fit();
      // Draw the picture's own frame, then show the canvas over it once that frame is up.
      workshop.frame(clock);
      requestAnimationFrame(() => {
        if (cancelled) return;
        setMode("3d");
        box.addEventListener("pointermove", onPointer);
        moving = true;
        run();
      });
    };
    // After the page has loaded, at a quiet moment, and only once the hero is in view.
    const request3d = () => {
      if (requested || !wants3d || !onScreen) return;
      requested = true;
      const idle = () => {
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start3d(), { timeout: 1500 });
        else setTimeout(() => void start3d(), 200);
      };
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    };

    const resizer = typeof ResizeObserver === "function" ? new ResizeObserver(fit) : null;
    resizer?.observe(box);
    const viewer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => {
            onScreen = Boolean(entry?.isIntersecting);
            request3d();
            run();
          })
        : null;
    viewer?.observe(box);
    const onVisibility = () => run();
    document.addEventListener("visibilitychange", onVisibility);

    show(clock);
    fit();
    setPlaced(true);
    run();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resizer?.disconnect();
      viewer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      box.removeEventListener("pointermove", onPointer);
      workshop?.dispose();
    };
  }, []);

  const { agent, tests, dev, deploy } = view;
  const asking = agent.kind === "asking";
  const icon = (Icon: typeof Loader2 = Loader2) => <Icon size={12} strokeWidth={2.25} className={Icon === Loader2 ? styles.spin : undefined} aria-hidden="true" />;

  const card = (key: AnchorKey, glyph: ReactNode, title: string, chip: string, body: ReactNode, attention = false) => (
    <div ref={(n) => void (cards.current[key] = n)} className={styles.card} data-attention={attention ? "true" : undefined}>
      <div className={styles.cardHead}>
        <span className={styles.cardIcon}>{glyph}</span>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardChip}>{chip}</span>
      </div>
      {body}
    </div>
  );

  const agentLine: Record<typeof agent.kind, { tone: string; glyph: ReactNode; text: ReactNode }> = {
    reading: { tone: "info", glyph: icon(), text: t("reading", { file: agent.file }) },
    editing: {
      tone: "info",
      glyph: icon(PenLine),
      text: (
        <>
          {t("editing", { file: agent.file.split("/").pop() ?? agent.file })} <span className={styles.diff}>{agent.diff}</span>
        </>
      ),
    },
    testing: { tone: "info", glyph: icon(), text: t("testing") },
    asking: { tone: "warn", glyph: icon(Hand), text: t("asking") },
    applying: { tone: "info", glyph: icon(), text: t("applying") },
    done: { tone: "ok", glyph: icon(Check), text: t("done") },
  };
  const a = agentLine[agent.kind];

  return (
    <div ref={host} className={styles.stage} data-mode={mode} data-placed={placed ? "true" : undefined} aria-hidden="true">
      <Image className={styles.poster} src="/art/studio.webp" alt="" fill priority sizes="(max-width: 1023px) 100vw, 760px" draggable={false} />
      <canvas ref={canvas} className={styles.canvas} />
      <svg className={styles.leaders}>
        {KEYS.map((key) => (
          <line key={key} ref={(n) => void (leaders.current[key] = n)} className={styles.leader} />
        ))}
      </svg>
      <div className={styles.cards}>
        {card(
          "agent",
          <Sparkles size={14} aria-hidden="true" />,
          t("agentTitle"),
          "web",
          <>
            <span key={`${agent.kind}${agent.file}`} className={styles.line} data-tone={a.tone}>
              {a.glyph}
              <span>{a.text}</span>
            </span>
            {/* Keyed: the bar's node carries an inline scale the buttons must not inherit. */}
            {asking ? (
              <span key="actions" className={styles.actions}>
                <span className={styles.action} data-primary="true">
                  {t("approve")}
                </span>
                <span className={styles.action}>{t("view")}</span>
              </span>
            ) : (
              <span key="bar" className={styles.bar}>
                <span ref={(n) => void (bars.current.agent = n)} data-tone={a.tone} />
              </span>
            )}
          </>,
          asking,
        )}
        {card(
          "tests",
          <FlaskConical size={14} aria-hidden="true" />,
          t("testsTitle"),
          tests.suite,
          <>
            <span key={String(tests.done) + tests.suite} className={styles.line} data-tone={tests.done ? "ok" : "info"}>
              {tests.done ? icon(Check) : icon()}
              <span className={styles.count}>{tests.done ? t("passed", { total: TESTS_TOTAL }) : t("passing", { passed: tests.passed, total: TESTS_TOTAL })}</span>
            </span>
            <span className={styles.bar}>
              <span ref={(n) => void (bars.current.tests = n)} data-tone={tests.done ? "ok" : "info"} />
            </span>
          </>,
        )}
        {card(
          "dev",
          <Globe size={14} aria-hidden="true" />,
          t("devTitle"),
          ":5173",
          <>
            <span className={styles.spark}>
              {dev.bars.map((v, i) => (
                <span key={i} style={{ transform: `scaleY(${v.toFixed(2)})` }} />
              ))}
              <span className={styles.rps}>{t("rps", { rps: dev.rps })}</span>
            </span>
            <span key={dev.line} className={`${styles.line} ${styles.log}`} data-tone="neutral">
              <span>{dev.line}</span>
            </span>
          </>,
        )}
        {card(
          "deploy",
          <Rocket size={14} aria-hidden="true" />,
          t("deployTitle"),
          "web",
          <>
            <span key={deploy.state} className={styles.line} data-tone={deploy.state === "live" ? "ok" : "info"}>
              {deploy.state === "live" ? icon(Check) : deploy.state === "launching" ? icon(Rocket) : icon()}
              <span className={styles.count}>
                {deploy.state === "building"
                  ? t("building", { pct: deploy.pct })
                  : deploy.state === "launching"
                    ? t("launching")
                    : t("live", { seconds: deploy.since })}
              </span>
            </span>
            <span className={styles.bar}>
              <span ref={(n) => void (bars.current.deploy = n)} data-tone={deploy.state === "live" ? "ok" : "info"} />
            </span>
          </>,
        )}
      </div>
    </div>
  );
}

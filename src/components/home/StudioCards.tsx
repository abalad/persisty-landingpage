"use client";

import { Check, FolderGit2, Loader2, Play, ShieldQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { readStudioEnv, wantsLive3d } from "@/components/home/studioMode";
import { AgentGlyph, Chip, Dot, cx } from "@/components/mockups/parts";
import type { LiveArt } from "@/components/studio/live";
import type { VignetteName } from "@/components/studio/vignettes";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTimeline } from "@/hooks/useTimeline";
import styles from "./Studio.module.css";

/** Each card's scene: the desktop app's own vignettes, the stills rendered from them. */
const ART = ["project", "desk", "wave", "tests"] as const satisfies readonly VignetteName[];
type Art = (typeof ART)[number];
type LiveLib = typeof import("@/components/studio/live");

/**
 * The four cards, each the mascot doing what its card says. At rest, the still picture. Hovered (on a phone, the card
 * in view), the scene comes alive in 3D (one renderer for all, only the active card draws) and a piece of the real app
 * rises into it: the project's workspaces, the tabs changing state, a permission to answer, the tests running. Reduced
 * motion, Save-Data, small devices and browsers without WebGL keep the picture; the piece of the app still shows.
 */
export function StudioCards({ items }: { items: { title: string; body: string }[] }) {
  const list = useRef<HTMLUListElement>(null);
  const [lib, setLib] = useState<LiveLib | null>(null);

  // The 3D loads once the cards are in view and the page has settled, so the first hover is already live.
  useEffect(() => {
    const host = list.current;
    if (!host || !wantsLive3d(readStudioEnv())) return;
    let gone = false;
    const load = () => {
      void import("@/components/studio/live").then((m) => {
        if (!gone) setLib(m);
      });
    };
    const viewer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      viewer.disconnect();
      const idle = () => (typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 200));
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    }, { rootMargin: "200px" });
    viewer.observe(host);
    return () => {
      gone = true;
      viewer.disconnect();
    };
  }, []);

  return (
    <ul ref={list} className={styles.grid}>
      {items.map((item, i) => (
        <StudioCard key={item.title} art={ART[i] ?? "project"} title={item.title} body={item.body} lib={lib} />
      ))}
    </ul>
  );
}

function StudioCard({ art, title, body, lib }: { art: Art; title: string; body: string; lib: LiveLib | null }) {
  const card = useRef<HTMLLIElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef<LiveArt | null>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [drawn, setDrawn] = useState(false);
  /** Each activation starts the card's story over. */
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = canvas.current;
    if (!lib || !el || reduced) return;
    const handle = lib.attachLiveArt(
      el,
      art,
      () => setDrawn(true),
      () => setDrawn(false),
    );
    live.current = handle;
    return () => {
      handle?.dispose();
      live.current = null;
    };
  }, [lib, art, reduced]);

  // The scene moves only while its card is active, and greets you with its big move.
  useEffect(() => {
    live.current?.setActive(active);
    if (active && art !== "tests") live.current?.poke();
  }, [active, art, lib]);

  // On a phone there is no hover: the card crossing the middle of the screen is the active one, one at a time.
  useEffect(() => {
    const el = card.current;
    if (!el || !window.matchMedia("(hover: none)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const on = Boolean(entry?.isIntersecting);
        setActive(on);
        if (on) setRun((r) => r + 1);
      },
      { rootMargin: "-49% 0px -49% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const enter = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    setActive(true);
    setRun((r) => r + 1);
  };
  const leave = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    setActive(false);
  };

  return (
    <li ref={card} className={styles.card} data-active={active} onPointerEnter={enter} onPointerLeave={leave}>
      <div className={styles.stage}>
        <Image className={styles.art} src={`/art/${art}.webp`} alt="" width={640} height={400} sizes="(max-width: 820px) 90vw, 320px" />
        <canvas ref={canvas} className={styles.live} data-on={drawn && active} aria-hidden="true" />
        <div className={styles.snippet} data-on={active} aria-hidden="true">
          {art === "project" ? <ProjectSnippet key={run} /> : null}
          {art === "desk" ? <DeskSnippet key={run} running={active && !reduced} /> : null}
          {art === "wave" ? <AskSnippet key={run} onAnswer={() => live.current?.poke()} /> : null}
          {art === "tests" ? <TestsSnippet key={run} running={active} reduced={reduced} onPass={() => live.current?.poke()} /> : null}
        </div>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
    </li>
  );
}

/** One project, the whole product: its four folders come in one after the other, as the scene's folders hop. */
function ProjectSnippet() {
  const t = useTranslations("home.studio.live");
  const roles = t.raw("roles") as string[];
  const tones = ["var(--color-accent)", "var(--color-info)", "var(--color-warn)", "var(--color-danger)"];
  return (
    <span className={styles.folders}>
      {roles.map((role, i) => (
        <span key={role} className={styles.folder} style={{ "--i": i } as CSSProperties}>
          <FolderGit2 aria-hidden="true" style={{ color: tones[i] }} />
          {role}
        </span>
      ))}
    </span>
  );
}

/** Sessions as tabs, each saying what it does: api works, then waits for you. */
function DeskSnippet({ running }: { running: boolean }) {
  const m = useTranslations("mock");
  const step = useTimeline(DESK_STEPS, running);
  const waiting = step === 1;
  return (
    <>
      <span className={styles.tabs}>
        <span className={cx(styles.tab, styles.tabOn)}>
          <AgentGlyph kind="claude" />
          api
          <Dot tone={waiting ? "warn" : "info"} />
        </span>
        <span className={styles.tab}>
          <AgentGlyph kind="claude" />
          checkout
          <Dot tone="warn" />
        </span>
        <span className={styles.tab}>
          <AgentGlyph kind="shell" />
          dev
          <Dot tone="ok" />
        </span>
      </span>
      <span className={styles.state}>
        api
        {waiting ? <Chip tone="warn" icon="waiting" label={m("states.waiting")} /> : <Chip tone="info" icon="working" label={m("states.working")} />}
      </span>
    </>
  );
}
const DESK_STEPS = [2000, 2600];

/** A permission to answer right there: allow it and the mascot cheers. */
function AskSnippet({ onAnswer }: { onAnswer: () => void }) {
  const t = useTranslations("home.studio.live");
  const [answer, setAnswer] = useState<"allowed" | "denied" | null>(null);
  if (answer)
    return (
      <span className={cx(styles.answer, answer === "allowed" && styles.answerOk)}>
        {answer === "allowed" ? <Check aria-hidden="true" /> : null}
        {t(answer)}
      </span>
    );
  return (
    <>
      <span className={styles.ask}>
        <ShieldQuestion aria-hidden="true" />
        {t("asks")}
      </span>
      <span className={styles.buttons}>
        <button
          type="button"
          tabIndex={-1}
          className={styles.allow}
          onClick={() => {
            setAnswer("allowed");
            onAnswer();
          }}
        >
          {t("allow")}
        </button>
        <button type="button" tabIndex={-1} className={styles.deny} onClick={() => setAnswer("denied")}>
          {t("deny")}
        </button>
      </span>
    </>
  );
}

/** The folder's commands, read by Persisty: the tests run, pass, and the scanner flashes. */
function TestsSnippet({ running, reduced, onPass }: { running: boolean; reduced: boolean; onPass: () => void }) {
  const t = useTranslations("home.studio.live");
  const step = useTimeline(TESTS_STEPS, running && !reduced, reduced ? 1 : 0);
  const passed = step === 1;
  // Once per pass: the scanner flashes as the result comes in.
  const fired = useRef(false);
  useEffect(() => {
    if (!passed) fired.current = false;
    else if (running && !fired.current) {
      fired.current = true;
      onPass();
    }
  }, [passed, running, onPass]);
  return (
    <span className={styles.command2}>
      <Play aria-hidden="true" />
      pnpm test
      {passed ? (
        <span className={styles.passed}>
          <Check aria-hidden="true" />
          {t("passed")}
        </span>
      ) : (
        <span className={styles.runningNow}>
          <Loader2 aria-hidden="true" className={styles.spin} />
          {t("running")}
        </span>
      )}
    </span>
  );
}
const TESTS_STEPS = [1500, 3600];

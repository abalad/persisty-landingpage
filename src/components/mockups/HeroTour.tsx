"use client";

import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { chapterAt, fitShot, focusShot, stepAt, type Rect, type Shot, type Size } from "./tour";
import s from "./app.module.css";
import styles from "./tour.module.css";

type ChapterKey = "overview" | "working" | "waiting" | "workspaces" | "usage";

/** The story the camera tells, in the order it plays; "working" runs the window's own steps. */
const CHAPTERS: { key: ChapterKey; ms: number }[] = [
  { key: "overview", ms: 2600 },
  { key: "working", ms: 8200 },
  { key: "waiting", ms: 2600 },
  { key: "workspaces", ms: 3000 },
  { key: "usage", ms: 2600 },
];

/** Close enough to read on a phone (the app's 13px text lands near 10px), wide enough for a whole terminal line. */
const ZOOM = 0.75;

/** A part of the window, in its own pixels, wherever it sits inside `root`. */
function rectIn(el: HTMLElement, root: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function shotFor(key: ChapterKey, view: Size, root: HTMLElement): Shot {
  const stage = { w: root.offsetWidth, h: root.offsetHeight };
  const part = (name: string) => {
    const el = root.querySelector<HTMLElement>(`.${s[name]}`);
    return el ? rectIn(el, root) : null;
  };
  const header = part("sessionHeader");
  const terminal = part("terminal");
  const card = part("cardActive");
  const status = part("statusbar");
  switch (key) {
    case "working":
      if (!header || !terminal) break;
      return focusShot(view, stage, { x: 0, y: header.y, w: terminal.w, h: terminal.y + terminal.h - header.y }, ZOOM, "start", 0);
    case "waiting":
      // Up close, at the app's own size: the tab's dot, the project's badge and the chip all say it.
      if (!header) break;
      return focusShot(view, stage, { x: 0, y: 0, w: view.w, h: header.y + header.h }, 1, "start", 0);
    case "workspaces":
      // The card that wants something from you, with its neighbours at the edges.
      if (!card) break;
      return focusShot(view, stage, card, ZOOM);
    case "usage":
      // Wide enough for the model, the spend and both quota bars.
      if (!status) break;
      return focusShot(view, stage, status, 0.68, "start", 8);
  }
  return fitShot(view, stage);
}

/**
 * On a phone, the window is drawn at desktop size and a camera moves over it:
 * the whole window, then up close where something happens, chapter by
 * chapter. It plays on its own while on screen; a tap on a chapter jumps there.
 * With reduced motion nothing plays and the camera cuts instead of gliding.
 */
export function HeroTour({ steps, render }: { steps: number[]; render: (step: number, animate: boolean) => ReactNode }) {
  const t = useTranslations("mock.hero.tour");
  const chapters = t.raw("chapters") as { title: string; body: string }[];
  const reduced = useReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  const view = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clock = useRef(0);
  const last = steps.length - 1;
  const [chapter, setChapter] = useState(0);
  const [step, setStep] = useState(last);
  const [shot, setShot] = useState<Shot | null>(null);
  const [run, setRun] = useState(0);
  const playing = visible && !reduced;

  const show = (t: number) => {
    const { index, elapsed } = chapterAt(CHAPTERS, t);
    setChapter(index);
    setStep(CHAPTERS[index].key === "working" ? stepAt(steps, elapsed) : last);
  };

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      clock.current += Math.min(100, now - prev);
      prev = now;
      show(clock.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // `show` only sets state; the loop restarts when playing changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useLayoutEffect(() => {
    const v = view.current;
    const root = stage.current;
    if (!v || !root) return;
    const frame = () => setShot(shotFor(CHAPTERS[chapter].key, { w: v.clientWidth, h: v.clientHeight }, root));
    frame();
    const ro = new ResizeObserver(frame);
    ro.observe(v);
    return () => ro.disconnect();
  }, [chapter]);

  const jump = (i: number) => {
    clock.current = CHAPTERS.slice(0, i).reduce((sum, c) => sum + c.ms, 0);
    show(clock.current);
    setRun((r) => r + 1);
  };

  const style = shot ? ({ transform: `translate(${shot.tx}px, ${shot.ty}px) scale(${shot.k})` } as CSSProperties) : undefined;

  return (
    <div ref={ref} className={styles.tour} data-playing={playing}>
      <div ref={view} className={styles.view}>
        <div ref={stage} className={styles.stage} style={style} data-placed={shot !== null}>
          {render(step, !reduced)}
        </div>
      </div>
      <div className={styles.chapters} role="group" aria-label={t("label")}>
        {CHAPTERS.map((c, i) => (
          <button
            key={c.key}
            type="button"
            className={styles.segment}
            data-state={i < chapter ? "done" : i === chapter ? "active" : "next"}
            aria-label={chapters[i]?.title}
            aria-current={i === chapter ? "step" : undefined}
            onClick={() => jump(i)}
          >
            <span key={i === chapter ? `${run}-${chapter}` : i} className={styles.fill} style={{ "--ms": `${c.ms}ms` } as CSSProperties} />
          </button>
        ))}
      </div>
      <p className={styles.caption}>
        <strong>{chapters[chapter]?.title}</strong>
        {chapters[chapter]?.body}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { chapterAt, fitShot, stepAt, type Rect, type Shot, type Size } from "./tour";
import styles from "./tour.module.css";

/** Below this width an app window is toured instead of shrunk: drawn at desktop size, a camera moving over it. */
export const TOUR_QUERY = "(max-width: 680px)";

export interface TourChapter {
  key: string;
  ms: number;
  /**
   * Where the camera looks, given the view, the window's size and a way to
   * find one of its parts by class name. The whole window when absent, or
   * when it returns null because the part is not there.
   */
  frame?: (view: Size, stage: Size, part: (className: string) => Rect | null) => Shot | null;
}

export interface TourCopy {
  label: string;
  chapters: { title: string; body: string }[];
}

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

/**
 * On a phone, an app window is drawn at desktop size and a camera moves over
 * it: the whole window, then up close where something happens, chapter by
 * chapter. It plays on its own while on screen; a tap on a chapter jumps
 * there. With reduced motion nothing plays and the camera cuts instead of
 * gliding. `steps` lets one chapter play the window's own story; elsewhere
 * its last step holds.
 */
export function WindowTour({
  copy,
  chapters,
  steps,
  render,
}: {
  copy: TourCopy;
  chapters: TourChapter[];
  steps?: { chapter: string; durations: number[] };
  render: (step: number, animate: boolean) => ReactNode;
}) {
  const reduced = useReducedMotion();
  const [ref, visible] = useInView<HTMLDivElement>();
  const view = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const clock = useRef(0);
  const last = steps ? steps.durations.length - 1 : 0;
  const [chapter, setChapter] = useState(0);
  const [step, setStep] = useState(last);
  const [shot, setShot] = useState<Shot | null>(null);
  const [run, setRun] = useState(0);
  const playing = visible && !reduced;

  const show = (t: number) => {
    const { index, elapsed } = chapterAt(chapters, t);
    setChapter(index);
    setStep(steps && chapters[index].key === steps.chapter ? stepAt(steps.durations, elapsed) : last);
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
    const frame = () => {
      const size = { w: v.clientWidth, h: v.clientHeight };
      const whole = { w: root.offsetWidth, h: root.offsetHeight };
      const part = (className: string) => {
        const el = root.querySelector<HTMLElement>(`.${className}`);
        return el ? rectIn(el, root) : null;
      };
      setShot(chapters[chapter].frame?.(size, whole, part) ?? fitShot(size, whole));
    };
    frame();
    const ro = new ResizeObserver(frame);
    ro.observe(v);
    return () => ro.disconnect();
  }, [chapter, chapters]);

  const jump = (i: number) => {
    clock.current = chapters.slice(0, i).reduce((sum, c) => sum + c.ms, 0);
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
      <div className={styles.chapters} role="group" aria-label={copy.label} style={{ "--count": chapters.length } as CSSProperties}>
        {chapters.map((c, i) => (
          <button
            key={c.key}
            type="button"
            className={styles.segment}
            data-state={i < chapter ? "done" : i === chapter ? "active" : "next"}
            aria-label={copy.chapters[i]?.title}
            aria-current={i === chapter ? "step" : undefined}
            onClick={() => jump(i)}
          >
            <span key={i === chapter ? `${run}-${chapter}` : i} className={styles.fill} style={{ "--ms": `${c.ms}ms` } as CSSProperties} />
          </button>
        ))}
      </div>
      <p className={styles.caption}>
        <strong>{copy.chapters[chapter]?.title}</strong>
        {copy.chapters[chapter]?.body}
      </p>
    </div>
  );
}

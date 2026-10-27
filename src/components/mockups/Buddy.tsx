"use client";

import { useEffect, useRef, useState } from "react";
import { readStudioEnv, wantsLive3d } from "@/components/home/studioMode";
import type { BuddyRig } from "@/components/studio/buddy";
import { reactionTo, type Mood } from "@/components/studio/buddyMood";
import styles from "./buddy.module.css";

/**
 * The desktop app's mascot in the corner of a window's terminal. It peeks
 * (just the head), types along while the agent works and pops up with both
 * arms raised when the turn is done; its head follows the pointer and it
 * hops when clicked.
 *
 * The picture of it peeking shows at once. After the page has loaded and once
 * the terminal is in view, the live 3D (three.js, loaded on demand) takes
 * over and rests while scrolled away. Reduced motion, Save-Data, small
 * devices and browsers without WebGL keep the picture. Decoration: the
 * session's chip says the state in words, so this stays out of the
 * accessibility tree.
 */
export function Buddy({ mood }: { mood: Mood }) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const rig = useRef<BuddyRig | null>(null);
  const moodRef = useRef<Mood>(mood);
  const prevMood = useRef<Mood | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const host = box.current;
    const el = canvas.current;
    if (!host || !el || !wantsLive3d(readStudioEnv())) return;

    let gone = false;
    let onScreen = false;
    let requested = false;
    let resizer: ResizeObserver | null = null;
    const size = () => rig.current?.resize(el.clientWidth || 120, el.clientHeight || 140, window.devicePixelRatio || 1);

    const start = async () => {
      const { createRig } = await import("@/components/studio/buddy");
      if (gone) return;
      const r = createRig(el, { reduced: false });
      // No WebGL: the picture stays.
      if (!r) return;
      rig.current = r;
      r.setMood(moodRef.current);
      r.sleep(!onScreen);
      size();
      resizer = typeof ResizeObserver === "function" ? new ResizeObserver(size) : null;
      resizer?.observe(el);
      // Over the picture once its first frame is up.
      requestAnimationFrame(() => {
        if (!gone) setLive(true);
      });
    };
    // After the page has loaded, at a quiet moment, and only once the terminal is in view.
    const request = () => {
      if (requested || !onScreen) return;
      requested = true;
      const idle = () => {
        if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(() => void start(), { timeout: 1500 });
        else setTimeout(() => void start(), 200);
      };
      if (document.readyState === "complete") idle();
      else window.addEventListener("load", idle, { once: true });
    };
    const viewer = new IntersectionObserver(([entry]) => {
      onScreen = Boolean(entry?.isIntersecting);
      rig.current?.sleep(!onScreen);
      request();
    });
    viewer.observe(host);

    // The head follows the pointer anywhere on the page, at most once a frame.
    let pending = 0;
    const onMove = (e: MouseEvent) => {
      if (pending || !rig.current) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const x = (e.clientX - (r.left + r.width / 2)) / 420;
        const y = (e.clientY - (r.top + r.height * 0.7)) / 320;
        rig.current?.look(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)));
      });
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      gone = true;
      viewer.disconnect();
      resizer?.disconnect();
      window.removeEventListener("mousemove", onMove);
      if (pending) cancelAnimationFrame(pending);
      rig.current?.dispose();
      rig.current = null;
    };
  }, []);

  useEffect(() => {
    moodRef.current = mood;
    rig.current?.setMood(mood);
    const reaction = reactionTo(prevMood.current, mood);
    prevMood.current = mood;
    if (reaction) rig.current?.react(reaction);
  }, [mood]);

  return (
    <div ref={box} className={styles.buddy} data-live={live} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- a 5 KB picture drawn at its own size */}
      <img className={styles.still} src="/art/buddy.webp" alt="" width={120} height={140} draggable={false} />
      <canvas ref={canvas} className={styles.canvas} />
      <div className={styles.hit} onClick={() => rig.current?.poke()} />
    </div>
  );
}

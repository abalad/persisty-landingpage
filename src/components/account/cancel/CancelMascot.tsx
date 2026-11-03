"use client";

import { useEffect, useRef, useState } from "react";
import type { CancelMood, CancelScene } from "./mascotScene";
import styles from "./cancel.module.css";

/**
 * The mascot of the cancelling dialog, in full body and in 3D like the rest
 * of the site; three.js loads only once the dialog is open. With reduced
 * motion it holds each face still. Without WebGL, or with Save-Data, a still
 * picture stands in. Decoration: every step says in words what it is.
 */
export function CancelMascot({ mood }: { mood: CancelMood }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<CancelScene | null>(null);
  const moodRef = useRef(mood);
  // Save-Data: a still picture instead of downloading three.js.
  const [fallback, setFallback] = useState(() => typeof navigator !== "undefined" && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true);

  useEffect(() => {
    moodRef.current = mood;
    scene.current?.setMood(mood);
  }, [mood]);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let gone = false;
    let resizer: ResizeObserver | null = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    void import("./mascotScene").then(({ createCancelScene }) => {
      if (gone) return;
      const made = createCancelScene(el, { reduced });
      if (!made) return setFallback(true);
      scene.current = made;
      made.setMood(moodRef.current);
      const size = () => made.resize(el.clientWidth || 280, el.clientHeight || 360, window.devicePixelRatio || 1);
      size();
      resizer = typeof ResizeObserver === "function" ? new ResizeObserver(size) : null;
      resizer?.observe(el);
    });
    const onVisibility = () => scene.current?.sleep(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      gone = true;
      resizer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.current?.dispose();
      scene.current = null;
    };
  }, []);

  return (
    <div className={styles.mascot} aria-hidden="true">
      {fallback ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.mascotStill} src="/art/mascot-cancel.png" alt="" />
      ) : (
        <canvas ref={canvas} className={styles.mascotCanvas} />
      )}
    </div>
  );
}

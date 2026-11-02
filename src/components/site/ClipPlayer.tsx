"use client";

import { useEffect } from "react";

/**
 * The changelog's clips (videos marked `data-clip`, see rehypeClips) play
 * while they are on screen, muted and looping like an animated picture, and
 * stop when scrolled away; a click pauses or plays one. With reduced motion
 * they keep their controls and wait for the reader to press play.
 */
export function ClipPlayer() {
  useEffect(() => {
    const videos = [...document.querySelectorAll<HTMLVideoElement>("video[data-clip]")];
    if (!videos.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const held = new WeakSet<HTMLVideoElement>();
    const play = (v: HTMLVideoElement) => void v.play().catch(() => v.setAttribute("controls", ""));
    const seen = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const v = e.target as HTMLVideoElement;
          if (e.isIntersecting && !held.has(v)) play(v);
          else if (!e.isIntersecting) v.pause();
        }
      },
      { threshold: 0.4 },
    );
    const toggle = (e: Event) => {
      const v = e.currentTarget as HTMLVideoElement;
      if (v.paused) {
        held.delete(v);
        play(v);
      } else {
        held.add(v);
        v.pause();
      }
    };
    for (const v of videos) {
      v.muted = true;
      v.removeAttribute("controls");
      v.addEventListener("click", toggle);
      seen.observe(v);
    }
    return () => {
      seen.disconnect();
      for (const v of videos) v.removeEventListener("click", toggle);
    };
  }, []);
  return null;
}

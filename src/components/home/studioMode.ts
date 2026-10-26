/** What the hero's studio needs to know about the visitor's device before it loads three.js. */
export interface StudioEnv {
  reducedMotion: boolean;
  saveData: boolean;
  /** `navigator.deviceMemory` in GB; only Chromium browsers report it. */
  deviceMemory?: number;
  intersectionObserver: boolean;
}

/**
 * Whether the live 3D takes over from the picture. Screen size plays no part:
 * a phone's canvas has a third of a desktop's pixels. The picture stays when
 * the visitor asks for less motion or data, on devices under 4 GB, and where
 * the scene could not sleep off screen.
 */
export function wantsLive3d(env: StudioEnv): boolean {
  if (env.reducedMotion || env.saveData || !env.intersectionObserver) return false;
  return env.deviceMemory === undefined || env.deviceMemory >= 4;
}

export function readStudioEnv(): StudioEnv {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    deviceMemory: nav.deviceMemory,
    intersectionObserver: typeof IntersectionObserver === "function",
  };
}

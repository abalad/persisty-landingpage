import manifest from "@/data/releases.json";
import type { Platform } from "./platform";
import { compareVersions } from "./semver";

export type DesktopPlatform = Exclude<Platform, "other">;

export type FileKind = "dmg" | "nsis" | "appimage" | "deb";

/** One downloadable file of a release, as the app's `scripts/release/publish.mjs` writes it. */
export interface ReleaseFile {
  platform: DesktopPlatform;
  kind: FileKind;
  arch: "universal" | "x64";
  name: string;
  url: string;
  size: number;
  sha256: string;
}

export interface ReleaseEntry {
  version: string;
  date: string;
  files: ReleaseFile[];
}

export const PLATFORM_ORDER: DesktopPlatform[] = ["mac", "windows", "linux"];

/** The order files are listed in: by system, then the main file before its alternative. */
const KIND_ORDER: FileKind[] = ["dmg", "nsis", "appimage", "deb"];
const PRIMARY: FileKind[] = ["dmg", "nsis", "appimage"];

const newestFirst = (history: ReleaseEntry[]) => [...history].sort((a, b) => compareVersions(b.version, a.version));

/** Every published version, newest first. `src/data/releases.json` is written by the app's publish step, never by hand. */
export const RELEASE_HISTORY: ReleaseEntry[] = newestFirst(manifest as ReleaseEntry[]);

/**
 * The newest version that has a build for this system, and its files. When
 * a system's build failed in the latest release, the one before it is
 * offered, with its own number.
 */
export function latestFor(platform: DesktopPlatform, history = RELEASE_HISTORY): ReleaseEntry | null {
  for (const r of newestFirst(history)) {
    const files = r.files.filter((f) => f.platform === platform);
    if (files.length) return { version: r.version, date: r.date, files };
  }
  return null;
}

/** What the "Download" button gets: the DMG, the Windows installer or the AppImage (the .deb is the alternative). */
export function primaryFile(files: ReleaseFile[]): ReleaseFile | undefined {
  return files.find((f) => PRIMARY.includes(f.kind));
}

/** "All versions": newest first, each version's files by system. */
export function versionList(history = RELEASE_HISTORY): ReleaseEntry[] {
  return newestFirst(history).map((r) => ({ ...r, files: [...r.files].sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)) }));
}

/**
 * Decimal megabytes, as macOS counts them; one decimal place under 10 MB.
 * Only the number is localised: unit patterns differ between ICU builds, and
 * the server and the browser must print the same text.
 */
export function formatSize(bytes: number, locale: string): string {
  const mb = bytes / 1_000_000;
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: mb < 10 ? 1 : 0 }).format(mb)} MB`;
}

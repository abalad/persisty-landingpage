import { afterEach, describe, expect, it, vi } from "vitest";
import manifest from "../src/data/releases.json";
import { loadMessages } from "../src/i18n/messages";
import { routing } from "../src/i18n/routing";
import { listChangelog } from "../src/lib/content";
import { formatSize, latestFor, primaryFile, versionList, type ReleaseEntry, type ReleaseFile } from "../src/lib/releases";
import { compareVersions, isVersion } from "../src/lib/semver";

const file = (version: string, platform: ReleaseFile["platform"], kind: ReleaseFile["kind"], name: string): ReleaseFile => ({
  platform,
  kind,
  arch: platform === "mac" ? "universal" : "x64",
  name,
  url: `https://github.com/abalad/persisty-releases/releases/download/v${version}/${name}`,
  size: 92_000_000,
  sha256: "0".repeat(64),
});

const dmg8 = file("0.8.0", "mac", "dmg", "Persisty_0.8.0_universal.dmg");
const exe8 = file("0.8.0", "windows", "nsis", "Persisty_0.8.0_x64-setup.exe");
const appimage8 = file("0.8.0", "linux", "appimage", "Persisty_0.8.0_amd64.AppImage");
const deb8 = file("0.8.0", "linux", "deb", "Persisty_0.8.0_amd64.deb");
const dmg9 = file("0.9.0", "mac", "dmg", "Persisty_0.9.0_universal.dmg");
const exe9 = file("0.9.0", "windows", "nsis", "Persisty_0.9.0_x64-setup.exe");

const v080: ReleaseEntry = { version: "0.8.0", date: "2026-10-29", files: [dmg8, exe8, appimage8, deb8] };
/** Linux failed to build for 0.9.0. */
const v090: ReleaseEntry = { version: "0.9.0", date: "2026-11-05", files: [dmg9, exe9] };

describe("latestFor", () => {
  it("offers the newest version that has the system, with its own number", () => {
    expect(latestFor("linux", [v090, v080])).toEqual({ version: "0.8.0", date: "2026-10-29", files: [appimage8, deb8] });
    expect(latestFor("mac", [v090, v080])).toEqual({ version: "0.9.0", date: "2026-11-05", files: [dmg9] });
  });

  it("goes by version, not by the order it was given", () => {
    expect(latestFor("windows", [v080, v090])?.version).toBe("0.9.0");
  });

  it("has nothing before the first release", () => {
    expect(latestFor("mac", [])).toBeNull();
  });
});

describe("primaryFile", () => {
  it("is the AppImage on Linux, with the .deb as the alternative", () => {
    expect(primaryFile([deb8, appimage8])).toBe(appimage8);
  });

  it("is the installer elsewhere", () => {
    expect(primaryFile([dmg8])).toBe(dmg8);
    expect(primaryFile([exe8])).toBe(exe8);
  });

  it("is nothing when only the .deb is there", () => {
    expect(primaryFile([deb8])).toBeUndefined();
  });
});

describe("formatSize", () => {
  it("reads in megabytes, as the systems show them", () => {
    expect(formatSize(92_345_678, "en")).toBe("92 MB");
    expect(formatSize(5_400_000, "pt-BR")).toBe("5,4 MB");
  });
});

describe("All versions", () => {
  it("is empty before the first release, and says so in every language", async () => {
    expect(versionList([])).toEqual([]);
    const empty = { "pt-BR": "Nenhuma versão publicada ainda.", en: "No version published yet.", es: "Todavía no hay ninguna versión publicada." };
    for (const locale of routing.locales) {
      const catalog = (await loadMessages(locale)) as { download: { versions: { empty: string } } };
      expect(catalog.download.versions.empty, locale).toBe(empty[locale]);
    }
  });

  it("lists every version newest first, each one's files by system", () => {
    const list = versionList([v080, v090]);
    expect(list.map((r) => r.version)).toEqual(["0.9.0", "0.8.0"]);
    expect(list[1].files.map((f) => f.kind)).toEqual(["dmg", "nsis", "appimage", "deb"]);
  });
});

describe("the stable link /download/latest/<system>", () => {
  afterEach(() => {
    vi.doUnmock("@/data/releases.json");
    vi.resetModules();
  });

  async function visit(history: ReleaseEntry[], locale: string, platform: string) {
    vi.resetModules();
    vi.doMock("@/data/releases.json", () => ({ default: history }));
    const { GET } = await import("../src/app/[locale]/download/latest/[platform]/route");
    const res = await GET(new Request(`https://persisty.app/download/latest/${platform}`), { params: Promise.resolve({ locale, platform }) });
    return { status: res.status, location: res.headers.get("location") };
  }

  it("sends to the newest file of that system", async () => {
    expect(await visit([v090, v080], "pt-BR", "mac")).toEqual({ status: 307, location: dmg9.url });
    expect(await visit([v090, v080], "en", "linux")).toEqual({ status: 307, location: appimage8.url });
  });

  it("goes to the download page before the first release, in the reader's language", async () => {
    expect(await visit([], "pt-BR", "mac")).toEqual({ status: 307, location: "/download" });
    expect(await visit([], "en", "mac")).toEqual({ status: 307, location: "/en/download" });
  });

  it("goes to the download page for a system it does not know", async () => {
    expect(await visit([v090, v080], "pt-BR", "amiga")).toEqual({ status: 307, location: "/download" });
    expect(await visit([v090, v080], "es", "amiga")).toEqual({ status: 307, location: "/es/download" });
  });
});

describe("the manifest the release script writes", () => {
  const history = manifest as ReleaseEntry[];
  const KIND: Record<ReleaseFile["kind"], [ReleaseFile["platform"], ReleaseFile["arch"]]> = {
    dmg: ["mac", "universal"],
    nsis: ["windows", "x64"],
    appimage: ["linux", "x64"],
    deb: ["linux", "x64"],
  };

  it("has valid, unique versions, newest first, each with a date and files", () => {
    const versions = history.map((r) => r.version);
    for (const r of history) {
      expect(isVersion(r.version), r.version).toBe(true);
      expect(r.date, r.version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.files.length, r.version).toBeGreaterThan(0);
    }
    expect(new Set(versions).size).toBe(versions.length);
    expect([...versions].sort(compareVersions).reverse()).toEqual(versions);
  });

  it("has changelog notes for every version, in every language", async () => {
    for (const locale of routing.locales) {
      const notes = new Set((await listChangelog(locale)).map((e) => e.version));
      for (const r of history) expect(notes.has(r.version), `${locale}/${r.version}`).toBe(true);
    }
  });

  it("points every file at its release on GitHub, with a size and a SHA-256", () => {
    for (const r of history) {
      for (const f of r.files) {
        expect(f.url).toBe(`https://github.com/abalad/persisty-releases/releases/download/v${r.version}/${f.name}`);
        expect(f.sha256, f.name).toMatch(/^[0-9a-f]{64}$/);
        expect(f.size, f.name).toBeGreaterThan(0);
        expect(KIND[f.kind], f.name).toEqual([f.platform, f.arch]);
      }
    }
  });
});

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { routing } from "../src/i18n/routing";
import { getDoc, listDocs } from "../src/lib/content";

// The docs' videos: recordings of the current interface in public/docs-media/<page>/,
// listed in docs/docs-coverage.md (`## Mídia`), and every page without one says why
// (`## Páginas sem vídeo`). Two changelog clips of 0.10.0 still match the interface.
const APPROVED_CHANGELOG = ["/changelog/0.10.0/quadro.mp4", "/changelog/0.10.0/mascote.mp4"];
const MEDIA = join(process.cwd(), "public/docs-media");
const MAX_BYTES = 3_000_000;

const text = readFileSync(join(process.cwd(), "docs/docs-coverage.md"), "utf8");

/** The cells of a table row, without backticks, or null for a header divider or any other line. */
function cells(line: string): string[] | null {
  if (!line.startsWith("|")) return null;
  const parts = line.slice(1, line.endsWith("|") ? -1 : undefined).split("|").map((c) => c.trim().replace(/`/g, ""));
  return parts.every((c) => /^:?-+:?$/.test(c)) ? null : parts;
}

/** The rows of the table under `## title`, without its header row. */
function table(title: string, header: string): string[][] {
  const rows: string[][] = [];
  let inside = false;
  for (const line of text.split("\n")) {
    const h = /^## (.+)$/.exec(line);
    if (h) {
      inside = h[1].trim() === title;
      continue;
    }
    const row = inside ? cells(line) : null;
    if (row && row[0] !== header) rows.push(row);
  }
  return rows;
}

const mediaRows = () => table("Mídia", "Vídeo").map(([video, page, section]) => ({ video, page, section }));
const noVideoRows = () => table("Páginas sem vídeo", "Página").map(([page, reason]) => ({ page, reason }));

/** The recordings on disk, as `<page>/<name>.mp4`. */
function recordings(): string[] {
  if (!existsSync(MEDIA)) return [];
  return readdirSync(MEDIA, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => readdirSync(join(MEDIA, d.name)).filter((f) => f.endsWith(".mp4")).map((f) => `${d.name}/${f}`));
}

const clipsOf = (html: string) => [...html.matchAll(/<source src="([^"]+)"/g)].map((m) => m[1]);
const labelsOf = (html: string) => [...html.matchAll(/<video[^>]*aria-label="([^"]*)"/g)].map((m) => m[1]);

describe("docs media", () => {
  it("every docs clip is a docs recording or an approved changelog one", async () => {
    for (const locale of routing.locales) {
      for (const { slug } of listDocs(locale)) {
        const doc = await getDoc(locale, slug);
        for (const src of clipsOf(doc!.html)) {
          expect(src.startsWith("/docs-media/") || APPROVED_CHANGELOG.includes(src), `${locale}/${slug}: ${src}`).toBe(true);
        }
      }
    }
  });

  it("every language shows the same clips in the same order, each with its poster and its own description", async () => {
    for (const { slug } of listDocs("pt-BR")) {
      const reference = (await getDoc("pt-BR", slug))!.html;
      const clips = clipsOf(reference);
      const labels = labelsOf(reference);
      for (const src of clips) {
        expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
        expect(existsSync(join(process.cwd(), "public", src.replace(/\.mp4$/, ".jpg"))), `${src} poster`).toBe(true);
      }
      for (const locale of routing.locales) {
        const html = (await getDoc(locale, slug))!.html;
        expect(clipsOf(html), `${locale}/${slug}`).toEqual(clips);
        const own = labelsOf(html);
        expect(own.length, `${locale}/${slug} descriptions`).toBe(clips.length);
        own.forEach((label, i) => {
          expect(label.trim().length, `${locale}/${slug} #${i}`).toBeGreaterThan(10);
          if (locale !== "pt-BR") expect(label, `${locale}/${slug} #${i} is the pt-BR description`).not.toBe(labels[i]);
        });
      }
    }
  });

  it("the Mídia table and the recordings on disk match, and each sits under its section", async () => {
    const rows = mediaRows();
    expect(rows.map((r) => r.video).sort()).toEqual(recordings().sort());
    for (const { video, page, section } of rows) {
      expect(video.startsWith(`${page}/`), `${video} is in the folder of ${page}`).toBe(true);
      expect(existsSync(join(MEDIA, video.replace(/\.mp4$/, ".jpg"))), `${video} poster`).toBe(true);
      for (const locale of routing.locales) {
        expect(clipsOf((await getDoc(locale, page))!.html), `${locale}/${page}`).toContain(`/docs-media/${video}`);
      }
      const lines = readFileSync(join(process.cwd(), "content/docs/pt-BR", `${page}.md`), "utf8").split("\n");
      const at = lines.findIndex((l) => l.includes(`](/docs-media/${video})`));
      const heading = lines.slice(0, at).reverse().find((l) => l.startsWith("## "));
      expect(heading?.slice(3).trim(), `${video} section`).toBe(section);
    }
  });

  it.todo("every page has a video or says why not", async () => {
    const withVideo = new Set(mediaRows().map((r) => r.page));
    for (const { slug } of listDocs("pt-BR")) {
      if (clipsOf((await getDoc("pt-BR", slug))!.html).some((src) => APPROVED_CHANGELOG.includes(src))) withVideo.add(slug);
    }
    const without = noVideoRows();
    for (const { page, reason } of without) {
      expect(withVideo.has(page), `${page} has a video and a reason not to`).toBe(false);
      expect(reason.length, `${page} reason`).toBeGreaterThan(20);
    }
    const covered = new Set([...withVideo, ...without.map((r) => r.page)]);
    const missing = listDocs("pt-BR").map((d) => d.slug).filter((s) => !covered.has(s));
    expect(missing).toEqual([]);
  });

  it("every recording stays under 3 MB", () => {
    for (const video of recordings()) expect(statSync(join(MEDIA, video)).size, video).toBeLessThan(MAX_BYTES);
  });
});

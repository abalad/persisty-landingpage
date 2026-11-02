import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { routing } from "../src/i18n/routing";
import { absoluteMedia, listChangelog, renderMarkdown } from "../src/lib/content";

const clipsOf = (html: string) => [...html.matchAll(/<source src="([^"]+)"/g)].map((m) => m[1]);

describe("changelog clips", () => {
  it("a video written as an image becomes a muted looping clip over its lazy poster, alone in its figure", async () => {
    const html = await renderMarkdown("Texto.\n\n![Ditado por voz no terminal](/changelog/0.9.0/voz.mp4)\n\nDepois.\n", "pt-BR");
    expect(html).toContain('<figure class="clip">');
    // The poster is a picture of its own, loaded only near the screen (a video's poster always loads).
    expect(html).toMatch(/<figure class="clip"><img src="\/changelog\/0\.9\.0\/voz\.jpg" alt="" loading="lazy"[^>]*><video/);
    const video = html.match(/<video[^>]*>/)?.[0] ?? "";
    for (const attr of ["data-clip", "muted", "loop", "playsinline", 'preload="none"', "controls", 'aria-label="Ditado por voz no terminal"']) expect(video).toContain(attr);
    expect(video).not.toMatch(/autoplay|poster=/);
    expect(html).toContain('<source src="/changelog/0.9.0/voz.mp4" type="video/mp4">');
    expect(html).not.toMatch(/<p>\s*<figure/);
    expect(html).toContain("<p>Texto.</p>");
  });

  it("an ordinary picture stays a picture", async () => {
    const html = await renderMarkdown("![Logo](/brand/logo.png)\n", "pt-BR");
    expect(html).toContain('<img src="/brand/logo.png" alt="Logo">');
    expect(html).not.toContain("<video");
  });

  it("the feed points at the clips with full addresses", () => {
    const html = '<img src="/changelog/0.9.0/voz.jpg" alt=""><video><source src="/changelog/0.9.0/voz.mp4" type="video/mp4"></video><a href="/docs">d</a>';
    const out = absoluteMedia(html, "https://persisty.app");
    expect(out).toContain('<source src="https://persisty.app/changelog/0.9.0/voz.mp4"');
    expect(out).toContain('<img src="https://persisty.app/changelog/0.9.0/voz.jpg"');
    expect(out).toContain('href="/docs"');
  });

  it("every clip exists with its poster, and every language shows the same ones", async () => {
    const reference = new Map((await listChangelog("pt-BR")).map((e) => [e.version, clipsOf(e.html)]));
    for (const locale of routing.locales) {
      for (const e of await listChangelog(locale)) {
        const clips = clipsOf(e.html);
        expect(clips, `${locale}/${e.version}`).toEqual(reference.get(e.version));
        for (const src of clips) {
          expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
          expect(existsSync(join(process.cwd(), "public", src.replace(/\.mp4$/, ".jpg"))), `${src} poster`).toBe(true);
        }
        for (const label of [...e.html.matchAll(/<video[^>]*aria-label="([^"]*)"/g)].map((m) => m[1])) expect(label.trim().length, `${locale}/${e.version}`).toBeGreaterThan(10);
      }
    }
  });
});

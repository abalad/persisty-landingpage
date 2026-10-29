import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { routing } from "../src/i18n/routing";
import { DOC_GROUPS, getDoc, getLegal, LEGAL_PAGES, listChangelog, listDocs, renderMarkdown } from "../src/lib/content";
import { compareVersions, isVersion } from "../src/lib/semver";

describe("docs", () => {
  const slugs = (locale: (typeof routing.locales)[number]) => listDocs(locale).map((d) => d.slug).sort();

  it("exist in every language with the same pages", () => {
    const reference = slugs("pt-BR");
    expect(reference.length).toBeGreaterThan(5);
    for (const locale of routing.locales) expect(slugs(locale)).toEqual(reference);
  });

  it("start with getting-started", () => {
    for (const locale of routing.locales) expect(listDocs(locale)[0].slug).toBe("getting-started");
  });

  it("have a title, a description, a known group and an order", () => {
    for (const locale of routing.locales) {
      for (const d of listDocs(locale)) {
        expect(d.title.trim(), `${locale}/${d.slug}`).not.toBe("");
        expect(d.description.trim(), `${locale}/${d.slug}`).not.toBe("");
        expect(DOC_GROUPS, `${locale}/${d.slug}`).toContain(d.group);
        expect(Number.isFinite(d.order), `${locale}/${d.slug}`).toBe(true);
      }
    }
  });

  // The first render loads Shiki's grammars and themes: about 4.5s alone, past vitest's 5s on a busy machine.
  it("render to HTML with linkable section headings", { timeout: 20_000 }, async () => {
    const doc = await getDoc("pt-BR", "getting-started");
    expect(doc?.html).toContain("<h2");
    expect(doc?.headings.length).toBeGreaterThan(0);
    expect(doc?.html).toContain(`id="${doc?.headings[0].id}"`);
  });

  it("keep internal links in the reader's language", async () => {
    expect(await renderMarkdown("[d](/download) [p](/docs/pro#x)", "en")).toContain('href="/en/download"');
    expect(await renderMarkdown("[p](/docs/pro#x)", "es")).toContain('href="/es/docs/pro#x"');
    expect(await renderMarkdown("[d](/download)", "pt-BR")).toContain('href="/download"');
  });

  it("leave links to other sites and anchors alone", async () => {
    const html = await renderMarkdown("[c](https://docs.claude.com/x) [a](#here) [n](//cdn.example/x)", "en");
    expect(html).toContain('href="https://docs.claude.com/x"');
    expect(html).toContain('href="#here"');
    expect(html).toContain('href="//cdn.example/x"');
  });

  it("never leak raw HTML tags as text", async () => {
    for (const locale of routing.locales) {
      for (const d of listDocs(locale)) {
        const doc = await getDoc(locale, d.slug);
        expect(doc?.html, `${locale}/${d.slug}`).not.toMatch(/&#x3C;\/?kbd|&lt;\/?kbd/);
      }
    }
  });

  it("return null for a page that does not exist", async () => {
    expect(await getDoc("en", "nope")).toBeNull();
  });

  it("refuse a slug that tries to leave the docs folder", async () => {
    expect(await getDoc("en", "../../package")).toBeNull();
  });
});

describe("changelog", () => {
  it("has the same versions in every language", async () => {
    const ids = async (l: (typeof routing.locales)[number]) => (await listChangelog(l)).map((e) => e.id);
    const reference = await ids("pt-BR");
    expect(reference.length).toBeGreaterThan(0);
    for (const locale of routing.locales) expect(await ids(locale)).toEqual(reference);
  });

  it("is versioned, newest first", async () => {
    for (const locale of routing.locales) {
      const entries = await listChangelog(locale);
      for (const e of entries) {
        expect(isVersion(e.version), `${locale}/${e.version}`).toBe(true);
        expect(e.id).toBe(e.version);
      }
      const versions = entries.map((e) => e.version);
      expect([...versions].sort(compareVersions).reverse(), locale).toEqual(versions);
    }
    expect((await listChangelog("pt-BR")).map((e) => e.version)).toEqual(["0.8.0", "0.7.0", "0.6.0", "0.5.0", "0.4.0", "0.3.0", "0.2.0", "0.1.0"]);
  });

  it("keeps the date", async () => {
    for (const locale of routing.locales) {
      for (const e of await listChangelog(locale)) expect(e.date, `${locale}/${e.version}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  describe("refuses an entry", () => {
    const root = mkdtempSync(join(tmpdir(), "changelog-"));
    const entry = (name: string, frontmatter: string) => {
      const dir = join(root, name.replace(/\W/g, "_"), "changelog", "en");
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, name), `---\ntitle: X\ndate: 2026-10-20\n${frontmatter}---\n\nBody.\n`);
      return join(root, name.replace(/\W/g, "_"));
    };
    afterAll(() => rmSync(root, { recursive: true, force: true }));

    it("whose file is not named after its version", async () => {
      await expect(listChangelog("en", entry("2026-10-20-first.md", "version: 0.1.0\n"))).rejects.toThrow(/2026-10-20-first\.md/);
    });

    it("without a version", async () => {
      await expect(listChangelog("en", entry("0.1.0.md", ""))).rejects.toThrow(/0\.1\.0\.md/);
    });

    it("with a version that is not one", async () => {
      await expect(listChangelog("en", entry("0.1.md", "version: 0.1\n"))).rejects.toThrow(/0\.1\.md/);
    });
  });
});

describe("legal pages", () => {
  it("exist in every language", async () => {
    for (const locale of ["pt-BR", "en", "es"] as const) {
      for (const slug of LEGAL_PAGES) expect(await getLegal(locale, slug, "x"), `${locale}/${slug}`).not.toBeNull();
    }
  });

  it("put the contact text where the page asks for it", async () => {
    const page = await getLegal("pt-BR", "privacy", "Escreva para [nós](mailto:a@b.example).");
    expect(page?.html).toContain('href="mailto:a@b.example"');
    expect(page?.html).not.toContain("{{contact}}");
  });
});

import { describe, expect, it } from "vitest";
import { routing } from "../src/i18n/routing";
import { DOC_GROUPS, getDoc, getLegal, LEGAL_PAGES, listChangelog, listDocs, renderMarkdown } from "../src/lib/content";

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
  it("has the same entries in every language", async () => {
    const ids = async (l: (typeof routing.locales)[number]) => (await listChangelog(l)).map((e) => e.id);
    const reference = await ids("pt-BR");
    expect(reference.length).toBeGreaterThan(0);
    for (const locale of routing.locales) expect(await ids(locale)).toEqual(reference);
  });

  it("is dated and newest first", async () => {
    const entries = await listChangelog("en");
    for (const e of entries) expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    const dates = entries.map((e) => e.date);
    expect([...dates].sort().reverse()).toEqual(dates);
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

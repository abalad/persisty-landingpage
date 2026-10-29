import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import rehypeShiki from "@shikijs/rehype";
import matter from "gray-matter";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Locale } from "@/i18n/routing";
import { localizedPath } from "./seo";
import { compareVersions, isVersion } from "./semver";

const ROOT = join(process.cwd(), "content");

export const DOC_GROUPS = ["start", "work", "account", "reference"] as const;
export type DocGroup = (typeof DOC_GROUPS)[number];

export interface DocMeta {
  slug: string;
  title: string;
  description: string;
  group: DocGroup;
  order: number;
}

export interface Heading {
  id: string;
  text: string;
  depth: 2 | 3;
}

export interface Doc extends DocMeta {
  html: string;
  headings: Heading[];
}

/** One version's notes; `id` is the version, so it is also the page anchor. */
export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  html: string;
}

const SLUG = /^[a-z0-9-]+$/;

function files(dir: string): string[] {
  try {
    return readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
}

/** Docs of one language in reading order: by group, then by `order`. */
export function listDocs(locale: Locale): DocMeta[] {
  const dir = join(ROOT, "docs", locale);
  return files(dir)
    .map((f) => {
      const { data } = matter(readFileSync(join(dir, f), "utf8"));
      return { slug: f.replace(/\.md$/, ""), title: String(data.title ?? ""), description: String(data.description ?? ""), group: data.group as DocGroup, order: Number(data.order) };
    })
    .sort((a, b) => DOC_GROUPS.indexOf(a.group) - DOC_GROUPS.indexOf(b.group) || a.order - b.order);
}

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** Site-relative links point at the same page in the reader's language. */
function rehypeLocalLinks(locale: Locale) {
  return () => (tree: HastNode) => {
    const walk = (node: HastNode) => {
      const href = node.properties?.href;
      if (node.tagName === "a" && typeof href === "string" && href.startsWith("/") && !href.startsWith("//")) {
        node.properties!.href = localizedPath(locale, href);
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export async function renderMarkdown(markdown: string, locale: Locale): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeLocalLinks(locale))
    .use(rehypeSlug)
    .use(rehypeShiki, { theme: "github-dark-default" })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(file);
}

const strip = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

function headingsOf(html: string): Heading[] {
  return [...html.matchAll(/<h([23]) id="([^"]+)">(.*?)<\/h\1>/g)].map((m) => ({ depth: Number(m[1]) as 2 | 3, id: m[2], text: strip(m[3]) }));
}

export async function getDoc(locale: Locale, slug: string): Promise<Doc | null> {
  if (!SLUG.test(slug)) return null;
  let raw: string;
  try {
    raw = readFileSync(join(ROOT, "docs", locale, `${slug}.md`), "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const html = await renderMarkdown(content, locale);
  return {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    group: data.group as DocGroup,
    order: Number(data.order),
    html,
    headings: headingsOf(html),
  };
}

/**
 * Every changelog entry of one language, newest version first. Each file is
 * `<version>.md` with that `version` in its frontmatter; anything else is an
 * error, so a misnamed entry fails the build instead of going missing.
 */
export async function listChangelog(locale: Locale, root = ROOT): Promise<ChangelogEntry[]> {
  const dir = join(root, "changelog", locale);
  const entries = await Promise.all(
    files(dir).map(async (f) => {
      const { data, content } = matter(readFileSync(join(dir, f), "utf8"));
      const version = data.version === undefined ? "" : String(data.version);
      if (!isVersion(version) || f !== `${version}.md`) throw new Error(`changelog/${locale}/${f}: the file must be <version>.md with that version in its frontmatter`);
      const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
      return { id: version, version, date, title: String(data.title ?? ""), html: await renderMarkdown(content, locale) };
    }),
  );
  return entries.sort((a, b) => compareVersions(b.version, a.version));
}

export const LEGAL_PAGES = ["privacy", "security", "terms"] as const;
export type LegalSlug = (typeof LEGAL_PAGES)[number];

export interface LegalPage {
  title: string;
  description: string;
  updated: string;
  html: string;
}

/** A trust page; `{{contact}}` in the text becomes `contact` (Markdown). */
export async function getLegal(locale: Locale, slug: LegalSlug, contact: string): Promise<LegalPage | null> {
  let raw: string;
  try {
    raw = readFileSync(join(ROOT, "legal", locale, `${slug}.md`), "utf8");
  } catch {
    return null;
  }
  const { data, content } = matter(raw);
  const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated);
  return { title: String(data.title ?? ""), description: String(data.description ?? ""), updated, html: await renderMarkdown(content.replaceAll("{{contact}}", contact), locale) };
}

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { routing, type Locale } from "../src/i18n/routing";
import { getDoc, listDocs } from "../src/lib/content";
import config from "../next.config";

const ROOT = process.cwd();

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function localeOf(file: string): Locale | null {
  const part = relative(ROOT, file).split("/").find((p) => (routing.locales as readonly string[]).includes(p));
  return (part as Locale | undefined) ?? null;
}

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

describe("docs links", () => {
  it("every internal docs link points to an existing page and heading", { timeout: 120_000 }, async () => {
    const ids = new Map<string, Set<string>>();
    for (const locale of routing.locales) {
      for (const d of listDocs(locale)) {
        const doc = await getDoc(locale, d.slug);
        ids.set(`${locale}/${d.slug}`, new Set((doc?.headings ?? []).map((h) => h.id)));
      }
    }

    const files = ["content/docs", "content/changelog", "content/legal", "messages"].flatMap((d) => walk(join(ROOT, d)));
    const broken: string[] = [];
    for (const file of files) {
      const locale = localeOf(file);
      if (!locale) {
        broken.push(`${relative(ROOT, file)}: no language folder`);
        continue;
      }
      const text = readFileSync(file, "utf8");
      for (const m of text.matchAll(/(?<![\w.])\/docs\/([a-z0-9-]+)(?:#([^\s)"'\]<>]+))?/g)) {
        const target = ids.get(`${locale}/${m[1]}`);
        if (!target) broken.push(`${relative(ROOT, file)}: ${m[0]} (no such page)`);
        else if (m[2] && !target.has(decode(m[2]))) broken.push(`${relative(ROOT, file)}: ${m[0]} (no such heading)`);
      }
      const rel = relative(ROOT, file).split("/");
      if (rel[0] === "content" && rel[1] === "docs") {
        const own = ids.get(`${locale}/${rel[3].replace(/\.md$/, "")}`);
        for (const m of text.matchAll(/\]\(#([^\s)]+)\)/g)) {
          if (!own?.has(decode(m[1]))) broken.push(`${relative(ROOT, file)}: #${m[1]} (no such heading in this page)`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("redirects the old editor-and-git address in every language", async () => {
    const redirects = (await config.redirects?.()) ?? [];
    for (const prefix of ["", "/en", "/es"]) {
      expect(redirects).toContainEqual({ source: `${prefix}/docs/editor-and-git`, destination: `${prefix}/docs/editor`, permanent: true });
    }
  });
});

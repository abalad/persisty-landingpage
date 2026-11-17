import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getDoc, listChangelog } from "../src/lib/content";

// The coverage inventory: every released item and every settings tab, mapped to
// the doc page that covers it. docs/docs-coverage.md is the map the per-feature
// docs are written from.
const text = readFileSync(join(process.cwd(), "docs/docs-coverage.md"), "utf8");

interface Row {
  item: string;
  page: string;
  status: string;
}

/** The cells of a table row, or null for a header, a divider or any other line. */
function cells(line: string): string[] | null {
  if (!line.startsWith("|")) return null;
  const parts = line.slice(1, line.endsWith("|") ? -1 : undefined).split("|").map((c) => c.trim());
  return parts.every((c) => /^:?-+:?$/.test(c)) ? null : parts;
}

/** The sections `## title` of the file, each with the table rows under it. */
function sections(): Map<string, string[][]> {
  const out = new Map<string, string[][]>();
  let current: string[][] | null = null;
  for (const line of text.split("\n")) {
    const h = /^## (.+)$/.exec(line);
    if (h) {
      current = [];
      out.set(h[1].trim(), current);
      continue;
    }
    const row = cells(line);
    if (current && row) current.push(row);
  }
  return out;
}

const all = sections();
const isVersion = (title: string) => /^\d+\.\d+\.\d+$/.test(title);

/** Rows of the item tables: the header row of each table is skipped. */
function itemRows(): Row[] {
  const rows: Row[] = [];
  for (const [title, table] of all) {
    if (!isVersion(title) && title !== "Configurações") continue;
    for (const r of table) {
      if (r[0] === "Item") continue;
      expect(r.length, `row with ${r.length} columns in ${title}: ${r[0]}`).toBe(3);
      rows.push({ item: r[0], page: r[1], status: r[2] });
    }
  }
  return rows;
}

function pageSlugs(): string[] {
  const table = all.get("Páginas") ?? [];
  return table.filter((r) => r.length === 3 && r[0] !== "Slug").map((r) => r[0].replace(/`/g, ""));
}

describe("docs coverage inventory", () => {
  it("has a section for every released version", async () => {
    const released = (await listChangelog("pt-BR")).map((e) => e.version).sort();
    const titles = [...all.keys()].filter(isVersion).sort();
    expect(titles).toEqual(released);
  });

  it("has at least one row per changelog item in every version", () => {
    for (const [title, table] of all) {
      if (!isVersion(title)) continue;
      const file = readFileSync(join(process.cwd(), "content/changelog/pt-BR", `${title}.md`), "utf8");
      const bullets = file.split("\n").filter((l) => l.startsWith("- ")).length;
      const rows = table.filter((r) => r[0] !== "Item").length;
      expect(rows, `rows for ${title}`).toBeGreaterThanOrEqual(bullets);
    }
  });

  it("has a settings section listing every settings tab", () => {
    const tabs = ["Agentes", "Uso de IA", "Atalhos", "Conta", "Contas de IA", "Sobre", "Integrações", "Aparência", "Privacidade e rede", "Terminal", "Arquivos", "Editor", "Workspace", "Notificações", "Voz", "Servidores MCP"];
    const section = all.get("Configurações");
    expect(section, "## Configurações").toBeDefined();
    const items = section!.map((r) => r[0]);
    for (const tab of tabs) expect(items.some((i) => i.startsWith(`${tab} ›`)), `a row for ${tab}`).toBe(true);
  });

  it("gives every row a page or a reason", () => {
    const rows = itemRows();
    expect(rows.length).toBeGreaterThan(100);
    for (const r of rows) {
      expect(r.item, "empty item").not.toBe("");
      const noDoc = r.status.startsWith("sem doc: ") && r.status.length > "sem doc: ".length;
      expect(noDoc || r.status === "coberto" || r.status === "a escrever", `status of ${r.item}: ${r.status}`).toBe(true);
      // The anchor is the id rehype-slug gives the heading, which keeps accents (`sessões-e-abas`).
      if (!noDoc) expect(r.page, `page of ${r.item}`).toMatch(/^[a-z][a-z0-9-]*(#[\p{Ll}\p{N}-]+)?$/u);
    }
  });

  it("only points to pages in the page list", () => {
    const slugs = pageSlugs();
    expect(slugs.length).toBeGreaterThan(30);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const r of itemRows()) {
      if (r.status.startsWith("sem doc")) continue;
      expect(slugs, `page of ${r.item}`).toContain(r.page.split("#")[0]);
    }
  });

  // A row marked covered must lead somewhere: the pt-BR page exists and, with an anchor, has that heading.
  it("points every covered row to a real heading", { timeout: 120_000 }, async () => {
    const ids = new Map<string, Set<string> | null>();
    const missing: string[] = [];
    for (const r of itemRows()) {
      if (r.status !== "coberto") continue;
      const [slug, anchor] = r.page.split("#");
      if (!ids.has(slug)) {
        const doc = await getDoc("pt-BR", slug);
        ids.set(slug, doc ? new Set(doc.headings.map((h) => h.id)) : null);
      }
      const headings = ids.get(slug);
      if (!headings) missing.push(`${r.item}: no page ${slug}`);
      else if (anchor && !headings.has(decodeURIComponent(anchor))) missing.push(`${r.item}: no heading #${anchor} in ${slug}`);
    }
    expect(missing).toEqual([]);
  });
});

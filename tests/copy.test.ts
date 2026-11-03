import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { loadMessages } from "../src/i18n/messages";
import { routing } from "../src/i18n/routing";

/**
 * The site sells what you see with the app open. It never promises that
 * agents keep working once Persisty is closed, and never names what runs
 * underneath (tmux, the supervisor).
 */

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const pages = [...files("messages"), ...files("content")].map((path) => ({ path, text: readFileSync(path, "utf8") }));

const hits = (pattern: RegExp) =>
  pages.flatMap(({ path, text }) => text.split("\n").filter((line) => pattern.test(line)).map((line) => `${path}: ${line.trim()}`));

describe("site copy", () => {
  it("does not name the mechanism behind the sessions", () => {
    expect(hits(/tmux|supervis/i)).toEqual([]);
  });

  it("does not promise work going on with the app closed", () => {
    const promises = [
      // pt-BR
      /fica viv|continua(m)? rodando|nada para\.|não mata nada|os processos, não|saia, e o trabalho|trabalhar sem você/i,
      // en
      /stays alive|keeps? running|nothing stops|kills nothing|processes did not|walk away|work without you/i,
      // es
      /sigue viv|siguen? corriendo|nada se detiene|no mata nada|los procesos, no|vete, y el trabajo|trabajar sin ti/i,
    ];
    expect(promises.flatMap(hits)).toEqual([]);
  });

  it("has no quit-the-app scenario in the recovery demo", async () => {
    for (const locale of routing.locales) {
      const crash = ((await loadMessages(locale)) as { mock: { crash: Record<string, unknown> } }).mock.crash;
      expect(Object.keys(crash), locale).not.toContain("closeApp");
      expect(Object.keys(crash), locale).not.toContain("closed");
    }
  });

  it("promises Team only that code never leaves the machine, not a fixed list of what the server gets", async () => {
    const never = { "pt-BR": /nunca saem/, en: /never leave/, es: /nunca salen/ } as const;
    const tooMuch = /tudo que vier no Team|everything coming to Team|todo lo que venga en Team/;
    for (const locale of routing.locales) {
      const body = ((await loadMessages(locale)) as { plans: { team: { privacy: { body: string } } } }).plans.team.privacy.body;
      expect(body, locale).toMatch(never[locale]);
      expect(body, locale).not.toMatch(new RegExp(`(conta, plano, assentos e computadores|account, plan, seats and computers|cuenta, plan, asientos y computadoras)[^.]*\\.[^.]*(${tooMuch.source})`));
    }
  });

  it("says the planned Remote needs Persisty open on the computer, and puts the phone first", async () => {
    const open = { "pt-BR": /Persisty aberto/, en: /Persisty open/, es: /Persisty abierto/ } as const;
    for (const locale of routing.locales) {
      const m = (await loadMessages(locale)) as { pricing: { features: Record<string, string> }; features: Record<string, { line: string }> };
      expect(m.features.remote.line, locale).toMatch(open[locale]);
      expect(m.pricing.features.remote, locale).toMatch(/iPhone/);
    }
  });
});

import { describe, expect, it } from "vitest";
import { mask, message, recipients, sendPlan } from "../scripts/release/announce-lib.mjs";

describe("recipients", () => {
  const users = [
    { email: "ana@example.com", user_metadata: { notify_release: true, locale: "en" } },
    { email: "bia@example.com", user_metadata: { notify_release: false, locale: "en" } },
    { email: "caio@example.com", user_metadata: {} },
    { email: "dora@example.com" },
    { user_metadata: { notify_release: true } },
    { email: "", user_metadata: { notify_release: true } },
    { email: "eva@example.com", user_metadata: { notify_release: "yes" } },
    { email: "fabio@example.com", user_metadata: { notify_release: true } },
    { email: "gil@example.com", user_metadata: { notify_release: true, locale: "fr" } },
    { email: "hugo@example.com", user_metadata: { notify_release: true, locale: "es" } },
  ];

  it("are only the people who turned the notice on and have an e-mail, in their language or Portuguese", () => {
    expect(recipients(users)).toEqual([
      { email: "ana@example.com", locale: "en" },
      { email: "fabio@example.com", locale: "pt-BR" },
      { email: "gil@example.com", locale: "pt-BR" },
      { email: "hugo@example.com", locale: "es" },
    ]);
  });

  it("count each address once", () => {
    const twice = [
      { email: "Ana@Example.com", user_metadata: { notify_release: true } },
      { email: "ana@example.com", user_metadata: { notify_release: true } },
    ];
    expect(recipients(twice)).toHaveLength(1);
  });
});

describe("message", () => {
  it("names the version and links in English for English readers", () => {
    const m = message("en", "0.8.0");
    expect(m.subject).toContain("0.8.0");
    for (const link of ["https://persisty.app/en/download", "https://persisty.app/en/changelog#0.8.0", "https://persisty.app/en/account"]) {
      expect(m.text, link).toContain(link);
      expect(m.html, link).toContain(`href="${link}"`);
    }
  });

  it("links without a language prefix in Portuguese", () => {
    const m = message("pt-BR", "0.8.0");
    expect(m.subject).toContain("0.8.0");
    for (const link of ["https://persisty.app/download", "https://persisty.app/changelog#0.8.0", "https://persisty.app/account"]) expect(m.text).toContain(link);
    expect(m.text).not.toMatch(/persisty\.app\/(pt-BR|en|es)\//);
  });

  it("links in Spanish for Spanish readers", () => {
    expect(message("es", "0.8.0").text).toContain("https://persisty.app/es/changelog#0.8.0");
  });

  it("follows the site's copy rules", () => {
    for (const locale of ["pt-BR", "en", "es"] as const) {
      const { subject, text } = message(locale, "0.8.0");
      expect(`${subject}\n${text}`, locale).not.toMatch(/tmux|supervis/i);
      expect(text, locale).toMatch(locale === "en" ? /preview/ : locale === "es" ? /preliminar/ : /prévia/);
    }
  });

  it("refuses something that is not a version", () => {
    expect(() => message("en", "v0.8")).toThrow(/v0\.8/);
  });
});

describe("mask", () => {
  it("shows the first letter and the domain only", () => {
    expect(mask("maria@gmail.com")).toBe("m***@gmail.com");
  });
});

describe("sendPlan", () => {
  const list = Array.from({ length: 230 }, (_, i) => ({ email: `p${String(i).padStart(3, "0")}@example.com`, locale: "pt-BR" as const }));

  it("sends in batches of up to 100 and stops at the day's limit, saying how many are left", () => {
    const plan = sendPlan(list, { limit: 100 });
    expect(plan.batches.map((b) => b.length)).toEqual([100]);
    expect(plan.left).toBe(130);
  });

  it("picks up where the last run stopped", () => {
    const plan = sendPlan(list, { skip: 200, limit: 100 });
    expect(plan.batches.flat()[0].email).toBe("p200@example.com");
    expect(plan.batches.map((b) => b.length)).toEqual([30]);
    expect(plan.left).toBe(0);
  });

  it("splits a larger allowance into batches of 100", () => {
    expect(sendPlan(list, { limit: 250 }).batches.map((b) => b.length)).toEqual([100, 100, 30]);
  });
});

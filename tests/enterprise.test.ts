import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const files = (dir: string): string[] => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? files(join(dir, n)) : [join(dir, n)]));
// The account's sign-in intent and plan name stay (unreachable, ready to switch back on); the 0.7.0 changelog is history.
const allowed = (path: string) => path.endsWith("auth.json") || path.includes("content/changelog/");
// Enterprise's own card copy stays too, so bringing the plan back is one value in `SHOWN_PLAN_IDS`.
const text = (path: string) => {
  const raw = readFileSync(path, "utf8");
  if (!path.endsWith("pricing.json")) return raw;
  const json = JSON.parse(raw) as { plans: Record<string, unknown> };
  delete json.plans.enterprise;
  return JSON.stringify(json, null, 2);
};

describe("Enterprise is out of sight", () => {
  it("is not named in any page text", () => {
    const hits = [...files("messages"), ...files("content")]
      .filter((p) => !allowed(p))
      .flatMap((p) => text(p).split("\n").filter((l) => /enterprise/i.test(l)).map((l) => `${p}: ${l.trim()}`));
    expect(hits).toEqual([]);
  });

  // PlanCards keeps its Enterprise branch for the day the plan comes back; it only renders plans in SHOWN_PLANS.
  it("is not linked from the home page's section for companies", () => {
    expect(readFileSync("src/components/home/Companies.tsx", "utf8")).not.toMatch(/contactHref\("enterprise"\)/);
  });
});

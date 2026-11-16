import { describe, expect, it } from "vitest";
import { analyticsEnabled, contactHref, GOOGLE_ANALYTICS_ID } from "../src/lib/site";

describe("contactHref", () => {
  it("opens an e-mail about Enterprise when an address is configured", () => {
    expect(contactHref("enterprise", "vendas@persist.example")).toBe("mailto:vendas@persist.example?subject=Persisty%20Enterprise");
  });

  it("opens a general e-mail when an address is configured", () => {
    expect(contactHref("contact", "vendas@persist.example")).toBe("mailto:vendas@persist.example?subject=Persisty");
  });

  it("without an address, sends Enterprise interest through the account", () => {
    expect(contactHref("enterprise", "")).toBe("/sign-in?next=%2Faccount&interest=enterprise");
  });

  it("without an address, offers no general contact", () => {
    expect(contactHref("contact", undefined)).toBeNull();
  });
});

describe("SITE_URL", () => {
  it("is the persisty.app domain unless the environment says otherwise", async () => {
    const { SITE_URL } = await import("../src/lib/site");
    expect(SITE_URL).toBe(process.env.NEXT_PUBLIC_SITE_URL ?? "https://persisty.app");
  });
});

describe("analyticsEnabled", () => {
  it("only in Vercel production with an ID", () => {
    expect(analyticsEnabled("production", "G-ABC123")).toBe(true);
    expect(analyticsEnabled("preview", "G-ABC123")).toBe(false);
    expect(analyticsEnabled(undefined, "G-ABC123")).toBe(false);
    expect(analyticsEnabled("production", "")).toBe(false);
  });

  it("has the Persisty Site measurement ID", () => {
    expect(GOOGLE_ANALYTICS_ID).toMatch(/^G-[A-Z0-9]{6,}$/);
  });
});

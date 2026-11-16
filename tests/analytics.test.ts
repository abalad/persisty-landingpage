import { describe, expect, it } from "vitest";
import { checkoutDone, cleanLocation, cleanReferrer, downloadOf, isNewAccount, pageView, rememberLanding, startAnalytics, stopAnalytics, track, type GtagWindow } from "../src/lib/analytics";

const ID = "G-ABC123";

function fakeWindow(href = "https://persisty.app/", referrer = ""): GtagWindow {
  return { location: { href }, document: { referrer } };
}

/** What gtag was asked to do, in order: each `dataLayer` entry is the call's `arguments`. */
const calls = (win: GtagWindow) => (win.dataLayer ?? []).map((entry) => Array.from(entry as ArrayLike<unknown>));
const pageViews = (win: GtagWindow) => calls(win).filter((c) => c[0] === "event" && c[1] === "page_view");

describe("cleanLocation", () => {
  it("keeps only campaign parameters and drops the hash", () => {
    expect(cleanLocation("https://persisty.app/en/docs/x?utm_source=a&next=%2Faccount&gclid=g#h")).toBe("https://persisty.app/en/docs/x?utm_source=a&gclid=g");
    expect(cleanLocation("https://persisty.app/sign-in?next=%2Faccount&interest=enterprise")).toBe("https://persisty.app/sign-in");
  });
});

describe("cleanReferrer", () => {
  it("sends only the referrer's origin", () => {
    expect(cleanReferrer("https://www.google.com/search?q=persisty")).toBe("https://www.google.com");
    expect(cleanReferrer("")).toBe("");
    expect(cleanReferrer("not a url")).toBe("");
  });

  it("does not credit Stripe for coming back from checkout or the billing portal", () => {
    expect(cleanReferrer("https://checkout.stripe.com/c/pay/cs_live_x")).toBe("");
    expect(cleanReferrer("https://billing.stripe.com/p/session/x")).toBe("");
  });
});

describe("checkoutDone", () => {
  it("names the plan when it is already paid on arrival, and nothing otherwise", () => {
    expect(checkoutDone("pro")).toEqual({ name: "checkout_done", params: { plan: "pro" } });
    expect(checkoutDone("free")).toEqual({ name: "checkout_done", params: {} });
  });
});

describe("downloadOf", () => {
  it("knows each installer from its URL", () => {
    const base = "https://github.com/abalad/persisty-releases/releases/download/v0.13.0/";
    expect(downloadOf(base + "Persisty_0.13.0_universal.dmg")).toEqual({ platform: "mac", kind: "dmg", version: "0.13.0" });
    expect(downloadOf(base + "Persisty_0.13.0_x64-setup.exe")).toEqual({ platform: "windows", kind: "nsis", version: "0.13.0" });
    expect(downloadOf(base + "Persisty_0.13.0_amd64.AppImage")).toEqual({ platform: "linux", kind: "appimage", version: "0.13.0" });
    expect(downloadOf(base + "Persisty_0.13.0_amd64.deb")).toEqual({ platform: "linux", kind: "deb", version: "0.13.0" });
    expect(downloadOf("https://persisty.app/download")).toBeNull();
    expect(downloadOf(base + "latest.json")).toBeNull();
  });
});

describe("isNewAccount", () => {
  it("calls an account new for ten minutes", () => {
    const now = Date.parse("2026-11-16T12:00:00Z");
    expect(isNewAccount("2026-11-16T11:55:00Z", now)).toBe(true);
    expect(isNewAccount("2026-11-16T11:49:00Z", now)).toBe(false);
    expect(isNewAccount(undefined, now)).toBe(false);
  });
});

describe("gtag", () => {
  it("configures gtag once, without signals and without the automatic page view", () => {
    const win = fakeWindow();
    startAnalytics(ID, win);
    startAnalytics(ID, win);
    const config = calls(win).filter((c) => c[0] === "config");
    expect(config).toEqual([
      ["config", ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34128000 }],
    ]);
    expect(calls(win).filter((c) => c[0] === "js")).toHaveLength(1);
    expect(win[`ga-disable-${ID}`]).toBe(false);
  });

  it("turns the tag's own page view off before the config, where `send_page_view` in the config alone does not", () => {
    // Measured on 2026-11-16: with only the config option, the Google tag still sent a page_view with the raw address.
    const win = fakeWindow();
    startAnalytics(ID, win);
    const order = calls(win).map((c) => c[0]);
    expect(calls(win)[0]).toEqual(["set", "send_page_view", false]);
    expect(order.indexOf("set")).toBeLessThan(order.indexOf("config"));
  });

  it("one page_view per clean address", () => {
    const win = fakeWindow("https://persisty.app/account?checkout=done", "https://www.google.com/search?q=persisty");
    startAnalytics(ID, win);
    pageView(win);
    win.location.href = "https://persisty.app/account";
    pageView(win);
    win.location.href = "https://persisty.app/account#devices";
    pageView(win);
    expect(pageViews(win)).toEqual([["event", "page_view", { page_location: "https://persisty.app/account", page_referrer: "https://www.google.com" }]]);
    win.location.href = "https://persisty.app/pricing?utm_source=x";
    pageView(win);
    expect(pageViews(win)).toHaveLength(2);
    expect(pageViews(win)[1][2]).toEqual({ page_location: "https://persisty.app/pricing?utm_source=x", page_referrer: "https://www.google.com" });
  });

  it("every later event inherits the clean address", () => {
    const win = fakeWindow("https://persisty.app/sign-in?next=%2Faccount");
    startAnalytics(ID, win);
    pageView(win);
    expect(calls(win)).toContainEqual(["set", { page_location: "https://persisty.app/sign-in", page_referrer: "" }]);
  });

  it("does nothing and never throws before consent", () => {
    const win = fakeWindow();
    expect(() => pageView(win)).not.toThrow();
    expect(() => track({ name: "begin_checkout", params: { plan: "pro" } }, win)).not.toThrow();
    expect(win.dataLayer).toBeUndefined();
  });

  it("never throws when gtag.js was blocked and only the queue exists", () => {
    const win = fakeWindow();
    startAnalytics(ID, win);
    expect(() => pageView(win)).not.toThrow();
    expect(() => track({ name: "sign_up", params: { method: "email" } }, win)).not.toThrow();
  });

  it("stop then start again turns the disable flag off and sends the next page view", () => {
    const win = fakeWindow("https://persisty.app/");
    startAnalytics(ID, win);
    pageView(win);
    stopAnalytics(ID, win);
    expect(win[`ga-disable-${ID}`]).toBe(true);
    startAnalytics(ID, win);
    expect(win[`ga-disable-${ID}`]).toBe(false);
    pageView(win);
    expect(pageViews(win)).toHaveLength(2);
  });

  it("the first page view after a late Accept keeps the landing page's campaign", () => {
    const win = fakeWindow("https://persisty.app/?utm_source=newsletter&next=%2Fx");
    rememberLanding(win);
    win.location.href = "https://persisty.app/pricing";
    startAnalytics(ID, win);
    pageView(win);
    expect(pageViews(win)[0][2]).toMatchObject({ page_location: "https://persisty.app/pricing?utm_source=newsletter" });
    win.location.href = "https://persisty.app/download";
    pageView(win);
    expect(pageViews(win)[1][2]).toMatchObject({ page_location: "https://persisty.app/download" });
  });

  it("a page with its own campaign keeps it over the landing one", () => {
    const win = fakeWindow("https://persisty.app/?utm_source=newsletter");
    rememberLanding(win);
    win.location.href = "https://persisty.app/pricing?utm_source=ad";
    startAnalytics(ID, win);
    pageView(win);
    expect(pageViews(win)[0][2]).toMatchObject({ page_location: "https://persisty.app/pricing?utm_source=ad" });
  });

  it("events carry their params and the clean location, never anything else", () => {
    const win = fakeWindow("https://persisty.app/pricing?plan=pro&next=%2Faccount");
    startAnalytics(ID, win);
    track({ name: "begin_checkout", params: { plan: "pro" } }, win);
    expect(calls(win).at(-1)).toEqual(["event", "begin_checkout", { plan: "pro", page_location: "https://persisty.app/pricing" }]);
  });
});

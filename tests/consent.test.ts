import { describe, expect, it } from "vitest";
import { analyticsCookieNames, consentCookie, expiredCookies, readConsent } from "../src/lib/consent";

describe("readConsent", () => {
  it("reads the saved choice", () => {
    expect(readConsent("a=1; persisty_consent=granted")).toBe("granted");
    expect(readConsent("persisty_consent=denied; b=2")).toBe("denied");
  });

  it("treats a missing or unknown value as no choice", () => {
    expect(readConsent("")).toBeNull();
    expect(readConsent("persisty_consent=maybe")).toBeNull();
    expect(readConsent("xpersisty_consent=granted")).toBeNull();
  });
});

describe("consentCookie", () => {
  it("keeps the choice a year, Secure only on https", () => {
    expect(consentCookie("granted", true)).toBe("persisty_consent=granted; path=/; max-age=31536000; SameSite=Lax; Secure");
    expect(consentCookie("denied", false)).toBe("persisty_consent=denied; path=/; max-age=31536000; SameSite=Lax");
  });
});

describe("Google's cookies", () => {
  it("finds Google's cookies for this property only", () => {
    expect(analyticsCookieNames("_ga=GA1.1.x; _ga_ABC123=GS1; _ga_OTHER=1; lang=en", "G-ABC123")).toEqual(["_ga", "_ga_ABC123"]);
  });

  it("expires on the host and on the parent domain", () => {
    expect(expiredCookies(["_ga"], "www.persisty.app")).toEqual(["_ga=; path=/; max-age=0", "_ga=; path=/; max-age=0; domain=.persisty.app"]);
    expect(expiredCookies(["_ga"], "persisty.app")).toEqual(["_ga=; path=/; max-age=0", "_ga=; path=/; max-age=0; domain=.persisty.app"]);
    expect(expiredCookies(["_ga"], "localhost")).toEqual(["_ga=; path=/; max-age=0"]);
    expect(expiredCookies(["_ga"], "127.0.0.1")).toEqual(["_ga=; path=/; max-age=0"]);
  });
});

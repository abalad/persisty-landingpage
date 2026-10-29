import { describe, expect, it } from "vitest";
import { authErrorKey, intentFromQuery, isValidCode, isValidEmail, mergeIntent, normalizeCode, safeNext } from "../src/lib/auth";

describe("normalizeCode", () => {
  it("accepts a code pasted with a space", () => expect(normalizeCode("1234 5678")).toBe("12345678"));
  it("accepts a code pasted with a hyphen", () => expect(normalizeCode("1234-5678")).toBe("12345678"));
  it("drops anything that is not a digit", () => expect(normalizeCode(" 12a34\n")).toBe("1234"));
});

describe("isValidCode", () => {
  it("takes 6 to 10 digits", () => {
    expect(isValidCode("123456")).toBe(true);
    expect(isValidCode("12345678")).toBe(true);
    expect(isValidCode("12345")).toBe(false);
    expect(isValidCode("12345678901")).toBe(false);
  });
});

describe("isValidEmail", () => {
  it("takes a normal address", () => expect(isValidEmail("ana@empresa.com.br")).toBe(true));
  it("ignores surrounding spaces", () => expect(isValidEmail("  ana@empresa.com ")).toBe(true));
  it("refuses an address without a domain", () => expect(isValidEmail("ana@")).toBe(false));
  it("refuses text without @", () => expect(isValidEmail("ana.empresa.com")).toBe(false));
});

describe("safeNext", () => {
  it("keeps an internal path", () => expect(safeNext("/download")).toBe("/download"));
  it("refuses another site", () => expect(safeNext("https://evil.com")).toBe("/account"));
  it("refuses a protocol-relative address", () => expect(safeNext("//evil.com")).toBe("/account"));
  it("refuses a backslash trick", () => expect(safeNext("/\\evil.com")).toBe("/account"));
  it("falls back to the account without a value", () => expect(safeNext(null)).toBe("/account"));
  it("drops a language prefix the router adds again", () => {
    expect(safeNext("/en/account")).toBe("/account");
    expect(safeNext("/pt-BR/docs/agents")).toBe("/docs/agents");
    expect(safeNext("/es")).toBe("/");
  });
  it("keeps a path that only starts like a language", () => expect(safeNext("/english-notes")).toBe("/english-notes"));
});

describe("authErrorKey", () => {
  it("names the e-mail rate limit", () => expect(authErrorKey({ code: "over_email_send_rate_limit", status: 429 })).toBe("rateLimited"));
  it("names any 429 as a rate limit", () => expect(authErrorKey({ status: 429 })).toBe("rateLimited"));
  it("names an expired or wrong code", () => expect(authErrorKey({ code: "otp_expired", status: 403 })).toBe("expired"));
  it("names an address the server refuses", () => expect(authErrorKey({ code: "email_address_invalid", status: 400 })).toBe("invalidEmail"));
  it("names a network failure", () => expect(authErrorKey({ name: "AuthRetryableFetchError", status: 0 })).toBe("network"));
  it("falls back to unknown", () => expect(authErrorKey({ code: "something_new", status: 500 })).toBe("unknown"));
});

describe("intentFromQuery", () => {
  it("reads a platform to be notified about", () => {
    expect(intentFromQuery(new URLSearchParams("notify=mac"))).toEqual({ notify: "mac" });
  });

  it("reads Enterprise interest", () => {
    expect(intentFromQuery(new URLSearchParams("interest=enterprise"))).toEqual({ interest: "enterprise" });
  });

  it("ignores values it does not know", () => {
    expect(intentFromQuery(new URLSearchParams("notify=amiga&interest=crypto"))).toEqual({});
  });
});

describe("mergeIntent", () => {
  it("turns on release notices and remembers the platform once", () => {
    const first = mergeIntent({}, { notify: "mac" });
    expect(first).toEqual({ notify_release: true, notify_platforms: ["mac"] });
    expect(mergeIntent(first!, { notify: "mac" })).toBeNull();
  });

  it("adds Enterprise interest without touching other metadata", () => {
    expect(mergeIntent({ display_name: "Ana" }, { interest: "enterprise" })).toEqual({ display_name: "Ana", interests: ["enterprise"] });
  });

  it("keeps a generic notice without a platform list entry", () => {
    expect(mergeIntent({}, { notify: "any" })).toEqual({ notify_release: true, notify_platforms: [] });
  });

  it("returns null when there is nothing to change", () => {
    expect(mergeIntent({ interests: ["enterprise"] }, { interest: "enterprise" })).toBeNull();
  });

  it("remembers the language the notice was asked in, for the e-mail", () => {
    const first = mergeIntent({}, { notify: "any" }, "en");
    expect(first).toEqual({ notify_release: true, notify_platforms: [], locale: "en" });
    expect(mergeIntent(first!, { notify: "any" }, "en")).toBeNull();
    expect(mergeIntent(first!, { notify: "any" }, "es")).toEqual({ notify_release: true, notify_platforms: [], locale: "es" });
  });

  it("leaves the language alone for Enterprise interest", () => {
    expect(mergeIntent({}, { interest: "enterprise" }, "en")).toEqual({ interests: ["enterprise"] });
  });
});

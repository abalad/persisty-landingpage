import { describe, expect, it } from "vitest";
import { POST } from "../src/app/api/consent/route";
import { consentCookie } from "../src/lib/consent";

const post = (url: string, body: unknown) => POST(new Request(url, { method: "POST", body: JSON.stringify(body) }));

describe("POST /api/consent", () => {
  // Safari keeps a cookie written by page script for 7 days at most; one set by the server keeps its year.
  it("saves the answer from the server, for a year", async () => {
    const res = await post("https://persisty.app/api/consent", { choice: "granted" });
    expect(res.status).toBe(204);
    expect(res.headers.get("set-cookie")).toBe(consentCookie("granted", true));
  });

  it("is not Secure over plain http (local runs)", async () => {
    const res = await post("http://localhost:3100/api/consent", { choice: "denied" });
    expect(res.headers.get("set-cookie")).toBe(consentCookie("denied", false));
  });

  it("refuses anything but granted or denied, and sets nothing", async () => {
    for (const body of [{ choice: "maybe" }, {}, "x"]) {
      const res = await post("https://persisty.app/api/consent", body);
      expect(res.status).toBe(400);
      expect(res.headers.get("set-cookie")).toBeNull();
    }
  });
});

import { describe, expect, it } from "vitest";
import { triedAnchor, triedFeatureId } from "../src/lib/tried";

describe("arriving from the app", () => {
  it("accepts the five Pro anchors", () => {
    expect(triedAnchor("queue")).toBe("queue");
    expect(triedAnchor("restore-points")).toBe("restore-points");
    expect(triedFeatureId("accounts")).toBe("accountRotation");
    expect(triedFeatureId("worktree")).toBe("worktrees");
  });

  it("ignores anything else", () => {
    for (const v of [null, undefined, "", "QUEUE", " queue", "license", "billing", "growth", "queue,verify", "__proto__", "toString"]) expect(triedAnchor(v), String(v)).toBeNull();
  });
});

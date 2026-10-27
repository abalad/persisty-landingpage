import { describe, expect, it } from "vitest";
import { REACTION_MS, reactionTo } from "@/components/studio/buddyMood";

describe("reactionTo", () => {
  it("celebrates a finished turn and regrets a failure, and stays quiet otherwise", () => {
    expect(reactionTo("working", "done")).toEqual({ kind: "celebrate" });
    expect(reactionTo("busy", "failed")).toEqual({ kind: "oops" });
    expect(reactionTo(null, "done")).toBeNull();
    expect(reactionTo(null, "failed")).toBeNull();
    expect(reactionTo("idle", "working")).toBeNull();
    expect(reactionTo("done", "done")).toBeNull();
  });
});

describe("REACTION_MS", () => {
  it("keeps the mascot up long enough to see a celebration, and a click briefly", () => {
    expect(REACTION_MS.celebrate).toBeGreaterThan(REACTION_MS.poke);
    expect(REACTION_MS.poke).toBeGreaterThan(0);
  });
});

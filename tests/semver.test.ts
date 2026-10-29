import { describe, expect, it } from "vitest";
import { compareVersions, isVersion } from "../src/lib/semver";

describe("isVersion", () => {
  it("takes MAJOR.MINOR.PATCH, with or without a pre-release", () => {
    for (const v of ["0.8.0", "10.2.33", "0.8.0-test.1"]) expect(isVersion(v), v).toBe(true);
  });

  it("refuses anything else", () => {
    for (const v of ["0.8", "v0.8.0", "0.8.0 ", "01.0.0", ""]) expect(isVersion(v), JSON.stringify(v)).toBe(false);
  });
});

describe("compareVersions", () => {
  it("compares numbers as numbers", () => {
    expect(compareVersions("0.10.0", "0.9.0")).toBeGreaterThan(0);
    expect(compareVersions("0.9.0", "0.10.0")).toBeLessThan(0);
    expect(compareVersions("0.8.0", "0.8.0")).toBe(0);
  });

  it("puts a pre-release before its release", () => {
    expect(compareVersions("0.8.0-test.1", "0.8.0")).toBeLessThan(0);
    expect(compareVersions("0.8.0-test.2", "0.8.0-test.10")).toBeLessThan(0);
  });

  it("refuses what is not a version", () => {
    expect(() => compareVersions("0.8", "0.8.0")).toThrow(/0\.8/);
  });
});

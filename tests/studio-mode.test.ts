import { describe, expect, it } from "vitest";
import { wantsLive3d, type StudioEnv } from "@/components/home/studioMode";

/** A mid-range Android phone with nothing asking for less: the scene should run there too. */
const phone: StudioEnv = { reducedMotion: false, saveData: false, deviceMemory: 8, intersectionObserver: true };

describe("wantsLive3d", () => {
  it("runs the live scene on an ordinary phone", () => {
    expect(wantsLive3d(phone)).toBe(true);
  });

  it("runs it where the browser does not say how much memory there is", () => {
    expect(wantsLive3d({ ...phone, deviceMemory: undefined })).toBe(true);
  });

  it("runs it with 4 GB", () => {
    expect(wantsLive3d({ ...phone, deviceMemory: 4 })).toBe(true);
  });

  it("keeps the picture when the system asks for less motion", () => {
    expect(wantsLive3d({ ...phone, reducedMotion: true })).toBe(false);
  });

  it("keeps the picture when the visitor saves data", () => {
    expect(wantsLive3d({ ...phone, saveData: true })).toBe(false);
  });

  it("keeps the picture on a device with under 4 GB", () => {
    expect(wantsLive3d({ ...phone, deviceMemory: 2 })).toBe(false);
  });

  it("keeps the picture without IntersectionObserver, since the scene could not sleep off screen", () => {
    expect(wantsLive3d({ ...phone, intersectionObserver: false })).toBe(false);
  });
});

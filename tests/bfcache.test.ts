import { describe, expect, it, vi } from "vitest";
import { onPageRestored } from "../src/lib/bfcache";

/** A `pageshow` the way the browser sends it: `persisted` is true when the page comes back from the back-forward cache. */
function pageshow(persisted: boolean): Event {
  return Object.assign(new Event("pageshow"), { persisted });
}

describe("onPageRestored", () => {
  it("runs when the page comes back from the back-forward cache", () => {
    const target = new EventTarget();
    const restored = vi.fn();
    onPageRestored(restored, target);
    target.dispatchEvent(pageshow(true));
    expect(restored).toHaveBeenCalledTimes(1);
  });

  it("ignores an ordinary page load", () => {
    const target = new EventTarget();
    const restored = vi.fn();
    onPageRestored(restored, target);
    target.dispatchEvent(pageshow(false));
    expect(restored).not.toHaveBeenCalled();
  });

  it("stops listening once cleaned up", () => {
    const target = new EventTarget();
    const restored = vi.fn();
    onPageRestored(restored, target)();
    target.dispatchEvent(pageshow(true));
    expect(restored).not.toHaveBeenCalled();
  });
});

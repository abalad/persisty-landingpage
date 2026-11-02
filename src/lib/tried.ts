/**
 * When the app blocks a Pro feature it opens `/pro?tried=<anchor>#<anchor>`.
 * These are the anchors it may send; the app depends on them, so they stay put.
 */
export const TRIED = ["accounts", "queue", "restore-points", "verify", "worktree"] as const;
export type Tried = (typeof TRIED)[number];

const FEATURE: Record<Tried, string> = {
  accounts: "accountRotation",
  queue: "requestQueue",
  "restore-points": "restorePoints",
  verify: "verifyOnFinish",
  worktree: "worktrees",
};

/** The anchor named by `?tried=`, or null for anything that is not exactly one of them. */
export function triedAnchor(value: string | null | undefined): Tried | null {
  return (TRIED as readonly string[]).includes(value ?? "") ? (value as Tried) : null;
}

/** The catalog id of the feature behind an anchor, for its name in `pricing.features`. */
export function triedFeatureId(anchor: Tried): string {
  return FEATURE[anchor];
}

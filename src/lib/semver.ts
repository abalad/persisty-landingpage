/** Same rule as the app's `scripts/release/version.mjs`: the two must agree on what a version is and how they sort. */
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

/** `MAJOR.MINOR.PATCH`, optionally with a pre-release (`0.8.0-test.1`). */
export function isVersion(v: unknown): v is string {
  return typeof v === "string" && SEMVER.test(v);
}

/** SemVer order: numbers compared as numbers, a pre-release before its release. */
export function compareVersions(a: string, b: string): number {
  const [, ...x] = SEMVER.exec(a) ?? [];
  const [, ...y] = SEMVER.exec(b) ?? [];
  if (!x.length || !y.length) throw new Error(`not a version: ${!x.length ? a : b}`);
  for (let i = 0; i < 3; i++) {
    const d = Number(x[i]) - Number(y[i]);
    if (d) return Math.sign(d);
  }
  if (x[3] === y[3]) return 0;
  if (!x[3]) return 1;
  if (!y[3]) return -1;
  const p = x[3].split(".");
  const q = y[3].split(".");
  for (let i = 0; i < Math.max(p.length, q.length); i++) {
    if (p[i] === undefined) return -1;
    if (q[i] === undefined) return 1;
    const numeric = /^\d+$/.test(p[i]) && /^\d+$/.test(q[i]);
    const d = numeric ? Number(p[i]) - Number(q[i]) : p[i].localeCompare(q[i]);
    if (d) return Math.sign(d);
  }
  return 0;
}

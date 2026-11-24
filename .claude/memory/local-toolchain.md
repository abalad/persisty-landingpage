---
name: local-toolchain
description: On this machine pnpm fails (pinned 12.3.4 missing); run vitest/tsc/eslint/next from node_modules/.bin with nvm node v24; vercel CLI lives under node v20
metadata:
  node_type: memory
  type: reference
  originSessionId: 4af6f56e-8ec9-47a5-a056-c06e4f570174
  modified: 2026-11-24T11:39:44.284Z
---

- `node` is not on the default PATH; use `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"`.
- `pnpm` errors ("Failed to switch pnpm to v12.3.4"): run `node_modules/.bin/vitest run`, `node_modules/.bin/tsc --noEmit`, `node_modules/.bin/eslint`, `node_modules/.bin/next build` instead.
- Installing packages still needs pnpm 12.3.4. Its shim is a shebang-less `sh` script, so the global pnpm 10.34.4 gets ENOEXEC when it spawns it. Run pnpm 12.3.4 directly instead: `npm_config_manage_package_manager_versions=false node ~/Library/pnpm/.tools/pnpm/12.3.4/node_modules/pnpm/bin/pnpm.mjs add -E <pkg>@<ver>`. This worked for the Next.js 16.4.6 upgrade (2026-11-24, main 1df30d9). Don't repair the global install without asking.
- Since 2026-11-24 the site runs Next.js 16.4.6 with `experimental.agentUpgrade: "security"`. When a new advisory comes out, `next dev` or `next build` stops once with an upgrade notice; run the same command again to continue. Tell the user and ask before running `next upgrade --agent`. The upgrade's last step runs `pnpm dlx next@canary internal report-agent-upgrade`, which reports to Vercel; it was not run, because the user didn't ask for it.
- The scratchpad under /private/tmp gets cleaned from time to time, and helper scripts kept there disappear. Anything worth reusing belongs in the repo (for example `scripts/docs-media/`).
- After adding or removing a route, run `node_modules/.bin/next typegen` before `tsc`, or `.next/types` keeps stale routes.
- `vercel` CLI: `~/.nvm/versions/node/v20.18.1/bin/vercel`. `gh`: `/opt/homebrew/bin/gh`.
- Headless screenshots: `scripts/shots/pages.mjs`, `menu.mjs`, `compare.mjs` (local Chrome, via `scripts/e2e/lib.mjs`). Kill old servers with `lsof -ti tcp:<port> | xargs kill` before `next start`, or the old server serves stale CSS.

Related: [[publishing-the-site]]

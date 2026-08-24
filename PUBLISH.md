# Publishing to the VS Code Marketplace

Status: **not published yet**. Blocked on a Marketplace publisher token for
the `ventrova` publisher (Azure DevOps Personal Access Token). Everything
else - manifest, icon, README, categories/keywords, packaging - is ready.
Once the token exists, publishing is a single command.

## One-time setup (do this once a token exists)

1. Create the publisher if it doesn't exist yet:
   ```
   npx @vscode/vsce create-publisher ventrova
   ```
   (Skip this if `ventrova` already exists on
   https://marketplace.visualstudio.com/manage - it may have been created
   manually via the Azure DevOps org.)

2. Log in with the PAT (scope: Marketplace > Manage):
   ```
   npx @vscode/vsce login ventrova
   ```
   This prompts for the PAT and stores it locally (not committed anywhere).

## Publish

From this directory, with a valid publisher login:

```
npx @vscode/vsce publish
```

That's it. `vsce publish` reads `package.json`, bumps nothing by default,
packages, and uploads in one step. It reuses the same packaging path already
verified locally (`vsce package`), including the vendored-engine secret-scan
allowlist below.

To cut a new version at the same time:

```
npx @vscode/vsce publish patch   # or minor / major
```

## Known packaging quirk

`vsce package` / `vsce publish` flags `vendor/sentinel-scan.js` for a
"GitHub Token" secret. This is a false positive: it's a synthetic example
token (`ghp_1A2b...`) inside a demo/fixture manifest baked into the vendored
CLI engine for its own self-test output, not a real credential. If publish
fails on this check, pass:

```
npx @vscode/vsce publish --allow-package-secrets github
```

Verified locally on 2026-08-24: `vsce package --allow-package-secrets github`
produces a clean 9-file, ~30 KB VSIX with no other warnings.

## Pre-publish checklist

- [ ] `node --test test/*.test.js` passes (3/3 as of 2026-08-24)
- [ ] `vendor/sentinel-scan.js` is in sync with the CLI repo (see
      `vendor/SYNC.md` for the pinned commit)
- [ ] `package.json` version bumped if shipping a real change
- [ ] `vsce package --allow-package-secrets github` produces a clean VSIX
- [ ] Marketplace publisher token is valid (`vsce login ventrova` succeeds)

## After first publish

- Marketplace listing URL will be:
  `https://marketplace.visualstudio.com/items?itemName=ventrova.sentinel-scan-mcp`
- Update the README badges (already wired to
  `ventrova.sentinel-scan-mcp`) - no edits needed, they'll resolve once the
  listing is live.
- Cross-link from `ventrova.dev` (CLI README, `/audit`, `/teardown`) once the
  listing URL is confirmed live.

## Publishing

Pannonico publishes to GitHub Packages through the `@vsjov` npm scope. The package metadata points to:

```text
git@github.com:vsjov/pannonico.git
```

Before publishing manually:

```bash
npm run build-all
```

Create a local npm config from the example and verify the read-only token:

```bash
cp .npmrc.example .npmrc
export NODE_AUTH_TOKEN="github_pat_..."
npm run whoami:private
```

Installs use the `NODE_AUTH_TOKEN` already exported in your shell. Publishing reads the write token from `github-packages-pannonico-write` by default. Override it with `BW_NPM_WRITE_TOKEN_ITEM` when needed.

The publish helper overrides `NODE_AUTH_TOKEN` only for the `npm publish --ignore-scripts` child process. The parent shell keeps the original read-only token after publishing.

Publish when the package is ready:

```bash
npm run publish:private
```

The helper requests the write token from Bitwarden automatically. There is no separate token test or manual token export step.

The publish and release implementations live in the private npm workspaces under `tools/publish-private` and `tools/release-private`. Root npm scripts execute their compiled `dist/cli.js` files. These distribution files are committed so the release commands remain directly runnable after checkout; edit `src`, then regenerate both distributions with `npm run build:tools`.

The package uses `publishConfig.registry` to publish to `https://npm.pkg.github.com`.

To run the release workflow after preparing and tagging a `release/<package.version>` branch:

```bash
npm run release:private
```

Before running the release script, push tag `v<package.version>` from the release branch and wait for the tag workflow in GitHub Actions to pass. The script verifies the local tag and the tag on `origin` both point at `HEAD`, but it does not check the GitHub Actions result.

The release script checks that it is running on the exact `release/<package.version>` branch, requires a clean working tree, creates `.npmrc` from `.npmrc.example` when needed, requires `NODE_AUTH_TOKEN` for install and read auth, runs `npm ci`, runs `npm run build-all`, stops if either pre-publish command changes tracked files, verifies GitHub Packages auth with the read token, and publishes with the Bitwarden write token.

The release script requests the write token from Bitwarden only when it reaches `npm publish`. The read-only `NODE_AUTH_TOKEN` may remain exported for normal package installation.

After publishing, the script bumps the package to the next development version, commits `package.json` and `npm-shrinkwrap.json`, pushes the release branch, and opens a pull request from the release branch into `master`. Versions ending in `.0` bump to the next minor version by default. Patch releases bump to the next patch version by default.

For a backport patch release from an older tag, run the script with `--skip-pr`. After publishing, bring the fix forward to `master` separately if `master` does not already contain it, and avoid merging an older patch-line version bump into `master`.

Useful options:

```bash
npm run release:private -- --skip-install
npm run release:private -- --allow-dirty
npm run release:private -- --skip-branch-check
npm run release:private -- --next-bump minor
npm run release:private -- --next-bump patch
npm run release:private -- --skip-pr
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./12-testing.md
[Next >]: ./14-troubleshooting.md
[TOC]: ./readme.md

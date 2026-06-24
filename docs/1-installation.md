## Installation

Pannonico is published as a private GitHub Packages npm package:

```bash
npm install @vsjov/pannonico
```

Install it globally when you want to use the `pannonico` CLI on folders that follow the conventional project structure:

```bash
npm install -g @vsjov/pannonico
```

Global CLI installation is additive. The same package can still be installed locally and imported from a `gulpfile.js` or another build script.

Consumers need npm configured for the `@vsjov` scope:

```ini
@vsjov:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` must be a GitHub token with package read access.

For local development, export the read token in your shell instead of writing a token into repository files.

```bash
npm install --ignore-scripts
```

---

## Bitwarden Setup

Pannonico includes `@bitwarden/cli` and a small publish helper. The helper reads the GitHub Packages write token from one Bitwarden item, uses it only for `npm publish --ignore-scripts`, and exits without storing the token in the repository.

The helper does not replace the read-only `NODE_AUTH_TOKEN` in the parent shell. It overrides that variable only for the publish child, so the read token remains available after publishing.

### 1. Create GitHub Tokens

Create separate GitHub personal access tokens for read and write access. Use **classic** personal access tokens for this local npm workflow; GitHub Packages npm authentication does not currently use fine-grained token package permissions.

- Read token: `read:packages` to install Pannonico from GitHub Packages.
- Write token: `write:packages` to publish Pannonico.

Use the read token for installs and reserve the write token for releases.

### 2. Export the Read Token

Export the read token in the shell that runs installs:

```bash
export NODE_AUTH_TOKEN="github_pat_..."
```

### 3. Save the Write Token in Bitwarden

Create a Bitwarden login item:

- Name: `github-packages-pannonico-write`
- Username: your GitHub username
- Password: the write token
- URL: `https://npm.pkg.github.com`

The helper reads the item password by default. The URL and username make the Bitwarden entry easier to recognize, but the helper only depends on the exact item name and the password field.

### 4. Configure npm and Bitwarden

Create a local `.npmrc` from the example. The local file is ignored by Git so the auth token reference stays out of commits.

```bash
cp .npmrc.example .npmrc
```

The file uses `NODE_AUTH_TOKEN`:

```ini
@vsjov:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Log in to the Bitwarden CLI once if needed:

```bash
bw login
```

The publish helper requests the stored write token directly from Bitwarden when it is needed.

### 5. Run Authenticated npm Commands

Install private dependencies without npm lifecycle scripts:

```bash
npm install --ignore-scripts
```

Install from the shrinkwrap without npm lifecycle scripts:

```bash
npm ci --ignore-scripts
```

Check GitHub Packages auth with the read token:

```bash
npm run whoami:private
```

Normal installs and authentication checks use the read-only `NODE_AUTH_TOKEN`; Bitwarden is not involved.

When a package is ready to publish, run the publish command:

```bash
npm run publish:private
```

The helper runs `npm run build-all` before retrieving the write token. It then reads the configured Bitwarden item and passes its password only to the `npm publish --ignore-scripts` child process.

Use a different Bitwarden write-token item name when needed:

```bash
BW_NPM_WRITE_TOKEN_ITEM=my-write-token npm run publish:private
```

The helper fails before npm publish starts if Bitwarden cannot read the item or the item password is empty.

The read-only `NODE_AUTH_TOKEN` may remain in the shell for private package installation. The publish helper is invoked through npm, so the locally installed Bitwarden CLI is available through npm's command path.

---
Jump to: [Next >] | [TOC]

[Next >]: ./2-quick-start.md
[TOC]: ./readme.md

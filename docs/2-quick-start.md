## Quick Start

### CLI Path

Create a conventional Pannonico site:

```bash
pannonico scaffold ./my-site
```

Copy the package documentation into the generated `docs/` folder:

```bash
pannonico docs ./my-site
```

If `./my-site/docs` already exists, Pannonico asks for confirmation before
deleting it and copying a fresh documentation set. Declining the prompt leaves
the existing directory unchanged.

Build or watch the site:

```bash
pannonico build ./my-site
pannonico watch ./my-site
```

Common build flags:

```bash
pannonico build ./my-site --compress
pannonico build ./my-site --beautify
pannonico build ./my-site --out-dir public
pannonico build ./my-site --no-autoprefixer
```

No config file is required when your site uses the default folders: `pages`, `layouts`, `partials`, `helpers`, `data`, and generated `dist`.

### Programmatic Path

Install Pannonico locally when you want to import the package API from a project build script:

```bash
npm install @vsjov/pannonico
```

### 1. Create Project Structure

```
my-site/
├── pages/           # HTML/Markdown pages with frontmatter
│   ├── index.html
│   ├── about.md     # Markdown files supported!
│   └── contact.html
├── layouts/         # Page layouts
│   └── default.html
├── partials/        # Reusable components
│   ├── header.html
│   └── footer.html
├── helpers/         # Custom Handlebars helpers (optional)
│   └── myHelper.js
├── data/           # Site data (YAML/JSON)
│   └── site.json
└── gulpfile.js     # Build configuration for the programmatic path
```

### 2. Create a Simple Page

**`pages/index.html`**
```html
---
title: Home
---
<h1>{{title}}</h1>
<p>Welcome to my site!</p>
```

The `default` layout is applied automatically. Use `layout: name` in frontmatter to choose a different one.

**`layouts/default.html`**
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  <!-- Optional: Include CSS and JavaScript -->
  <link rel="stylesheet" href="/assets/styles/index.scss">
  <script type="module" src="/assets/js/index.ts"></script>
</head>
<body>
  {{> @partial-block}}
</body>
</html>
```

**`data/site.json`**
```json
{
  "name": "My Site",
  "description": "A static site built with Handlebars"
}
```

> **Important:** Each data file must have a unique stem name across all extensions. Having both `menu.json` and `menu.yaml` in the same directory is an error:
>
> ```
> Error: Data file conflict: 'menu' is defined by both 'menu.json' and 'menu.yaml'. Rename one of these files.
> ```

### 3. Create Build Script

**`gulpfile.js`**
```javascript
import { createViteBuildTask } from '@vsjov/pannonico'

export const build = createViteBuildTask({
  root: '.',
  pages: 'pages',
  partials: 'partials',
  helpers: 'helpers',
  data: 'data',
  layouts: 'layouts',
  outDir: 'dist'
})

export default build
```

### 4. Build Your Site

```bash
npx gulp
```

Your site will be built to the `dist/` directory!

When working on Pannonico itself:

```bash
# Compile the package library output used by workspace consumers
npm run build

# Build the local build-test fixture site used by this package
npm run build-site
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./1-installation.md
[Next >]: ./3-project-structure.md
[TOC]: ./readme.md

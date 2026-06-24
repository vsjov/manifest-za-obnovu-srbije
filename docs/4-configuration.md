## Configuration

### Configuration Options

```typescript
{
  root?: string,        // Root directory (default: '.')
  pages?: string,       // Pages directory (default: 'pages')
  partials?: string,    // Partials directory (default: 'partials')
  helpers?: string,     // Helpers directory (default: 'helpers')
  data?: string,        // Data directory (default: 'data')
  layouts?: string,     // Layouts directory (default: 'layouts')
  outDir?: string,      // Output directory (default: 'dist')
  htmlMode?: 'beautify' | 'compress',  // HTML output mode (default: 'beautify')
  autoprefixer?: false | AutoprefixerOptions, // CSS prefixing options
  vitePlugins?: {
    pre?: Plugin[],
    post?: Plugin[]
  }
}
```

### Autoprefixer

Pannonico runs Autoprefixer by default during Vite CSS processing.

Default browser targets:

```typescript
{
  overrideBrowserslist: [
    'last 2 versions',
    '> 2%',
    'not dead'
  ]
}
```

Override or extend the default options through `autoprefixer`:

```javascript
import { createViteBuildTask } from '@vsjov/pannonico'

export const build = createViteBuildTask({
  root: './src',
  autoprefixer: {
    grid: 'autoplace'
  }
})
```

Set `overrideBrowserslist` when a site needs different browser targets:

```javascript
export const build = createViteBuildTask({
  root: './src',
  autoprefixer: {
    overrideBrowserslist: [
      'last 1 Chrome version',
      'last 1 Firefox version'
    ]
  }
})
```

Disable the built-in Autoprefixer step with `autoprefixer: false`.

### Vite Plugin Injection

Use `vitePlugins` to extend frontend asset compilation without changing the builder's ownership of final static HTML.

This is the intended integration point for Vue single-file-component support.

```javascript
import vue from '@vitejs/plugin-vue'
import { createViteBuildTask } from '@vsjov/pannonico'

export const build = createViteBuildTask({
  root: './src',
  vitePlugins: {
    pre: [vue()]
  }
})
```

- `pre` runs before the builder's built-in plugins
- `post` runs after the builder's built-in plugins
- Handlebars and markdown still produce the final page HTML
- injected plugins only affect the Vite asset pipeline

For Vue SFC usage in a consuming site, install `vue` and `@vitejs/plugin-vue`, inject `vue()` through `vitePlugins.pre`, and keep mounting Vue onto static HTML placeholders rendered by the builder.

The package-owned reference implementation lives in the local fixture site under:

- `build-test/pages/assets/js/index.ts`
- `build-test/pages/assets/js/components/manifest-principles.vue`
- `build-test/pages/index.html`

**Smoke-test path for Vue plugin injection:**

```bash
# Build the package fixture site, including the Vue SFC demo
npm run build-site

# Dev server should boot with Vue HMR support in the asset pipeline
npx gulp dev

# Watch mode should rebuild the static site while still compiling .vue assets
npx gulp watch
```

From the package root, `gulp dev` and `gulp watch` use the `build-test` fixture content, so the Vue demo stays inside package-owned example material rather than user-editable site content.

### HTML Output Modes

Control how your HTML files are formatted in the output:

#### Beautify Mode (Default)

Produces clean, readable HTML with proper indentation:

```javascript
export const build = createViteBuildTask({
  root: './src',
  htmlMode: 'beautify'  // or omit - this is the default
})
```

**Output example:**
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My Page</title>
  </head>
  <body>
    <h1>Welcome</h1>
    <p>Hello World</p>
  </body>
</html>
```

**Best for:**
- Development builds
- Human-readable output
- Debugging
- Source code review

#### Compress Mode

Produces minified HTML for production, including **inline JavaScript and CSS**:

```javascript
export const build = createViteBuildTask({
  root: './src',
  htmlMode: 'compress'
})
```

**Output example:**
```html
<!doctype html><html><head><meta charset="utf-8"><title>My Page</title></head><body><h1>Welcome</h1><p>Hello World</p></body></html>
```

**Inline Script/Style Example:**

Before (beautify):
```html
<style>
  body {
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
  }
</style>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('btn');
    button.addEventListener('click', function() {
      alert('Clicked!');
    });
  });
</script>
```

After (compress):
```html
<style>body{background-color:#f0f0f0;margin:0;padding:20px}</style>
<script>document.addEventListener("DOMContentLoaded",function(){const t=document.getElementById("btn");t.addEventListener("click",function(){alert("Clicked!")})})</script>
```

**Benefits:**
- Smaller file sizes (~15-25% reduction)
- Faster page loads
- Reduced bandwidth usage
- Removes comments and redundant attributes
- **Minifies inline CSS** (removes whitespace, optimizes selectors)
- **Minifies inline JavaScript** (renames variables, removes whitespace, optimizes code)
- Minifies CSS and JS in style/script tags

**Best for:**
- Production builds
- Performance optimization
- Bandwidth-constrained environments

### Using Frontmatter

Pages can include YAML frontmatter for metadata and layout selection:

```html
---
title: About Us
description: Learn more about our company
layout: default
---
<h1>{{title}}</h1>
<p>{{description}}</p>
```

Markdown pages can also opt into headline section wrapping:

```markdown
---
title: Article
layout: default
headlineSections: true
---

# Overview

Intro content.

## Details

Supporting content.
```

#### Layout Selection

The `layout` field selects which file from the `layouts/` directory wraps the page. When omitted, `default` is used.

```html
---
title: Minimal Page
layout: minimal
---
<p>This page uses layouts/minimal.html as its wrapper.</p>
```

If you have multiple layouts (e.g. `default.html`, `minimal.html`, `fullwidth.html`), each page can declare which one to use independently.

> **Note:** HTML files that already contain a `{{#> layoutName }}...{{/layoutName}}` block are left untouched — the frontmatter `layout` field is ignored for those files to prevent double-wrapping.

**Note:** Two variables are automatically set for every page:

- `page` — the basename without extension (e.g. `'about'` for `about.html`). Used by `{{#ifpage}}` / `{{#unlesspage}}`.
- `pagePath` — the path relative to the pages directory without extension (e.g. `'blog/post-1'` for `blog/post-1.html`). Use this for targeting specific nested pages without ambiguity.

### Languages And Translations

Language metadata and translation links are optional.

If you use them, define supported languages in `data/languages.json`:

```json
[
  {
    "name": "English",
    "code": "en",
    "icon": "great-britain",
    "pluralRule": "en"
  },
  {
    "name": "Srpski",
    "title": "sr",
    "code": "sr-Latn"
  }
]
```

Language fields:

- `name` - required human-readable language name
- `title` - optional compact label used by `{{translation}}`; falls back to `name`
- `code` - required BCP 47 code used by page frontmatter `lang`, translation keys, and HTML language metadata
- `icon` - optional biticons icon name or absolute icon path ending in `.png`, `.jpg`, `.jpeg`, `.gif`, or `.svg`
- `pluralRule` - optional locale override passed to `Intl.PluralRules`; when omitted, the builder uses `code`

Plural-rule locale validation:

- `code` and `pluralRule` use BCP 47 language tags
- the builder canonicalizes `code` and any `pluralRule` override with `Intl.getCanonicalLocales()`
- when `pluralRule` is omitted, plural selection follows the canonical `code`, including script and region subtags
- the canonical locale must be supported by `Intl.PluralRules.supportedLocalesOf()`
- the canonical requested locale is exposed as `language.pluralRulesLocale`; it is not shortened to the runtime's negotiated locale
- plural categories reported by `Intl.PluralRules` are exposed as `language.pluralCategories`

To check valid locale identifiers, see the MDN BCP 47 language tag guide:

- https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag

Then define page language and reciprocal translation targets in frontmatter:

```yaml
---
title: Manifest za novu Srbiju
lang: sr-Latn
translation:
  - en: index-en.md
---
```

```yaml
---
title: The Manifesto for a New Serbia
lang: en
translation:
  - sr-Latn: index.md
---
```

Add `{{ translation }}` where you want the translation list rendered:

```markdown
{{ translation }}
```

Example output:

```html
<ol class="translation">
  <li><a href="/index.html" data-lang="sr-Latn">sr</a></li>
</ol>
```

Translation rules:

- translation file paths are resolved relative to the current page file
- language codes are matched exactly, including BCP 47 script and region subtags
- translation targets must exist as site pages
- target pages must declare the matching `lang`
- target pages must link back reciprocally
- invalid translation entries are warned about and skipped
- if `lang` or `translation` is not used, no translation validation runs for that page

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./3-project-structure.md
[Next >]: ./5-assets.md
[TOC]: ./readme.md

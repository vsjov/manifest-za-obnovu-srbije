## Project Structure

### Directory Purposes

| Directory | Purpose | File Types |
|-----------|---------|------------|
| **pages/** | HTML or Markdown pages with optional frontmatter | `.html`, `.md` |
| **layouts/** | Page templates (registered as partials) | `.html` |
| **partials/** | Reusable HTML components | `.html` |
| **helpers/** | Custom Handlebars helpers | `.js`, `.ts` |
| **data/** | Site-wide data | `.json`, `.yaml`, `.yml` — filenames must be unique across extensions |
| **assets/** | JavaScript, TypeScript, CSS, SCSS | `.js`, `.ts`, `.css`, `.scss` |

### Example Structure

```
my-site/
├── pages/
│   ├── index.html
│   ├── about.md         # Pure markdown files
│   ├── contact.html
│   └── assets/
│       ├── js/
│       │   └── index.ts
│       └── styles/
│           └── index.scss
├── layouts/
│   └── default.html
├── partials/
│   ├── header.html
│   └── footer.html
├── helpers/
│   └── customHelper.js
├── data/
│   ├── site.json
│   └── menu.yaml
└── gulpfile.js
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./2-quick-start.md
[Next >]: ./4-configuration.md
[TOC]: ./readme.md

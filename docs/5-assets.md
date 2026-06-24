## Asset Bundling

The static site builder automatically bundles JavaScript, TypeScript, CSS, and SCSS files referenced in your HTML pages.

### Including Assets in Pages

Reference assets from your HTML pages or layouts, and they'll be automatically bundled:

**`layouts/default.html`**
```html
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
  <!-- Reference SCSS - will be compiled to CSS -->
  <link rel="stylesheet" href="/assets/styles/index.scss">
  <!-- Reference TypeScript - will be compiled to JavaScript -->
  <script type="module" src="/assets/js/index.ts"></script>
</head>
<body>
  {{> @partial-block}}
</body>
</html>
```

### Asset Processing

**JavaScript/TypeScript:**
- Compiled to modern ES modules
- Code splitting for optimal loading
- Vendor dependencies separated into chunks
- Source maps in development mode

**CSS/SCSS:**
- SCSS compiled to CSS
- CSS imports and Sass dependencies resolved through Vite
- Autoprefixer applied by default with `last 2 versions`, `> 2%`, and `not dead` browser targets
- Minified in production

### Output Structure

```
dist/
├── index.html
├── about.html
├── contact.html
└── assets/
    ├── styles/
    │   └── index.css          # Compiled from index.scss
    └── js/
        └── chunks/
            ├── index-[hash].js      # Your application code
            └── vendor-[hash].js     # node_modules dependencies
```

### TypeScript Example

**`pages/assets/js/index.ts`**
```typescript
// Import local modules
import { init } from './utils/init.js'

// Run initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
```

### SCSS Example

**`pages/assets/styles/index.scss`**
```scss
// Variables
$primary-color: #e74c3c;
$font-family: -apple-system, sans-serif;

// Mixins
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Styles
body {
  font-family: $font-family;
  color: #333;
}

.container {
  @include flex-center;
  background-color: $primary-color;
}
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./4-configuration.md
[Next >]: ./6-helpers.md
[TOC]: ./readme.md

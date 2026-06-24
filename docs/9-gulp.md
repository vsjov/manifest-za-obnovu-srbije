## Using with Gulp

### Basic Gulp Tasks

**`gulpfile.js`**
```javascript
import {
  createViteBuildTask,
  createViteDevTask,
  createViteWatchTask
} from '@vsjov/pannonico'

const options = {
  root: './src',
  pages: 'pages',
  partials: 'partials',
  helpers: 'helpers',
  data: 'data',
  layouts: 'layouts',
  outDir: 'dist'
}

// Production build with beautified HTML
export const build = createViteBuildTask(options)

// Production build with compressed HTML
export const buildCompress = createViteBuildTask({
  ...options,
  htmlMode: 'compress'
})

// Development server (Vite HMR)
export const dev = createViteDevTask(options)

// Watch mode with live reload (recommended for templates)
export const watch = createViteWatchTask(options)

// Default task
export default build
```

### Task Descriptions

- **`build`** - Production build with beautified HTML and optimized assets
- **`buildCompress`** - Production build with compressed/minified HTML
- **`dev`** - Vite dev server with Hot Module Replacement (HMR) on `port` (default: 5173)
  - Template changes require manual refresh
  - When `vitePlugins.pre` includes `@vitejs/plugin-vue`, `.vue` assets compile through the normal Vite dev pipeline
  - The local `build-test` fixture includes a working Vue SFC example for this path
- **`watch`** - Watches all files and rebuilds on changes
  - Serves built files on `port` (default: 5273 for watch mode)
  - Includes BrowserSync for live reload on `browsersyncPort` (default: 5273)
  - Best for Handlebars template development
  - Can run simultaneously with dev server for testing different scenarios
  - Vue SFC assets are watched and compiled during each rebuild when the fixture or consuming site injects `@vitejs/plugin-vue`

### Running Tasks

```bash
# Compile the Pannonico package library
npm run build

# Build the local build-test fixture site, including the Vue SFC demo
npm run build-site

# Development build (beautified HTML)
npx gulp build

# Production build (compressed HTML)
npx gulp buildCompress

# Development server
npx gulp dev

# Watch mode with live reload
npx gulp watch
```

### Vue Example In `build-test`

The package's Vue SFC example is intentionally kept in `build-test`, not in the workspace `site`, so user-editable content stays free of package demo code.

Minimal example files:

```text
build-test/
  pages/index.html
  pages/assets/js/index.ts
  pages/assets/js/components/manifest-principles.vue
  pages/assets/js/vue.d.ts
```

The fixture page provides a static mount point:

```html
<div data-vue="manifest-principles"></div>
```

The fixture asset entry mounts the Vue component in the browser:

```typescript
import { createApp } from 'vue'
import ManifestPrinciples from './components/manifest-principles.vue'

const mountVueDemo = () => {
  const root = document.querySelector<HTMLElement>('[data-vue="manifest-principles"]')

  if (root) {
    createApp(ManifestPrinciples).mount(root)
  }
}
```

This demonstrates the intended architecture boundary:

- static HTML shell from Handlebars/markdown
- Vue compiled through injected Vite plugins
- Vue mounted only as a browser-side enhancement

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./8-custom-helpers.md
[Next >]: ./10-api.md
[TOC]: ./readme.md

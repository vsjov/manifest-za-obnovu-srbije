## API Reference

### `createViteBuildTask(options)`

Creates a Gulp task for production builds.

**Parameters:**
- `options` - Configuration object
  - `root?: string` - Root directory (default: '.')
  - `pages?: string` - Pages directory (default: 'pages')
  - `partials?: string` - Partials directory (default: 'partials')
  - `helpers?: string` - Helpers directory (default: 'helpers')
  - `data?: string` - Data directory (default: 'data')
  - `layouts?: string` - Layouts directory (default: 'layouts')
  - `outDir?: string` - Output directory (default: 'dist')
  - `htmlMode?: 'beautify' | 'compress'` - HTML output mode (default: 'beautify')

**Returns:** Gulp task function

**Example:**
```javascript
// Development build with beautified HTML
export const build = createViteBuildTask({
  root: './src',
  outDir: 'dist',
  htmlMode: 'beautify'
})

// Production build with compressed HTML
export const buildCompress = createViteBuildTask({
  root: './src',
  outDir: 'dist',
  htmlMode: 'compress'
})
```

### `createViteDevTask(options)`

Creates a Gulp task for development server with HMR.

**Parameters:**
- `options` - Configuration object

**Returns:** Gulp task function

**Example:**
```javascript
export const dev = createViteDevTask({
  root: './src',
  port: 5173
})
```

### `createViteWatchTask(options)`

Creates a Gulp task for watch mode with live reload.

**Parameters:**
- `options` - Configuration object
  - `port?: number` - BrowserSync HTTP port for `watch` (default: 5273)
  - `browsersyncPort?: number` - BrowserSync live reload socket port (default: 5273)

**Returns:** Gulp task function

**Example:**
```javascript
export const watch = createViteWatchTask({
  root: './src',
  port: 5273,
  browsersyncPort: 5273
})
```

### `registerStaticSiteTasks(buildPaths)`

Registers static site build and serve tasks for external build pipelines.

**Parameters:**
- `buildPaths` - Configuration object

**Returns:** Object with `buildStaticSite` and `serveStaticSite` functions

**Example:**
```javascript
import { registerStaticSiteTasks } from '@vsjov/pannonico'

const { buildStaticSite, serveStaticSite } = registerStaticSiteTasks({
  root: './src',
  pages: 'pages',
  outDir: 'dist'
})
```

### `createSsbViteConfig(options)`

Creates a Vite configuration object (low-level API).

**Parameters:**
- `options` - Configuration object (same as `createViteBuildTask`)
  - `htmlMode?: 'beautify' | 'compress'` - HTML output mode
  - `port?: number` - Vite dev server port in `createSsbViteConfig` and `dev`, or BrowserSync HTTP port in `watch`
  - `strict?: boolean` - Throw instead of warn when build validation fails
  - `vitePlugins?: { pre?: Plugin[], post?: Plugin[] }` - Site-specific Vite plugin injection points

**Returns:** Promise<ViteConfig>

**Example:**
```javascript
const config = await createSsbViteConfig({
  root: './src',
  htmlMode: 'compress'
})
```

---

## Exported Types

### `HtmlOutputMode`

Type definition for HTML output modes:

```typescript
type HtmlOutputMode = 'beautify' | 'compress'
```

### `ConfigOptions`

Configuration options interface:

```typescript
interface ConfigOptions {
  root?: string
  pages?: string
  partials?: string
  helpers?: string
  data?: string
  layouts?: string
  outDir?: string
  htmlMode?: HtmlOutputMode
  port?: number
  browsersyncPort?: number
  emptyOutDir?: boolean
  strict?: boolean
  suppressWarnings?: boolean
  autoprefixer?: false | AutoprefixerOptions
  vitePlugins?: {
    pre?: Plugin[]
    post?: Plugin[]
  }
  pageFilter?: (key: string, filePath: string) => boolean
}
```

`autoprefixer` configures the built-in CSS prefixing step. Omit it to use Pannonico's default browser targets: `last 2 versions`, `> 2%`, and `not dead`. Set it to `false` to disable built-in Autoprefixer.

`pageFilter` only limits which collected pages are passed to the current Vite build. It does not currently wire selective filesystem watching by itself.

### `HtmlBeautifyPluginOptions`

Options for the HTML beautify plugin:

```typescript
interface HtmlBeautifyPluginOptions extends HTMLBeautifyOptions {
  enabled?: boolean
  mode?: HtmlOutputMode
  minifyOptions?: MinifierOptions
}
```

### Configuration Constants

The package exports configuration constants for default values and port numbers:

#### `DEFAULT_CONFIG`

Default configuration options that can be imported and extended:

```typescript
import { DEFAULT_CONFIG } from '@vsjov/pannonico'

// Use defaults
const config = await createSsbViteConfig(DEFAULT_CONFIG)

// Override specific values
const customConfig = await createSsbViteConfig({
  ...DEFAULT_CONFIG,
  root: './src',
  outDir: 'build',
  htmlMode: 'compress'
})
```

Default values:
```typescript
{
  root: '.',
  pages: 'pages',
  partials: 'partials',
  helpers: 'helpers',
  data: 'data',
  layouts: 'layouts',
  outDir: 'dist',
  htmlMode: 'beautify',
  port: 5173,
  browsersyncPort: 5273,
  emptyOutDir: true,
  strict: false,
  suppressWarnings: false,
  autoprefixer: {
    overrideBrowserslist: [
      'last 2 versions',
      '> 2%',
      'not dead'
    ]
  }
}
```

#### `DEFAULT_AUTOPREFIXER_OPTIONS`

Default Autoprefixer options:

```typescript
import { DEFAULT_AUTOPREFIXER_OPTIONS } from '@vsjov/pannonico'

console.log(DEFAULT_AUTOPREFIXER_OPTIONS.overrideBrowserslist)
// ['last 2 versions', '> 2%', 'not dead']
```

#### `PORTS`

Port configuration for development servers:

```typescript
import { PORTS } from '@vsjov/pannonico'

console.log(PORTS.VITE_DEV)      // 5173 (dev task)
console.log(PORTS.BROWSERSYNC)   // 5273 (watch task)
```

**Port Configuration:**
- **VITE_DEV (5173)**: Used by the dev task for Hot Module Replacement (HMR)
- **BROWSERSYNC (5273)**: Used by the watch task to serve built files with live reload

These ports are chosen to avoid conflicts, allowing both servers to run simultaneously during development if needed.

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./9-gulp.md
[Next >]: ./11-advanced.md
[TOC]: ./readme.md

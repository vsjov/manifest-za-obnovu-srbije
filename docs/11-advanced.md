## Advanced Usage

### Custom HTML Processing

You can customize the HTML beautification or compression settings:

```javascript
import { createSsbViteConfig, htmlBeautifyPlugin } from '@vsjov/pannonico'

const config = await createSsbViteConfig({
  root: './src'
})

// Replace the default htmlBeautifyPlugin with custom settings
config.plugins = config.plugins.filter(p => p.name !== 'vite-plugin-html-beautify')
config.plugins.push(
  htmlBeautifyPlugin({
    mode: 'beautify',
    indent_size: 4,  // 4 spaces instead of 2
    wrap_line_length: 80,  // Wrap long lines
    // Or use compress mode with custom minification
    // mode: 'compress',
    // minifyOptions: {
    //   collapseWhitespace: true,
    //   removeComments: false  // Keep comments in production
    // }
  })
)
```

### Custom Asset Chunking

The builder already places entry files under `assets/js/`, code-split chunks under `assets/js/chunks/`, and groups `node_modules` into a `vendor` chunk by default.

If you need more control, customize the returned Vite config's `build.rollupOptions.output.manualChunks` function:

```javascript
// In your build configuration
const config = await createSsbViteConfig({
  // ... your options
})

// The builder automatically splits node_modules into vendor chunks
// To customize further, modify the manualChunks configuration
```

### TypeScript Support

The builder fully supports TypeScript:

```typescript
// pages/assets/js/index.ts
const init = (): void => {
  console.log('TypeScript works!')
}

init()
```

### SCSS/Sass Support

```scss
// pages/assets/styles/index.scss
$primary-color: #3498db;

body {
  background-color: $primary-color;
}
```

---

## Build Validation

After every production build, the builder checks that all expected output files were produced. This catches silent failures caused by template errors or missing partials.

### Default Behaviour (Warnings)

If an expected HTML file is missing or empty, a warning is printed to the console:

```
Warning: Build validation failed:
  - Missing output file: about.html
  - Empty output file: contact.html
```

### Strict Mode (Throws)

To fail the build on validation errors (recommended for CI), pass `strict: true` to the low-level `createSsbViteConfig` API. Gulp tasks expose this through `createViteBuildTask`:

```javascript
export const build = createViteBuildTask({
  root: './src',
  outDir: 'dist',
  strict: true   // build process exits with error code on validation failure
})
```

### What Is Validated

- Every input page (`pages/*.html`, `pages/**/*.md`) has a corresponding `.html` file in `outDir`
- Each output file has non-empty content

---

## Circular Dependency Detection

Circular partial includes cause infinite recursion. The builder detects them at configuration time (before any rendering begins) and throws a descriptive error:

```
Error: Circular dependency detected: header -> nav -> header
```

This applies to:
- `{{> partialName}}` references between partials
- `{{#> layoutName}}` layout block references

**Example — causes an error:**

```html
<!-- partials/header.html -->
{{> nav}}

<!-- partials/nav.html -->
{{> header}}   <!-- creates a cycle: header -> nav -> header -->
```

**Fix:** Remove the circular reference. Use data or a shared partial instead of mutual inclusion.

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./10-api.md
[Next >]: ./12-testing.md
[TOC]: ./readme.md

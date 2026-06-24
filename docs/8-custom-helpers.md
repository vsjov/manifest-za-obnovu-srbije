## Custom Helpers

You can create custom helpers in the `helpers/` directory.

### Modern ES Module Pattern (Recommended)

The exported function IS the helper. The filename (without extension) becomes the helper name.

**`helpers/uppercase.js`**
```javascript
/**
 * Converts text to uppercase
 */
const uppercase = (text) => {
  return String(text).toUpperCase()
}

export default uppercase
```

### Legacy Pattern (Also Supported)

The exported function receives the Handlebars instance and registers helpers itself. Detected reliably without string-inspection — works even in minified/bundled code.

**`helpers/lowercase.js`**
```javascript
export default (Handlebars) => {
  Handlebars.registerHelper('lowercase', (text) => {
    return String(text).toLowerCase()
  })
}
```

> **Note:** When using the legacy pattern, the helper name comes from `Handlebars.registerHelper(name, ...)` inside the function, not from the filename.

### HTML-Transforming Helper Safety

Helpers that transform already-rendered HTML should avoid rewriting the whole HTML string with broad regular expressions.

Use the package's protected-segment utility pattern for text-only transforms, and add tests that prove the helper preserves content inside:

- `<code>`
- `<pre>`
- `<script>`
- `<style>`
- `<textarea>`
- existing `<sup>` content

This keeps helper behavior safe for markdown code examples, embedded scripts, styles, and helpers that have already produced semantic markup.

### Usage in Templates

```handlebars
<h1>{{uppercase title}}</h1>
<p>{{lowercase description}}</p>
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./7-markdown.md
[Next >]: ./9-gulp.md
[TOC]: ./readme.md

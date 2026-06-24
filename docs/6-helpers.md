## Built-in Helpers

The static site builder includes these Panini-style helpers:

### `{{#list}}`

Renders a comma-separated list from an array.

```handlebars
{{#list menu.items}}{{label}}{{/list}}
```
**Output:** `Home, About, Contact, Services`

### `{{#ifequal}}`

Conditional rendering based on value equality.

```handlebars
{{#ifequal title "Home"}}
  <p>Welcome to the homepage!</p>
{{else}}
  <p>This is not the homepage.</p>
{{/ifequal}}
```

### `{{#ifpage}}`

Shows content only on specific pages. Matches by **basename** or by **path** (for nested pages).

| Argument form | Matches against | Example |
|---------------|----------------|---------|
| `'about'` (no slash) | `page` — basename only | `about.html` → `'about'` |
| `'blog/post-1'` (with slash) | `pagePath` — full relative path | `blog/post-1.html` → `'blog/post-1'` |

```handlebars
{{! Match by basename — works for top-level pages }}
{{#ifpage 'index'}}
  <p>This appears only on index.html</p>
{{/ifpage}}

{{! Match multiple pages }}
{{#ifpage 'index' 'about'}}
  <p>This appears on index.html OR about.html</p>
{{/ifpage}}

{{! Match nested page by path — avoids ambiguity with same-named files in different dirs }}
{{#ifpage 'blog/post-1'}}
  <p>This appears only on pages/blog/post-1.html</p>
{{/ifpage}}
```

### `{{#unlesspage}}`

Shows content except on specific pages (opposite of `ifpage`). Same basename/path matching rules apply.

```handlebars
{{! Exclude by basename }}
{{#unlesspage 'contact'}}
  <p>This appears on all pages EXCEPT contact.html</p>
{{/unlesspage}}

{{! Exclude a specific nested page }}
{{#unlesspage 'blog/draft-post'}}
  <p>This appears everywhere except that draft.</p>
{{/unlesspage}}
```

### `{{#repeat}}`

Repeats content n times.

```handlebars
<ul>
  {{#repeat 3}}
    <li>Item {{this}}</li>
  {{/repeat}}
</ul>
```

**Output:**
```html
<ul>
  <li>Item 0</li>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

### `{{#markdown}}`

Converts Markdown to HTML within templates. Handlebars helpers work inside markdown blocks!

```handlebars
{{#markdown}}
# Heading 1
This is **bold** and this is *italic*.

{{#ifpage 'about'}}
This content appears only on the about page.
{{/ifpage}}

- List item 1
- List item 2

Team: {{#list team}}{{this}}{{/list}}
{{/markdown}}
```

**Note:** The markdown helper preserves Handlebars syntax and processes it after markdown conversion, so all helpers work seamlessly within markdown content.

Markdown footnotes are supported inside `{{#markdown}}` blocks with `[^ref]` references and `[^ref]:` definitions. See [Markdown Footnotes](./7-markdown.md#markdown-footnotes) for syntax and generated classes.

### `{{translation}}`

Renders an ordered list of reciprocal translation links for the current page.

```handlebars
{{translation}}
```

Example output:

```html
<ol class="translation">
  <li><a href="/index-en.html" data-lang="en">English</a></li>
</ol>
```

Link text uses the language's optional `title`, falling back to its required
`name`. The `data-lang` attribute always uses the configured `code`.

The helper returns an empty string when the current page has no valid translation entries.

### `{{plural}}`

Selects a pluralized text variant using the current page language's resolved `Intl.PluralRules` locale.

Simple English-style example:

```handlebars
<p>{{count}} {{plural count one="article" other="articles"}}</p>
```

Multi-category example:

```handlebars
<p>{{count}} {{plural count one="nova poruka" few="nove poruke" other="novih poruka"}}</p>
```

The helper supports CLDR plural category names through hash arguments:

- `zero`
- `one`
- `two`
- `few`
- `many`
- `other`

Rules:

- the locale comes from `language.pluralRulesLocale`
- that locale is the canonical BCP 47 `code`, or the canonical `pluralRule` override when one is configured
- if no page language metadata exists, the helper falls back to `en`
- if the resolved category is missing, the helper falls back to `other`
- if `count` is not numeric, the helper throws

### `{{t}}`

Resolves a language-keyed string dictionary for the current page language.

Example data:

```json
{
  "searchLabel": {
    "en": "Search",
    "sr": "Pretraga"
  }
}
```

Template usage:

```handlebars
<button>{{t searchLabel}}</button>
```

Optional explicit fallback language:

```handlebars
<button>{{t searchLabel fallback="sr"}}</button>
```

Rules:

- uses `lang` from the current page context
- falls back to page-root `lang` inside partials and nested blocks
- falls back to the explicit `fallback` hash when provided
- otherwise falls back to `en`
- if `en` is missing, returns the first available string value

### Multilingual Partials

Partials reuse the page render context, so they can access `lang`, `language`, `translation`, and any page data directly.

Recommended pattern for multilingual partials:

```handlebars
{{! partials/header.html }}
<header>
  <button>{{t ui.searchLabel}}</button>
  {{translation}}
</header>
```

With language-keyed data:

```json
{
  "searchLabel": {
    "en": "Search",
    "sr": "Pretraga"
  }
}
```

This keeps partial markup shared while allowing translated UI labels per page language.

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./5-assets.md
[Next >]: ./7-markdown.md
[TOC]: ./readme.md

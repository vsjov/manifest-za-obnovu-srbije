## Markdown Files

You can create pages using pure Markdown (`.md`) files alongside your HTML pages. Markdown files support all the same features as HTML pages:

### Creating a Markdown Page

**`pages/about.md`**
```markdown
---
title: About Us
layout: default
---

# About Our Company

We are an **amazing** company that builds great products.

{{#ifpage 'about'}}
This content only appears on the about page.
{{/ifpage}}

## Our Team

Team members: {{#list team}}{{this}}{{/list}}

## Contact Us

- Email: [info@example.com](mailto:info@example.com)
- Phone: 555-1234
```

The `layout: default` field in frontmatter automatically wraps the converted HTML in the `default` layout. Omit it to use `default` implicitly, or set a different layout name.


If frontmatter sets `headlineSections: true` on a markdown page, each heading and its following content are wrapped in a section container until the next heading of the same level or a higher-priority level.

### Features in Markdown Files

- **Frontmatter** - YAML frontmatter works exactly like in HTML files
- **Layouts** - Select a layout with `layout: name` in frontmatter (defaults to `default`)
- **Partials** - Include partials with `{{> partialName}}`
- **Helpers** - All built-in and custom helpers work, including triple-stash `{{{rawHtml}}}`
  - **Headline section opt-in** - Set `headlineSections: true` in markdown frontmatter to wrap each heading section in `<div class="section-headline section-headline-N">`
- **Data access** - Access data files with `{{site.title}}`, `{{menu.items}}`, etc.
- **Languages and translations** - Use `lang`, `translation`, `data/languages.json`, and `{{translation}}` for optional reciprocal translation links
- **Markdown footnotes** - Use `[^ref]` references and `[^ref]:` definitions for generated footnote links
- **Nested helpers** - Use helpers inside other helpers (e.g., `{{#list}}` inside `{{#markdown}}`)
- **Code blocks respected** - Handlebars expressions inside fenced code blocks and inline code spans, including multi-backtick spans, are left as literal text, not evaluated
- **Heading ids** - Markdown headings receive deterministic `id` attributes so internal fragment links work in built output
- **Dynamic markdown links** - Handlebars expressions inside markdown link destinations such as `[Read more]({{url}})` are preserved correctly

### Markdown Footnotes

Markdown files and `{{#markdown}}` blocks support standard footnote references and definitions:

```markdown
This sentence cites a source.[^source]

[^source]: Source details can include **Markdown** and {{helpers}}.
```

Simple example:

```markdown
The city was incorporated in 1851.[^history]

[^history]: See the city charter archive.
```

Footnotes are numbered in reference order and rendered with backreference links. The generated markup uses these classes so consuming sites can style the output:

- `footnote-ref`
- `footnotes`
- `footnotes-list`
- `footnote-item`
- `footnote-backref`

Raw `.html` pages do not process Markdown footnote syntax. Add explicit HTML markup in `.html` pages when footnotes are needed there.

### How It Works

1. The builder automatically discovers both `.html` and `.md` files in your pages directory
2. Markdown files are converted to HTML while preserving Handlebars syntax
3. After conversion, all Handlebars templates and helpers are processed
4. The final output is an `.html` file (e.g., `about.md` → `about.html`)

### Internal Anchor Links

Markdown headings automatically receive `id` attributes derived from the rendered heading text. This allows in-page navigation such as:

```markdown
- [Jump to contact](#contact-information)

## Contact Information
```

Which renders with a matching heading id:

```html
<a href="#contact-information">Jump to contact</a>
<h2 id="contact-information">Contact Information</h2>
```

The slug format is deterministic and supports Unicode headings used in multilingual content.

### Dynamic Markdown Links

Handlebars expressions can be used inside markdown link labels and destinations:

```markdown
[{{site.title}}](https://example.com/docs)
[Support]({{site.supportUrl}})
```

These expressions are preserved during markdown parsing and resolved later by Handlebars when the page is rendered.

### Headline Sections

For markdown pages, `headlineSections: true` wraps each heading-defined section in a level-aware container:

```markdown
---
headlineSections: true
---

# Platform

Intro text.

## Institutions

Details.
```

Which renders in this shape:

```html
<div class="section-headline section-headline-1">
  <h1 id="platform">Platform</h1>
  <p>Intro text.</p>
  <div class="section-headline section-headline-2">
    <h2 id="institutions">Institutions</h2>
    <p>Details.</p>
  </div>
</div>
```

The wrapper for a heading stays open through all nested lower-level headings and closes when the next heading is the same level or a higher-priority heading (`h1` is highest, `h6` is lowest).

### Best Practices

- Use `.md` files for content-heavy pages (documentation, blog posts, articles)
- Use `.html` files for pages with complex layouts or JavaScript interactions
- Mix both formats freely in the same project

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./6-helpers.md
[Next >]: ./8-custom-helpers.md
[TOC]: ./readme.md

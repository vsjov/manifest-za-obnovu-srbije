## Troubleshooting

### Templates Not Updating in Dev Mode

Use `watch` task instead of `dev` task for full template reprocessing:

```bash
npx gulp watch  # Recommended for templates
npx gulp dev    # HMR only, templates need manual refresh
```

### Helpers Not Loading

1. Ensure helpers are in the correct directory
2. Check file extensions (`.js` or `.ts`)
3. Verify the helper exports a default function
4. Check the console for loading errors

### Data File Conflict Error

```
Error: Data file conflict: 'menu' is defined by both 'menu.json' and 'menu.yaml'. Rename one of these files.
```

Each data file must have a unique name across all extensions. Rename or remove one of the conflicting files.

### Circular Dependency Error

```
Error: Circular dependency detected: header -> nav -> header
```

A partial (or layout) is including another partial that eventually includes itself back. Trace the cycle shown in the error message and remove the circular reference.

### Build Validation Warnings

```
Warning: Build validation failed:
  - Missing output file: about.html
```

An input page did not produce an output file. Common causes:
- A template error silently aborted rendering for that page
- A required partial or layout is missing
- The page file has a syntax error in its Handlebars

Run with `strict: true` to turn warnings into build-breaking errors for CI.

### Build Errors

Run with verbose output:

```bash
npx gulp build --verbose
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./13-publishing.md
[Next >]: ./15-security.md
[TOC]: ./readme.md

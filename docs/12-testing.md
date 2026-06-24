## Testing

The static site builder includes comprehensive test coverage using Vitest.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npx vitest src --watch

# Run specific test file
npm test src/helpers/__tests__/list.test.ts
```

### Test Structure

```

├── src/
│   ├── helpers/
│   │   ├── ifpage.ts
│   │   ├── unlesspage.ts
│   │   ├── list.ts
│   │   ├── ifequal.ts
│   │   └── __tests__/          # Helper unit tests
│   │       ├── ifpage.test.ts
│   │       ├── unlesspage.test.ts
│   │       ├── list.test.ts
│   │       └── ...
│   ├── utils/
│   │   ├── load-data.ts
│   │   ├── parse-frontmatter.ts
│   │   ├── has-frontmatter.ts
│   │   ├── detect-circular-partials.ts
│   │   ├── extract-handlebars-expressions.ts
│   │   └── __tests__/          # Utility unit tests
│   │       ├── load-data.test.ts
│   │       ├── parse-frontmatter.test.ts
│   │       ├── detect-circular-partials.test.ts
│   │       ├── extract-handlebars-expressions.test.ts
│   │       └── mocks/          # Mock data for tests
│   │           ├── data/
│   │           │   ├── menu.yaml
│   │           │   ├── site.json
│   │           │   └── team.yaml
│   │           └── data-conflict/   # Conflict detection fixtures
│   │               ├── menu.json
│   │               └── menu.yaml
│   └── vite-plugins/
│       ├── build-validation-plugin.ts
│       └── __tests__/
│           ├── build-validation-plugin.test.ts
│           └── ...
└── build-test/
    ├── pages/                  # Test fixtures
    ├── layouts/
    ├── partials/
    ├── data/
    └── __tests__/             # Integration tests
        ├── html-build.test.ts
        ├── dist-import.test.ts
        └── __snapshots__/     # Snapshot files
            └── html-build.test.ts.snap
```

### Test Types

**Unit Tests** - Test individual functions and helpers in isolation:
- Located in `__tests__/` directories next to source files
- Mock data stored in `__tests__/mocks/` subdirectories
- One test file per source file (e.g., `list.ts` → `list.test.ts`)

**Integration Tests** - Test the complete build process:
- Located in `build-test/__tests__/`
- Use snapshot testing to verify HTML output
- Build the entire site and compare against saved snapshots

### Writing Tests

**Example Unit Test:**
```typescript
// src/helpers/__tests__/list.test.ts
import { describe, it, expect } from 'vitest'
import list from '../list.js'

describe('list helper', () => {
  it('should format array with default separator', () => {
    const context = { items: ['a', 'b', 'c'] }
    const options = {
      fn: (item: string) => item,
      data: { root: context }
    }

    const result = list.call(context, context.items, options)
    expect(result).toBe('a, b, c')
  })
})
```

**Example Integration Test:**
```typescript
// build-test/__tests__/html-build.test.ts
import fs from 'node:fs'
import path from 'node:path'

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'

import { createSsbViteConfig } from '../../src/index.js'

describe('Pannonico', () => {
  const testOutputDir = path.join(__dirname, '../dist-test')

  beforeAll(async () => {
    const config = await createSsbViteConfig({
      root: path.join(__dirname, '..'),
      outDir: testOutputDir,
      vitePlugins: {
        pre: [vue()]
      }
    })

    await build(config)
  })

  afterAll(() => {
    if (fs.existsSync(testOutputDir)) {
      fs.rmSync(testOutputDir, { recursive: true })
    }
  })

  it('should generate index.html with correct content', () => {
    const html = fs.readFileSync(path.join(testOutputDir, 'index.html'), 'utf8')
    expect(html).toMatchSnapshot()
  })
})
```

### Snapshot Testing

Snapshots capture the entire HTML output and detect any changes:

```bash
# Update snapshots after intentional changes
npm test -- -u

# Review snapshot changes
git diff build-test/__tests__/__snapshots__/html-build.test.ts.snap
```

---
Jump to: [< Previous] | [Next >] | [TOC]

[< Previous]: ./11-advanced.md
[Next >]: ./13-publishing.md
[TOC]: ./readme.md

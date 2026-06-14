# erikt/docgen

A minimal documentation site generator built on Node.js native TypeScript. Point it at a folder of markdown files and get a running site with zero configuration.

## Features

- **File-based routing** — `.md` and `.ts` files in `pages/` become routes automatically
- **Markdown** — full CommonMark with syntax highlighting via Shiki
- **No build step** — runs TypeScript directly via Node.js `>=23.6.0`
- **Static output** — `docgen build` generates a GitHub Pages-compatible `dist/`
- **Sidebar navigation** — nested directories automatically produce section sidebars
- **Table of contents** — headings on each page are linked in a right-hand column
- **Light / dark / system** colour scheme with localStorage persistence

## Quick start

```bash
pnpm add @erikt/docgen
```

Create `docs.config.ts` in your project root:

```ts docs.config.ts
import { defineDocs } from "@erikt/docgen";

export default defineDocs({
  structure: [
    { label: "Guide", path: "/guide", icon: "book" },
  ],
});
```

Add scripts to `package.json`:

```json package.json
{
  "scripts": {
    "dev": "docgen dev",
    "build": "docgen build"
  }
}
```

Then run:

```bash
pnpm dev
# Listening on http://localhost:5151
```

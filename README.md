# docgen

A documentation site generator for developers who want a fast, readable site without pulling in a framework.

```bash
pnpm add @erikt/docgen
```

## Why docgen

- **No build step** — runs TypeScript directly via Node.js `>=23.6`. No `tsc`, no `esbuild`, no config files to maintain.
- **File-based routing** — drop a `.md` or `.ts` file in `pages/` and it becomes a route. Directories become sidebar sections automatically.
- **Static output** — `docgen build` writes plain HTML files. Deploys to GitHub Pages or any static host with no special setup.
- **Syntax highlighting** — code blocks highlighted at build time via Shiki. Accurate language grammars, zero client-side JS.
- **Full-text search** — built-in search across all pages powered by MiniSearch. No server, no indexing pipeline.
- **Light & dark mode** — follows the system preference out of the box, with a toggle that persists across visits.
- **Table of contents** — headings on each page are linked in a right-hand column, with scroll-position tracking.
- **Lean on the platform** — `node:http` for the server, `node:fs` for file watching, modern CSS for theming. Short dependency list by design.

## Quick start

Create `docs.config.ts` in your project root:

```ts
import { defineDocs } from "@erikt/docgen";

export default await defineDocs({
  structure: [{ label: "Guide", path: "/guide", icon: "book" }],
});
```

Add scripts to `package.json`:

```json
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
# listening on http://localhost:5151
```

## Pages

Files in `pages/` map directly to routes:

| File                          | Route                 |
| ----------------------------- | --------------------- |
| `pages/index.md`              | `/`                   |
| `pages/guide/installation.md` | `/guide/installation` |

Both `.md` and `.ts` files are supported. Markdown is processed through remark/rehype with GitHub Flavored Markdown and Shiki syntax highlighting. TypeScript pages export a `SafeHtml` value built with the `html` tagged template.

Prefix filenames with a number to control sidebar order — the prefix is stripped from the URL and display name.

## Deployment

`docgen build` writes a static site to `dist/`. See the [deployment guide](packages/example/pages/guide/4-deployment.md) for a ready-to-use GitHub Actions workflow.

If your site is served from a sub-path (e.g. GitHub Pages), set the `base` option:

```ts
export default await defineDocs({
  base: "/my-repo",
});
```

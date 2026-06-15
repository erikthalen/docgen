---
description: How to install docgen, set up your project structure, and run the dev server or build command.
---

# Installation

## Requirements

Node.js `>=23.6.0` is required. docgen uses Node's native TypeScript strip-only mode — no `tsc`, no `esbuild`, no config.

## Install

```bash
pnpm add @erikt/docgen
```

## Project structure

```sh
your-project/
├── docs.config.ts
├── pages/
│   ├── index.md
│   └── guide/
│       ├── 1-installation.md
│       └── 2-configuration.md
└── public/          # optional static assets
```

The `pages/` directory is the only required convention. Everything else is configured in `docs.config.ts`.

## CLI

docgen exposes two commands via the `docgen` binary:

| Command        | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `docgen dev`   | Start the dev server on `http://localhost:5151` with file watching |
| `docgen build` | Write a static site to `dist/`                                     |

Add them to your `package.json`:

```json package.json
{
  "scripts": {
    "dev": "docgen dev",
    "build": "docgen build"
  }
}
```

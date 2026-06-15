---
description: All configuration options for docs.config.ts — pagesDir, outDir, and the structure nav array.
---

# Configuration

All configuration lives in `docs.config.ts` at your project root.

## defineDocs

```ts
import { defineDocs } from "@erikt/docgen";

export default await defineDocs(config);
```

`defineDocs` detects whether the file is being run directly (by the `docgen` CLI) and starts the server or build accordingly. The config object is returned so it can be used as the default export.

## Options

### `pagesDir`

Path to the directory containing your pages. Defaults to `pages/` relative to the working directory.

```ts
export default await defineDocs({
  pagesDir: "./docs/pages",
});
```

### `outDir`

Output directory for `docgen build`. Defaults to `dist/`.

```ts
export default await defineDocs({
  outDir: "./build",
});
```

### `structure`

Defines the top-level navigation shown in the site header. Each item specifies a label, path, and a [Tabler icon](https://tabler.io/icons) name. Icons are fetched from the jsDelivr CDN on first use and cached in `node_modules/.cache/docgen/icons.json`.

```ts
export default await defineDocs({
  structure: [
    { label: "Guide",     path: "/guide",     icon: "book"   },
    { label: "Reference", path: "/reference", icon: "code"   },
    { label: "Changelog", path: "/changelog", icon: "clock"  },
  ],
});
```

When `structure` is omitted, the nav links are generated automatically from all top-level routes.

---
description: Reference for the html, safe, defineDocs, and SafeHtml exports from @erikt/docgen.
---

# API reference

## html

Tagged template literal that returns a `SafeHtml` value. Interpolated values are HTML-escaped unless they are themselves `SafeHtml`.

```ts
import { html } from "@erikt/docgen";

const name = "<script>alert(1)</script>";
const page = html`<h1>Hello, ${name}</h1>`;
// → <h1>Hello, &lt;script&gt;alert(1)&lt;/script&gt;</h1>
```

Arrays of `SafeHtml` values are joined without a separator:

```ts
const items = ["one", "two", "three"];

const list = html`<ul>
  ${items.map((i) => html`<li>${i}</li>`)}
</ul>`;
```

## safe

Marks a plain string as trusted HTML, bypassing escaping. Use only for markup you control.

```ts
import { html, safe } from "@erikt/docgen";

const raw = safe("<strong>bold</strong>");
const page = html`<p>${raw}</p>`;
// → <p><strong>bold</strong></p>
```

## defineDocs

Reads the config and starts the dev server or build depending on how the process was invoked. Returns the config so it can be re-exported.

```ts
import { defineDocs } from "@erikt/docgen";

export default await defineDocs({
  pagesDir: "./pages",
  outDir: "./dist",
  structure: [{ label: "Guide", path: "/guide", icon: "book" }],
});
```

## SafeHtml

A branded wrapper type used throughout the template system. Values of this type are inserted verbatim into `html` templates; anything else is escaped.

```ts
import type { SafeHtml } from "@erikt/docgen";

export default html`<h1>My page</h1>` satisfies SafeHtml;
```

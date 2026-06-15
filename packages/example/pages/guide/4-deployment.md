---
description: How to deploy your docgen site to GitHub Pages using a GitHub Actions workflow.
---

# Deployment

`docgen build` writes a static site to `dist/`. The output is a flat folder of HTML files with a `.nojekyll` marker, ready to deploy to any static host.

## GitHub Pages

The recommended approach is a GitHub Actions workflow that builds and deploys on every push to `main`.

### Enable GitHub Pages

In your repository go to **Settings → Pages** and set the source to **GitHub Actions**.

### Add the workflow

Create `.github/workflows/deploy.yml`:

```yaml .github/workflows/deploy.yml
name: Deploy docs

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '23'
          cache: pnpm

      - run: pnpm install

      - run: pnpm build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - id: deployment
        uses: actions/deploy-pages@v4
```

Push to `main` and the action will build your docs and publish them. The live URL appears in the **Actions** tab once the first run completes.

### Custom output directory

If you set `outDir` in `docs.config.ts`, update the `path` in the upload step to match:

```yaml
- uses: actions/upload-pages-artifact@v3
  with:
    path: your-custom-dir
```

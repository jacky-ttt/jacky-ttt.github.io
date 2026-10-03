# tsangszechun.com

Personal website source for [tsangszechun.com](https://tsangszechun.com/).

## Stack

- Astro 7
- Tailwind CSS 4
- TypeScript

## Local Development

Requires Node.js 22.12+.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the build locally
```

## Deploy

`main` is the only branch. Pushing to it runs `.github/workflows/deploy.yml`: it builds the
site with `withastro/action` and publishes it to GitHub Pages with `actions/deploy-pages`.
There is no manual deploy step and no branch of generated files.

The workflow needs two repository settings:

- **Settings → Pages → Source:** GitHub Actions
- **Settings → Environments → `github-pages` → Deployment branches:** includes `main`

To re-run a deploy without a new commit, open the `deploy.yml` workflow under **Actions**
and click **Run workflow** (`workflow_dispatch`), or use `gh run rerun <run-id>`.

The old Gatsby build output (previously the `master` branch) is kept as the tag
`archive/gatsby-build`.

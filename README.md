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

Pushing to `dev` runs `.github/workflows/deploy-from-dev.yml`: it builds the site with
`withastro/action` and publishes it to GitHub Pages with `actions/deploy-pages`. There is no
manual deploy step, and nothing is pushed to `master` (that branch holds the old Gatsby build
output and is no longer used).

The workflow needs two repository settings:

- **Settings → Pages → Source:** GitHub Actions
- **Settings → Environments → `github-pages` → Deployment branches:** includes `dev`

To re-run a deploy without a new commit, open the `deploy-from-dev.yml` workflow under **Actions** and click **Run workflow**
(`workflow_dispatch`), or `gh run rerun <run-id>`.

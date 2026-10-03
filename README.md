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

Pushing to `dev` runs `.github/workflows/deploy-from-dev.yml`, which builds the site
and publishes it to GitHub Pages with `actions/deploy-pages`. The repository's
**Settings → Pages → Source** must be set to **GitHub Actions**.

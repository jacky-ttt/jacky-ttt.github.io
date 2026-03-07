# tsangszechun.com

Personal website source for [tsangszechun.com](https://tsangszechun.com/).

## Stack

- Gatsby 5
- React 19
- Tailwind CSS 4
- TypeScript

## Local Development

```bash
npm install
npm run develop
```

## Build

```bash
npm run build
```

## Deploy to GitHub Pages (master branch)

This project deploys with the `gh-pages` CLI via:

```bash
npm run deploy
```

The deploy script does three steps:

1. Runs `gatsby build` to generate static files in `public/`
2. Writes `public/CNAME` with `tsangszechun.com`
3. Runs `gh-pages -d public -b master`

`gh-pages` then pushes the contents of `public/` to the `master` branch (as the publish branch for GitHub Pages), not the source files from `dev`.

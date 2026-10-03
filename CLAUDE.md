# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site for https://tsangszechun.com — Gatsby 5, React 19, Tailwind CSS 4, TypeScript.

## Commands

```bash
npm run develop      # dev server (npm run dev also opens the browser)
npm run typecheck    # tsc --noEmit
npm run clean && npm run build   # clean production build into public/
npm run serve        # serve the built public/
npm run format       # prettier (format:check for CI-style check)
```

There are no tests. The `lint` scripts reference ESLint, but ESLint isn't installed or configured, so they don't run. To check a change, use the `verify` project skill (`.claude/skills/verify`): typecheck, clean build, then assert on `public/*.html`.

## Branches and deploy

- **`dev` is the source branch. `master` holds only built output.** Never commit source to `master` or open PRs against it.
- Pushing to `dev` triggers `.github/workflows/deploy-from-dev.yml`. It runs `npm run deploy` (`gatsby build`, writes `public/CNAME`, then `gh-pages -d public -b master`). The site is live about 4 minutes later.

## Architecture

- The whole site is basically one page, `src/pages/index.tsx`, plus `404.tsx`. Page `<head>` content goes in the Gatsby Head API export (`export const Head: HeadFC`). There's no `src/html.tsx`; it was deleted on purpose, so don't recreate it.
- Content data lives in `src/data/`:
  - `projects.json` is loaded through `gatsby-source-filesystem` + `gatsby-transformer-json` and queried as `allProjectsJson` in `index.tsx`. Each entry's `image` is a relative path (`../images/x.png`) that Gatsby resolves to a `File` node, so `childImageSharp` / `GatsbyImage` work. To add a project, add a JSON entry and drop the image in `src/images/`.
  - `links.ts` and `skills.ts` are plain TS imports, not GraphQL.
- Site-wide metadata and manifest colors are in `src/config/config.ts`, which `gatsby-config.ts` reads.
- Tailwind v4 still uses the legacy JS config: `src/styles/global.css` pulls in `tailwind.config.js` via `@config`. That config defines custom utilities (3D card-flip and `text-shadow-*`) and `tailwindcss-animate`. Its `content` globs only cover `src/pages` and `src/components`.

## Project skills

- `verify`: clean build plus checks on the served/built HTML before committing.
- `affiliate-verification-tag`: adding or removing affiliate-network ownership tags. Gatsby rewrites these snippets, so always check the built bytes, not the source.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site for https://tsangszechun.com — Astro 7, Tailwind CSS 4, TypeScript. Fully static, with no client framework. The only JavaScript is the page script and the shader background.

## Commands

```bash
npm run dev                      # dev server (opens browser)
npm run check                    # astro check: types in .astro and .ts
rm -rf dist && npm run build     # clean production build into dist/
npm run preview                  # serve dist/
npm run format                   # prettier (with prettier-plugin-astro)
```

There are no tests. To check a change, use the `verify` project skill (`.claude/skills/verify`): check, clean build, then assert on `dist/*.html` and screenshot it.

TypeScript is pinned to 6.x because `@astrojs/check` doesn't support TypeScript 7 yet.

## Branches and deploy

- **`dev` is the source branch.** Pushing to it runs `.github/workflows/deploy-from-dev.yml`: `withastro/action` builds, `actions/deploy-pages` publishes. The repo's Pages source must be set to "GitHub Actions".
- `master` is the old gh-pages output branch from the Gatsby era. Nothing writes to it any more, so don't commit to it.

## Architecture

- `src/layouts/Layout.astro` owns `<head>` (meta, OG tags, icons, manifest) and imports `src/styles/global.css`. Both pages (`src/pages/index.astro`, `404.astro`) render through it.
- Data lives in `src/data/`:
  - `projects.json` is the `projects` content collection (`src/content.config.ts`). It's an ordered array without ids, so the loader's parser uses the array index as the id. `image` is a path relative to the JSON file, validated by `image()`, and rendered with `astro:assets` `<Picture>` (AVIF with a WebP fallback). To add a project, add an entry and drop the image in `src/images/`.
  - `links.ts` and `skills.ts` are plain TS imports.
- Project cards open a native `<dialog>` per project, wired up by the `<script>` at the bottom of `index.astro`. Opening and closing morph the card image into the dialog image with the View Transitions API (`morph()`); the dialog fade uses `@starting-style` in `global.css`. The same script feeds `--spot-x`/`--spot-y` to the `.spotlight` cursor glow.
- `src/components/Background.astro` mounts a Paper Shaders mesh gradient behind every page (`@paper-design/shaders`, pinned exactly because it's pre-1.0). It pauses when off screen and holds still under `prefers-reduced-motion`.
- All motion must respect `prefers-reduced-motion`. `docs/design-suggestions.md` tracks which design ideas are done and which are still open.
- Icons are SVG files in `src/icons/`, imported as components (`import X from "../icons/x.svg"`).
- Tailwind 4 uses the CSS-first setup through `@tailwindcss/vite`. There's no `tailwind.config.js`. Animations come from `tw-animate-css`, and the 3D card tilt uses built-in utilities (`perspective-*`, `rotate-x-*`, `transform-3d`).
- `public/` is copied verbatim: favicons, `manifest.webmanifest`, `CNAME`. Site-wide strings and colours are in `src/config/config.ts`, but the manifest duplicates them by hand.

## Project skills

- `verify`: clean build plus checks on the served/built HTML and screenshots before committing.
- `affiliate-verification-tag`: adding or removing affiliate-network ownership tags. It covers how Astro rewrites snippets (use literal attributes and `is:inline`).

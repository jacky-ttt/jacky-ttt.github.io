# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal site for https://tsangszechun.com — Astro 7, Tailwind CSS 4, TypeScript. Fully static, with no client framework. The only JavaScript is the page script.

## Commands

```bash
npm run dev                      # dev server (opens browser)
npm run check                    # astro check: types in .astro and .ts
rm -rf dist && npm run build     # clean production build into dist/
npm run preview                  # serve dist/
npm run format                   # prettier (with prettier-plugin-astro)
npm run test:visual              # Playwright screenshot tests, desktop + mobile (builds first)
npm run test:visual:update       # regenerate every baseline after an intended visual change
npx playwright test -g "close"   # run one test by name
```

## Screenshot tests

`tests/site.spec.ts` covers every page, hover/focus state, and animation (page-load entrance, card expand and collapse frame by frame, reduced motion), in four Playwright projects: `desktop` (1440×900) and `mobile` (390×844 @2x), plus `desktop-200` and `mobile-200`, which run every test again at the browser's 200% font-size setting (WCAG 1.4.4). Baselines live in `tests/__screenshots__/<platform>/` and are committed. They're macOS-rendered, so on another OS run the update script first.

How they stay deterministic (keep this when adding tests):

- The background is hidden; it has its own non-screenshot test (the wave runs, and doesn't under reduced motion).
- Animations are frozen and seeked with the Web Animations API (`startAndFreeze` / `seekTransition`), and the page-load entrance by setting Chromium's animation playback rate to 0 before navigation.
- Cards are opened with `openCard()`, which lets the hover transitions settle before clicking.
- 200%: the `textScale` fixture sets Chromium's font size through CDP (`Page.setFontSizes`) before each page loads, and fails the test if it's no longer applied afterwards. A `fullPage` screenshot silently resets it, so full-page shots grow the viewport to the page height instead (`growToPage()`); never use `fullPage: true`.
- Settled screenshots allow zero differing pixels. Frozen view-transition frames allow 250, because GPU snapshot scaling varies slightly. A real regression is thousands of pixels.

After an intended visual change, run the update script and _look at_ the changed PNGs before committing. In its default "changed" mode, `--update-snapshots` only rewrites images that fail, which can leave a wrong baseline in place.

For changes outside what the tests cover, use the `verify` project skill (`.claude/skills/verify`).

## Quality bar

Lighthouse must score 100 in all four categories (performance, accessibility, best practices, SEO) for `/` and `/404.html`, on mobile and desktop. Re-run it after any visual or markup change, against a clean build served by `npm run preview` (port 4321 by default):

```bash
npx lighthouse@12 http://localhost:4321/ --quiet --chrome-flags="--headless=new" --view                 # mobile
npx lighthouse@12 http://localhost:4321/ --preset=desktop --quiet --chrome-flags="--headless=new" --view
```

Run `/404.html`, not a missing path: the 404 status makes Lighthouse refuse the page.

Lighthouse can't measure text on gradients or inside closed dialogs, so check those by hand: text needs 4.5:1 contrast against the _lightest_ end of its background (link cards, skill pills, project cards and their dialogs).

TypeScript is pinned to 6.x because `@astrojs/check` doesn't support TypeScript 7 yet.

## Branches and deploy

- **`main` is the only branch.** It holds the source, and pushing to it runs `.github/workflows/deploy.yml`: `withastro/action` builds, `actions/deploy-pages` publishes. There is no build-output branch.
- Repo settings this relies on: Pages source is "GitHub Actions", and the `github-pages` environment allows deployments from `main`.
- The old Gatsby build output (formerly the `master` branch) is kept as the tag `archive/gatsby-build`.

## Architecture

- `src/layouts/Layout.astro` owns `<head>` (meta, OG tags, icons, manifest) and imports `src/styles/global.css`. Both pages (`src/pages/index.astro`, `404.astro`) render through it.
- Data lives in `src/data/`:
  - `projects.json` is the `projects` content collection (`src/content.config.ts`). It's an ordered array without ids, so the loader's parser uses the array index as the id. `image` is a path relative to the JSON file, validated by `image()`, and rendered with `astro:assets` `<Picture>` (AVIF with a WebP fallback). To add a project, add an entry and drop the image in `src/images/`.
  - `links.ts` and `skills.ts` are plain TS imports.
- Project cards open a native `<dialog>` per project, wired up by the `<script>` at the bottom of `index.astro`. Opening and closing morph the card image into the dialog image with the View Transitions API (`morph()`); the dialog fade uses `@starting-style` in `global.css`. The same script feeds `--spot-x`/`--spot-y` to the `.spotlight` cursor glow.
- `src/components/Background.astro` is a pure-CSS backdrop behind every page: a dot grid fading out from the top, a violet glow behind the heading, and a brighter band of dots sweeping down on a loop (`--wave`, registered with `@property` so it animates without wrapping). The wave is off under `prefers-reduced-motion`. `src/components/WaveToggle.astro` (next to Source on both pages) pauses it by setting `data-paused` on `<html>`, remembered in `localStorage`.
- All motion must respect `prefers-reduced-motion`. `docs/design-suggestions.md` tracks which design ideas are done and which are still open.
- Icons are SVG files in `src/icons/`, imported as components (`import X from "../icons/x.svg"`). Interface icons come only from [Heroicons](https://heroicons.com) 24 solid; brand logos (GitHub, Android) only from [Simple Icons](https://simpleicons.org). Copy the file from the npm package rather than drawing or retyping paths; keep `viewBox="0 0 24 24"` and `fill="currentColor"`.
- Tailwind 4 uses the CSS-first setup through `@tailwindcss/vite`. There's no `tailwind.config.js`. Animations come from `tw-animate-css`, and the 3D card tilt uses built-in utilities (`perspective-*`, `rotate-x-*`, `transform-3d`).
- `public/` is copied verbatim: `manifest.webmanifest`, `og.jpg`, `robots.txt`, `llms.txt`, `CNAME`. Site icons are not in it: `src/images/favicon.svg` is the only icon source, and `favicon.ico` plus the home-screen PNGs are rendered from it with `sharp` at build time (`src/images/favicon.ts`, `src/pages/favicon.*.ts`, `src/pages/[icon].png.ts`). Never commit generated icons to `public/`: a file there silently wins over the endpoint. `src/images/avatar.png` is the old Androidify mascot, kept but unpublished. Site-wide strings and colours are in `src/config/config.ts`, but the manifest duplicates them by hand.

## Project skills

- `verify`: clean build plus checks on the served/built HTML and screenshots before committing.
- `affiliate-verification-tag`: adding or removing affiliate-network ownership tags. It covers how Astro rewrites snippets (use literal attributes and `is:inline`).

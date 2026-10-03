# Design suggestions

Review of the Astro site (desktop 1440px, mobile 390px, project dialog) and proposed
micro-animations and interactions. Written 2026-10-03.

## Current look

### What works

- Strong type hierarchy: large name, clear subtitle, then sections.
- The color ramps give the page a system: orange→cream on the name, violet→pink on
  skills, red→orange on projects.
- Monospace uppercase labels give a developer feel.

### What holds it back

1. **Flat background.** Solid `#171717` everywhere; the page feels like a 2021
   Tailwind template. Biggest single win available.
2. **Link cards are the loudest element.** Three large saturated gradients compete
   with the name, and on mobile they fill a whole screen — for the least important
   content.
3. **Project images are muddy.** `brightness-20` makes most logos unreadable (HSBC and
   Ring read as grey smudges). Try ~50–60% at rest, full brightness on hover.
4. **Skills are a wall of tags.** 35 pills at equal weight; about one full screen of
   purple on mobile.
5. **Hover effects feel dated.** The `rotate-x` tilt is barely perceptible, and
   `animate-pulse` on the link cards reads like a loading state.
6. **Small fixes:**
   - Dialog body uses `text-justify`, which creates rivers on mobile — use left align.
   - `p-12` side padding on mobile wastes width — `px-6` is plenty.
   - Copy: "Web Scrapper" → "Web Scraper"; "kotlin" → "Kotlin" in project skills.

## Proposed additions

| #   | Idea                                                                                                     | How                                                                                                                                                           | Cost                   |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | **Animated background** — slow mesh gradient with grain in the violet/orange palette                     | **Paper Shaders** (`@paper-design/shaders`), vanilla WebGL: `MeshGradient` / `GrainGradient`. Zero-JS fallback: blurred CSS gradient blobs on a slow keyframe | Small; pause offscreen |
| 2   | **Card → dialog morph** — clicked card image expands into the dialog image                               | Native **View Transitions API**: `document.startViewTransition()` + `view-transition-name`. No library                                                        | ~10 lines              |
| 3   | **Spotlight cards** — soft radial glow follows the cursor over link and project cards                    | CSS custom properties set on `pointermove`                                                                                                                    | ~10 lines              |
| 4   | **Springy tilt** — cards tilt toward the pointer with spring physics, replacing the fixed tilt and pulse | **Motion** (motion.dev), vanilla `animate()` / `hover()` with springs                                                                                         | Small                  |
| 5   | **Scroll reveal** — project cards fade and rise in a stagger as they enter view                          | Native **CSS scroll-driven animations** (`animation-timeline: view()`)                                                                                        | CSS only               |
| 6   | **Name entrance** — letters drop in one by one on load; wave on hover                                    | Motion `stagger()`                                                                                                                                            | Small                  |
| 7   | **Skills marquee** — two slow opposing rows, pause on hover                                              | Pure CSS                                                                                                                                                      | CSS only               |

### Libraries

Two at most; everything else uses browser features (View Transitions, scroll-driven
animations, `@starting-style`).

| Library                                                                 | Version (2026-10-03) | Why                                                                   |
| ----------------------------------------------------------------------- | -------------------- | --------------------------------------------------------------------- |
| [Motion](https://motion.dev) (`motion`)                                 | 14.0.0               | Springs and staggers without React; the smallest build is a few KB    |
| [Paper Shaders](https://shaders.paper.design) (`@paper-design/shaders`) | 0.0.81               | Modern vanilla shader backgrounds. **Pre-1.0: pin the exact version** |

### Skip

- **GSAP**: free now, but overkill for one page.
- **Lenis**: smooth-scroll hijacking hurts accessibility and adds nothing to a single
  page.
- **Vanta.js**: dated, and built on Three.js.

### Guardrails

- Every animation is disabled under `prefers-reduced-motion: reduce`.
- The shader background pauses when the tab is hidden or the canvas is offscreen.
- Check against `verify` after each item: no layout shift, and the page still loads
  no JS files beyond what each feature strictly needs.

## Recommended order

1. Small fixes and image dimming (item 6 and #3 under "holds it back").
2. Animated background (#1).
3. Card → dialog morph (#2).
4. Spotlight cards (#3).

Then reassess before adding Motion-based items (#4, #6).

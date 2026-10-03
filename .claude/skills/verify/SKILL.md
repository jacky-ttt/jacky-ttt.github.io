---
name: verify
description: Verify a change to this Astro site actually works by building it clean and observing the real output — astro check, clean build, serve locally, assert on the served HTML, and screenshot it. Use before committing anything non-trivial, when confirming a change reached the built output, or when comparing a local build against the deployed site.
---

# Verifying a change to this site

This is an Astro static site. Everything that matters ends up in `dist/*.html`, so
verification means **building clean and reading the actual output** — not trusting
that the source looks right.

- Astro rewrites some markup on the way out (escapes `&` in `{expression}`
  attributes, normalizes quotes, bundles `<script>` tags that lack `is:inline`).
- A stale `dist/` from an earlier build will happily show you yesterday's result.

## Standard loop

```
npm run check                        # astro check (types in .astro + .ts)
rm -rf dist && npm run build         # ~10s; never skip the rm
npm run test:visual                  # screenshot tests, desktop + mobile (~15s)
```

If a screenshot test fails, open `playwright-report/index.html` (or the `*-diff.png` files in
`test-results/`) and decide: regression, so fix it; or intended change, so
`npm run test:visual:update` and review the new PNGs before committing.

Then assert on the output. Check whatever the change was supposed to affect:

```
grep -o '<meta[^>]*MARKER[^>]*>' dist/index.html
grep -c 'SOME_STRING' dist/index.html
```

Confirm something is inside `<head>` rather than merely present:

```
python3 -c "
s=open('dist/index.html').read()
t=s.find('MARKER'); h=s.find('</head>')
print('INSIDE HEAD' if 0 < t < h else 'PROBLEM', '| occurrences:', s.count('MARKER'))
"
```

## Serving and looking at it

To check what a browser or crawler actually receives over HTTP, and what it looks
like:

```
npx astro preview --port 9112 > /tmp/preview.log 2>&1 &
sleep 3
curl -s http://localhost:9112/ -o /tmp/served.html -w "status=%{http_code}\n"
curl -s -o /dev/null -w "404=%{http_code}\n" http://localhost:9112/nope   # want 404
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --hide-scrollbars \
  --virtual-time-budget=8000 --window-size=1440,3400 --screenshot=/tmp/desktop.png http://localhost:9112/
pkill -f "astro preview --port 9112"
```

Read the screenshot for any visual change. Use `--window-size=390,7000` for mobile.
Project images are `loading="lazy"`, so ones far below the fold may render blank in
a headless screenshot — that is not a bug.

The project cards open native `<dialog>`s via a small inline script. To test
clicking, drive headless Chrome over the DevTools protocol (`--remote-debugging-port`
plus Node's built-in `WebSocket`); `Input.dispatchMouseEvent` on a card, then check
`document.getElementById("project-N").open`.

## Comparing against the deployed site

Useful for proving a change is the _only_ difference, and for telling a real
regression apart from a pre-existing condition:

```
curl -s https://tsangszechun.com/ | grep -o '<head>.*</head>' \
  | sed 's/></>\n</g' | grep -oE '^<(title|meta name="[^"]*"|meta property="[^"]*")' | sort > /tmp/live_head.txt

grep -o '<head>.*</head>' dist/index.html \
  | sed 's/></>\n</g' | grep -oE '^<(title|meta name="[^"]*"|meta property="[^"]*")' | sort > /tmp/new_head.txt

diff /tmp/live_head.txt /tmp/new_head.txt
```

**Before reporting anything as broken, check whether it is already broken in
production.**

Judge colors by sampling pixels, not by eye: the card images are dimmed to 20%
brightness (`brightness-20`), which looks far brighter than it is in a downscaled
screenshot. Convert with `sips -s format bmp` and read bytes in Python.

## Deploy facts

- `dev` is the source branch. Work here.
- Pushing to `dev` triggers `.github/workflows/deploy-from-dev.yml`, which builds
  with `withastro/action` and publishes via `actions/deploy-pages`. `master` is no
  longer written to.
- Deployment is not verification. Confirm the live site afterwards:
  ```
  curl -s https://tsangszechun.com/ | grep -o 'WHATEVER_CHANGED'
  ```

## Scope

Skip this for changes with no runtime surface — docs, comments, or notes in the
Obsidian vault. Use it for anything touching `src/`, `public/`, `astro.config.mjs`,
`package.json`, or third-party snippets.

---
name: verify
description: Verify a change to this Gatsby site actually works by building it clean and observing the real output — typecheck, clean build, serve locally, and assert on the served HTML. Use before committing anything non-trivial, when confirming a change reached the built output, or when comparing a local build against the deployed site.
---

# Verifying a change to this site

This is a Gatsby 5 static site. Almost everything that matters ends up in
`public/*.html`, so verification means **building clean and reading the actual
output** — not trusting that the source looks right.

Two properties of this repo make source-level confidence unreliable:

- React rewrites markup on the way out (escapes `&` in attributes, normalizes
  quotes, and the Head API appends `data-gatsby-head="true"`).
- A stale `public/` from an earlier build will happily show you yesterday's result.

## Standard loop

```
npm run typecheck                    # tsc --noEmit
npm run clean && npm run build       # ~40s clean; never skip clean
```

Then assert on the output. Check whatever the change was supposed to affect:

```
grep -o '<meta[^>]*MARKER[^>]*>' public/index.html
grep -c 'SOME_STRING' public/index.html
```

Confirm something is inside `<head>` rather than merely present:

```
python3 -c "
s=open('public/index.html').read()
t=s.find('MARKER'); h=s.find('</head>')
print('INSIDE HEAD' if 0 < t < h else 'PROBLEM', '| occurrences:', s.count('MARKER'))
"
```

## Serving it for real

To check what a browser or crawler actually receives over HTTP:

```
npx gatsby serve -p 9111 > /tmp/serve.log 2>&1 &
sleep 8
curl -s http://localhost:9111/ -o /tmp/served.html -w "status=%{http_code}\n"
# ...assertions against /tmp/served.html...
kill %1
```

Prefer this over reading `public/index.html` directly when the change involves
anything a crawler or third-party tool will fetch.

## Comparing against the deployed site

Useful for proving a change is the *only* difference, and for telling a real
regression apart from a pre-existing condition:

```
curl -s https://tsangszechun.com/ | grep -o '<head>.*</head>' \
  | sed 's/></>\n</g' | grep -oE '^<(title|meta name="[^"]*"|meta property="[^"]*")' | sort > /tmp/live_head.txt

grep -o '<head>.*</head>' public/index.html \
  | sed 's/></>\n</g' | grep -oE '^<(title|meta name="[^"]*"|meta property="[^"]*")' | sort > /tmp/new_head.txt

diff /tmp/live_head.txt /tmp/new_head.txt
```

**Before reporting anything as broken, check whether it is already broken in
production.** The missing `<title>` was diagnosed as a regression this way and turned
out to be pre-existing.

## Known pre-existing issues

Do not report these as regressions caused by a change:

- **No `<title>` in the built output.** `src/pages/index.tsx` declares
  `<title>{websiteConfig.siteTitle}</title>` in its Head export, but it does not reach
  `public/index.html`. The live site has the same gap. Real bug, but unrelated to
  whatever you are currently verifying.

## Branch and deploy facts

- `dev` is the **source** branch. Work here.
- `master` is **generated gh-pages build output** (`gh-pages -d public -b master`).
  Never edit it, never commit to it. Checking it out replaces your working tree with
  built artifacts and makes `src/` disappear.
- Pushing to `dev` triggers `.github/workflows/deploy-from-dev.yml`, which runs
  `npm run deploy` and publishes to `master`. Live in roughly 4 minutes.
- Deployment is not verification. Confirm the live site afterwards:
  ```
  curl -s https://tsangszechun.com/ | grep -o 'WHATEVER_CHANGED'
  ```

## Scope

Skip this for changes with no runtime surface — docs, comments, or notes in the
Obsidian vault. Use it for anything touching `src/`, `gatsby-*.ts`, `package.json`
scripts, or third-party snippets.

---
name: affiliate-verification-tag
description: Add, verify, or remove an affiliate network's site-ownership verification tag (AvantLink, impact.com, AWIN, CJ, or similar). Use when a network issues a <script> or <meta> snippet to prove ownership of tsangszechun.com, when such verification is failing despite the tag looking correct in the page source, or when removing a tag after an application is approved.
---

# Affiliate network verification tags

Affiliate networks gate applications behind a site-ownership check: they issue an
HTML snippet, you install it, their crawler fetches the page and looks for it.

**The core hazard: this site is Gatsby/React, which rewrites third-party snippets on
the way out.** The snippet you paste is not the snippet that gets served. Verification
failures here are almost never "the tag is missing" — they are "the served bytes do
not match what the network issued."

Always verify against the **built output**, never the source file.

## Where the tag goes

Add it to the Head export in `src/pages/index.tsx`:

```tsx
export const Head: HeadFC = () => {
  return (
    <>
      {/* ...existing meta... */}
      {/* <network> site ownership verification. Remove once approved. */}
      <meta name="..." content="..." />
    </>
  )
}
```

Networks normally only require the tag on the home page. Add it to
`src/pages/404.tsx` only if they explicitly ask for site-wide.

**Do not recreate `src/html.tsx`.** It was deleted deliberately (commit `ca0c75a`)
because it only ever existed to host a verification tag and otherwise just duplicated
Gatsby's default template. The Head API is the correct home for these tags. The one
exception is a tag that must appear byte-identical with no Gatsby-added attributes —
see "Gatsby adds data-gatsby-head" below.

## Procedure

1. **Add the tag** to the Head export, with a comment naming the network and saying
   it is removable once approved.

2. **Typecheck** — non-standard attributes fail here:
   ```
   npm run typecheck
   ```

3. **Clean build** — a stale `public/` will lie to you:
   ```
   npm run clean && npm run build
   ```

4. **Verify the built bytes** against what the network issued:
   ```
   grep -o '<meta[^>]*NETWORK-MARKER[^>]*>' public/index.html
   grep -o '<script[^>]*NETWORK-MARKER[^>]*></script>' public/index.html
   ```
   Compare character by character with the snippet from their email. Check the
   token/UUID survived intact, and confirm it is inside `<head>`:
   ```
   python3 -c "
   s=open('public/index.html').read()
   t=s.find('NETWORK-MARKER'); h=s.find('</head>')
   print('INSIDE HEAD' if 0 < t < h else 'PROBLEM', '| occurrences:', s.count('NETWORK-MARKER'))
   "
   ```

5. **Commit and push to `dev`.** The GitHub Action builds and deploys to `master`
   (gh-pages) in roughly 4 minutes. Nothing verifies until it is live.

6. **Confirm on the live site** before triggering their check:
   ```
   curl -s https://tsangszechun.com/ | grep -o '<meta[^>]*NETWORK-MARKER[^>]*>'
   ```

7. **Run the network's verification**, then note the outcome in
   `/Users/jackytsang/Obsidian/Side Project/Project Affiliate.md`.

## Known failure modes

### React escapes `&` to `&amp;` in attributes

This cost multiple wasted commits with AvantLink. Their tag contained
`?mode=js&authResponse=...`; the served HTML had `?mode=js&amp;authResponse=...`.
That is **valid HTML** — browsers decode it and the script runs — but their verifier
did a literal string match and never found it.

Symptom: an error about being unable to *locate* the tag, while the tag is plainly
visible in the page source.

Check:
```
curl -s https://tsangszechun.com/ | grep -c 'ISSUED&SUBSTRING'      # want 1
curl -s https://tsangszechun.com/ | grep -c 'ISSUED&amp;SUBSTRING'  # want 0
```

Fix: React cannot be told to stop escaping, so rewrite it after the build. Add a
script that rewrites the escaped ampersand back, **scoped to that one URL** so it
cannot touch anything else, and wire it into `build` so CI cannot skip it:

```jsonc
"build": "gatsby build && node scripts/fix-<network>-tag.js",
"deploy": "npm run build && echo tsangszechun.com > ./public/CNAME && gh-pages -d public -b master",
```

The script reads every `.html` under `public/`, replaces the escaped form with the
literal form, and logs which files it patched. Delete it once approved.

### Non-standard attributes fail typecheck

impact.com's snippet uses `value=` on a `<meta>` rather than the standard `content=`.
TypeScript rejects it: `Property 'value' does not exist on type MetaHTMLAttributes`.

Do **not** "correct" it to `content=` — their verifier may be matching on `value`.
Spread it in instead, then confirm React actually emitted it:

```tsx
<meta
  name="impact-site-verification"
  {...{ value: "..." }}
/>
```

### Gatsby adds `data-gatsby-head="true"`

Tags rendered through the Head API get this extra attribute, and React normalizes
single quotes to double. Any real HTML parser is fine with both, but a byte-level
matcher may not be.

If verification fails and the tag is otherwise correct, this is the next suspect.
Fix with the same post-build rewrite pattern as above.

### Protocol is rarely the problem

Both `http://` and `https://` were tried against AvantLink before the real cause was
found. An `http://` script on an `https://` page *is* blocked by browsers as mixed
content, so it will not execute client-side — but if the verifier does server-side
string matching, that is irrelevant. **Confirm the bytes match before touching the
protocol.**

## Removing a tag after approval

Networks instruct removing the tag once confirmed. **Wait for final approval, not
just automated verification** — staff review can take days and they may re-check.

Remove in one commit:
- the tag from the Head export
- any `scripts/fix-<network>-tag.js` workaround
- the `build`/`deploy` script changes that invoked it

Then `npm run clean && npm run build` and confirm the marker is gone from
`public/*.html`, plus `npm run typecheck`.

## Status

Record application IDs and outcomes in
`/Users/jackytsang/Obsidian/Side Project/Project Affiliate.md`. That note tracks
which networks have been applied to and why.

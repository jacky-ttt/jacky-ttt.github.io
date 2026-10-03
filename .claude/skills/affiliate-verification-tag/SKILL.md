---
name: affiliate-verification-tag
description: Add, verify, or remove an affiliate network's site-ownership verification tag (AvantLink, impact.com, AWIN, CJ, or similar). Use when a network issues a <script> or <meta> snippet to prove ownership of tsangszechun.com, when such verification is failing despite the tag looking correct in the page source, or when removing a tag after an application is approved.
---

# Affiliate network verification tags

Affiliate networks gate applications behind a site-ownership check: they issue an
HTML snippet, you install it, their crawler fetches the page and looks for it.

**The core hazard: the snippet you paste is not necessarily the snippet that gets
served.** Astro serializes the template, and some forms of a tag come out rewritten.
Verification failures are almost never "the tag is missing" — they are "the served
bytes do not match what the network issued."

Always verify against the **built output** (`dist/`), never the source file.

## Where the tag goes

`<head>` lives in `src/layouts/Layout.astro`, which both pages share. Networks
normally only want the tag on the home page, so give the layout a named slot and
fill it from `src/pages/index.astro`:

```astro
<!-- Layout.astro, inside <head> -->
<slot name="head" />

<!-- index.astro, inside <Layout> -->
<Fragment slot="head">
  <!-- <network> site ownership verification. Remove once approved. -->
  <meta name="..." content="..." />
</Fragment>
```

Put it directly in `Layout.astro` only if the network asks for site-wide.

## How Astro rewrites snippets (tested on Astro 7.3)

| Snippet form                             | Served as                                               |
| ---------------------------------------- | ------------------------------------------------------- |
| Literal attribute `src="...?a=1&b=2"`    | Unchanged — `&` stays literal                           |
| Expression attribute `src={url}`         | `&` escaped to `&amp;` — **avoid**                      |
| Single-quoted attributes `content='x'`   | Normalized to double quotes                             |
| `<script>` without `is:inline`           | Bundled/rewritten by Astro — **always add `is:inline`** |
| `<meta value="...">` (non-standard attr) | Emitted as-is, but fails `astro check`                  |

So: paste attributes as literals, never via `{...}` expressions, and add `is:inline`
to every third-party `<script>`.

For non-standard attributes (impact.com uses `value=` instead of `content=` on its
`<meta>`), do **not** "correct" it to `content=` — their verifier may match on
`value`. Spread it in to satisfy the type checker; the output is byte-identical:

```astro
<meta name="impact-site-verification" {...{ value: "..." }} />
```

## Procedure

1. **Add the tag** as above, with a comment naming the network and saying it is
   removable once approved.

2. **Type-check:**

   ```
   npm run check
   ```

3. **Clean build** — a stale `dist/` will lie to you:

   ```
   rm -rf dist && npm run build
   ```

4. **Verify the built bytes** against what the network issued:

   ```
   grep -o '<meta[^>]*NETWORK-MARKER[^>]*>' dist/index.html
   grep -o '<script[^>]*NETWORK-MARKER[^>]*></script>' dist/index.html
   ```

   Compare character by character with the snippet from their email. Check the
   token/UUID survived intact, and confirm it is inside `<head>`:

   ```
   python3 -c "
   s=open('dist/index.html').read()
   t=s.find('NETWORK-MARKER'); h=s.find('</head>')
   print('INSIDE HEAD' if 0 < t < h else 'PROBLEM', '| occurrences:', s.count('NETWORK-MARKER'))
   "
   ```

5. **Commit and push to `main`.** The GitHub Action builds and deploys to GitHub
   Pages in a few minutes. Nothing verifies until it is live.

6. **Confirm on the live site** before triggering their check:

   ```
   curl -s https://tsangszechun.com/ | grep -o '<meta[^>]*NETWORK-MARKER[^>]*>'
   ```

7. **Run the network's verification**, then note the outcome in
   `/Users/jackytsang/Obsidian/Side Project/Project Affiliate.md`.

## Known failure modes

### Escaped `&` in a URL

This cost multiple wasted commits with AvantLink on the old Gatsby site: their tag
contained `?mode=js&authResponse=...` and the served HTML had
`?mode=js&amp;authResponse=...`. That is **valid HTML** — browsers decode it — but
their verifier did a literal string match and never found it.

On Astro this only happens if the URL is passed as an `{expression}`. Use a literal
attribute. Check:

```
curl -s https://tsangszechun.com/ | grep -c 'ISSUED&SUBSTRING'      # want 1
curl -s https://tsangszechun.com/ | grep -c 'ISSUED&amp;SUBSTRING'  # want 0
```

### Protocol is rarely the problem

Both `http://` and `https://` were tried against AvantLink before the real cause was
found. An `http://` script on an `https://` page _is_ blocked by browsers as mixed
content, so it will not execute client-side — but if the verifier does server-side
string matching, that is irrelevant. **Confirm the bytes match before touching the
protocol.**

## Removing a tag after approval

Networks instruct removing the tag once confirmed. **Wait for final approval, not
just automated verification** — staff review can take days and they may re-check.

Remove the tag (and the `head` slot if nothing else uses it) in one commit, then
`rm -rf dist && npm run build`, confirm the marker is gone from `dist/*.html`, and
run `npm run check`.

## Status

Record application IDs and outcomes in
`/Users/jackytsang/Obsidian/Side Project/Project Affiliate.md`. That note tracks
which networks have been applied to and why.

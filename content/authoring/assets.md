---
description: Add your own stylesheets, scripts, and static files — they're copied,
  fingerprinted, and linked automatically.
icon: fa-solid fa-paintbrush
menu: docs
title: Custom CSS & JS
weight: 23
---

# Custom CSS & JS

## Root stylesheets and scripts

Any `.css` or `.js` file in your project root is copied into the build, given a
per-build fingerprint, and linked automatically — stylesheets in `<head>`,
scripts (deferred) before `</body>`:

```bash
my-docs/
  custom.css     ->  /custom-<sha>.css, linked on every page
  analytics.js   ->  /analytics-<sha>.js, loaded on every page
```

No configuration needed. The scaffold includes a `custom.css` you can edit.

## Static files

Anything under `static/` or `public/` is copied into the build root, preserving
the authored path but emitting cacheable files with a per-build fingerprint:

```bash
my-docs/
  static/
    img/logo.svg   ->  /img/logo-<sha>.svg
    fonts/ui.woff2 ->  /fonts/ui-<sha>.woff2
```

Reference them with their stable authored paths (`/img/logo.svg`); aardvark
rewrites generated HTML, CSS, JS, manifests, and component props to the
fingerprinted output URL. For dynamic template values, use
`{% raw %}{% asset('/img/logo.svg') %}{% endraw %}`.

## Fingerprinted output

Authors write stable URLs; builds publish fingerprinted asset URLs. For
example, keep writing `/img/logo.png` in Markdown, HTML, CSS, JS strings, or
component props. `vark build` rewrites those references to the emitted file,
such as `/img/logo-<sha>.png`, preserving any query string or fragment.

The token is one value shared across the whole build — the current short git
`HEAD` SHA. When the build can't read git (for example a container build without
the `.git` directory), aardvark uses the commit SHA from the `AARDVARK_BUILD_SHA`
environment variable if you set it, otherwise a single content hash of your
project sources. Because every asset in a build shares one token, a reference and
the file it points at always rotate together, so an aggressively cached
stylesheet can never end up pointing at an image URL a later build renamed away.
Fingerprinted files are emitted only at their fingerprinted paths — there is no
legacy `/img/logo.png` copy and no redirect — so your static host or CDN can
cache those URLs aggressively.

This also applies to `.txt` and `.json` files you place in `static/` or
`public/`. If another site links directly to `/release-notes.txt` or
`/feed.json`, that stable URL will not exist after the build; keep externally
linked documents as authored pages or generated discovery surfaces when the URL
itself needs to stay permanent.

Route and discovery files stay stable instead of fingerprinted: page HTML,
`_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `.well-known/**`,
`auth.md`, `llms*.txt`, `metadata.json`, `search-index.json` (and `.gz`),
page `.md` siblings, encrypted `.enc` payloads, and internal config documents.
Serve those with normal revalidation so readers and agents see fresh metadata
after a deploy.

## Theme assets

The theme's own CSS/JS live in `themes/vark/` and are emitted under
`/_aardvark/` with the same fingerprinting (for example,
`/_aardvark/theme-<sha>.css`). See [Theme & customization](/theming/) to change
them.

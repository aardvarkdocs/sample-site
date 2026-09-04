---
title: Social unfurl cards (Open Graph)
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [seo]
nav: false
noindex: true
---

# Social unfurl cards (Open Graph)

Every page can render a branded **1200×630 Open Graph card** — your logo over a diagonal
gradient of the theme's primary color, with the page's breadcrumb, title and description —
which becomes that page's `og:image`.

Cards are opt-in: set `og: {generate: true}` and an absolute `baseUrl`, since a social
scraper needs an absolute URL to fetch. They are pure build output, written fresh under
`_aardvark/og/` on every `vark build` and never committed, and `vark dev` skips them entirely
so the editing loop stays fast — which also means an unfurl preview won't resolve against the
dev server. A page can override its card with `image:` in front matter.

---
title: Anatomy of a Mantine island
description: How a Markdown tag becomes a prerendered, rehydrated React component — the full journey from source to interactive widget.
date: 2026-06-18
image: /diamond-wave-bg.svg
taxonomy:
  - name: blog
    leftnav: dates
    tags: "components, engineering"
    authorName: Aardvark engineering
    authorAvatar: /img/sample-square.svg
    badgeText: Deep dive
    tagCloud: true
---

# Anatomy of a Mantine island

Every interactive widget on this site — the cards, the accordions, the changelog timeline —
starts life as a tag in a Markdown file. This post follows one of them from source to
screen.

An island begins as either a tag like `{% raw %}{% card %}{% endraw %}` or a
`component('aardvark', 'card', …)` call in a `{% raw %}{% %}{% endraw %}` block — one implementation behind
both. At build time, the tag doesn't render HTML directly; it emits a **placeholder**: a
wrapper element carrying a `data-aardvark-island` marker naming the component, with the
props serialized alongside. That marker is also your styling hook — CSS like
`[data-aardvark-island="Card"]` targets every rendered card on the site.

The client side is a single islands bundle, built with esbuild, that scans the page for
those markers on load and mounts the matching React component — real
[Mantine](https://mantine.dev) components, with the theme palette seeded from your site's
SCSS colors.

The interesting part is what happens *between* build and load. With `islands.ssr` (on by
default since 0.4.0), the build prerenders each SSR-capable island to **static HTML** using
Node, esbuild, and linkedom — so the actual widget markup is baked into the `.html` files. (The
browser-only ones — most community widgets, the native map, and any component library configured
without SSR — mount on the client instead, and do ship as an empty div.) That
matters for three audiences: crawlers see real content instead of an empty div, no-JS
readers get a usable page, and everyone else gets a correct first paint instead of a layout
shift. When the client bundle loads it **hydrates that markup in place** rather than
clearing it: the baked DOM is reused, adopted by React, and the island becomes interactive
without ever blanking or reflowing.

Three consequences of that design are worth carrying around:

- **A prerendered island must render the same thing twice.** The bake and the browser's
  first render have to agree, so an island whose output depends on the clock, a random
  number, or the machine's environment will disagree with its own baked markup. Keep that
  kind of thing in an effect, which runs after hydration.
- **Some islands are deliberately client-only.** The community widgets (the animated ones,
  and the map) bake nothing at all — the build leaves their spot empty and the client mounts
  them straight after hydration. That is why they flash in on load while a Mantine card
  doesn't.
- **The bake is cached, the page render isn't.** Since 0.3.3 each page's baked markup is
  stored under `.aardvark-cache/prerender/` and keyed by the page's HTML plus the toolchain
  behind it, so a rebuild only sends changed pages to Node — and a page holding no island
  skips the prerenderer entirely. Deleting the cache directory just costs you one slow
  build.

The result is a static site that ships real HTML and *also* behaves like a React app where
it counts. Browse the [component library](/components/) to see every island available, or
read the [changelog entry](/changelog/) that introduced them.

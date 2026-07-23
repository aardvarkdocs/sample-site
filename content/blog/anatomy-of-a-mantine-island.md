---
title: Anatomy of a Mantine island
description: How a Markdown tag becomes a prerendered, rehydrated React component — the full journey from source to interactive widget.
date: 2026-06-18
image: /diamond-wave-bg.svg
taxonomy:
  - name: blog
    leftnav: dates
    tags: "components, engineering"
    authorName: aardvark engineering
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

The interesting part is what happens *between* build and load. With `islands.ssr: true`
(this site has it on), the build prerenders each island to **static HTML** using Node,
esbuild, and linkedom — so the actual widget markup is baked into the `.html` files. That
matters for three audiences: crawlers see real content instead of an empty div, no-JS
readers get a usable page, and everyone else gets a correct first paint instead of a
layout shift. When the client bundle loads, it re-renders the same component over that
markup, and the island becomes interactive.

The result is a static site that ships real HTML and *also* behaves like a React app where
it counts. Browse the [component library](/components/) to see every island available, or
read the [changelog entry](/changelog/) that introduced them.

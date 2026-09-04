---
title: Interactive Mantine islands
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [components, performance]
nav: false
noindex: true
---

# Interactive Mantine islands

Embed any **Mantine** [component](/components/) as an interactive island straight from
Markdown. Each SSR-capable island is prerendered to static HTML at build time — so crawlers,
no-JS readers and the first paint all get real markup — and then hydrated in place on the
client for full interactivity. The browser-only ones — most community widgets, the native map,
and any component library configured without SSR — mount on the client instead; the context
menu, data grid and lightbox are prerendered like the built-ins.

Prerendering became the default in 0.4.0; `islands: {ssr: false}` (or a bare `islands: false`)
opts out, which keeps the client bundle so islands still mount on load. That is not the same
as building with `--no-bundle` or without the islands toolchain: such a build ships no client
bundle at all, and island widgets do not render.

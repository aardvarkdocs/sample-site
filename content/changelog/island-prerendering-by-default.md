---
title: Island prerendering is on by default
date: 2026-08-30
version: "0.4.0"
taxonomy:
  - name: changes
    tags: [components, performance]
nav: false
noindex: true
---

# Island prerendering is on by default

A site with no `islands` block in `aardvark.config.yaml` now bakes each SSR-capable island's
rendered widget HTML into its static pages at build time. Crawlers and readers without
JavaScript see real markup, the first paint doesn't shift, and the client hydrates that markup
on load — exactly what `islands: {ssr: true}` always did, now without asking. Islands that are
browser-only by design are unaffected and still mount in the client: most of the community
widgets, the native map, and any component library configured without SSR. The context menu,
data grid and lightbox are the exceptions — they stay prerendered.

Set `islands: {ssr: false}` (or a bare `islands: false`) to opt back out. That keeps the
client bundle, so islands still mount on load; you lose the baked markup, not the
interactivity.

One thing this change does *not* alter: a build without the islands toolchain — Node and the
JS dependencies behind it — is not that fallback and never was. It ships no client bundle at
all, so it warns and island widgets don't render. See
[Components and snippets](/authoring/components-and-snippets/).

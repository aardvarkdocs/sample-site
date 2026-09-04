---
title: Faster dev-loop rebuilds
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [build, performance]
nav: false
noindex: true
---

# Faster dev-loop rebuilds

`vark dev` keeps edit-loop rebuilds fast by skipping Open Graph card rendering — then the
build's heaviest phase, and one that only matters when you ship. Full `vark build` output is
unchanged. Publish-only phases added since are skipped in dev the same way: the whole-site
PDF, from 0.1.7.

The two skips have a visible consequence while you author: the `og:image` meta tag still
points at `/_aardvark/og/…`, which only exists after a real build, so a social-preview unfurl
and the Download-PDF menu item don't resolve against the dev server. Verify both with
`vark build`.

`vark dev` still re-renders every page on every save — [Why Aardvark still re-renders every
page](/blog/how-incremental-builds-work/) covers the design thinking, and what *is* cached.

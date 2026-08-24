---
title: Faster dev-loop rebuilds
date: 2026-06-02
version: "0.1.0"
taxonomy:
  - name: changes
    tags: [build, performance]
nav: false
noindex: true
---

# Faster dev-loop rebuilds

`vark dev` keeps edit-loop rebuilds fast by skipping Open Graph card rendering —
then the build's heaviest phase, and one that only matters when you ship. Full `vark
build` output is unchanged. Publish-only phases added since are skipped in dev the
same way: the whole-site PDF, from 0.1.7. [Why Aardvark still re-renders every
page](/blog/how-incremental-builds-work/) covers the design thinking.

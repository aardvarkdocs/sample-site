---
title: Faster dev-loop rebuilds
date: 2026-05-28 09:15
taxonomy:
  - name: changes
    tags: [build, performance]
nav: false
noindex: true
---

# Faster dev-loop rebuilds

`vark dev` keeps edit-loop rebuilds fast by skipping the build's heaviest publish
phases — Open Graph card rendering and the whole-site PDF — which only matter when
you ship. Full `vark build` output is unchanged. [Why aardvark still re-renders
every page](/blog/how-incremental-builds-work/) covers the design thinking.

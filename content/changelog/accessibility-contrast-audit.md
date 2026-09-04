---
title: Build-time accessibility contrast audit
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [a11y, build]
nav: false
noindex: true
---

# Build-time accessibility contrast audit

`vark build` runs a **WCAG color-contrast audit** over the theme palette compiled from your
`theme.scss` — light *and* dark — and reports every pair that lands below the level you asked
for, so a regression shows up at build time instead of in a reader's browser.

The audit is deliberately **non-fatal**: it warns and the build finishes, because a contrast
miss is a design call to make on purpose, not a reason to block a deploy. It runs by default;
`a11y: false` in `aardvark.config.yaml` silences it, and `a11y: {contrastLevel: AAA}` raises
the bar from AA (4.5:1) to AAA (7:1).

Read more under [Accessibility](/accessibility/).

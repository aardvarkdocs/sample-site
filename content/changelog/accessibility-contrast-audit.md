---
title: Build-time accessibility contrast audit
date: 2026-04-19
taxonomy:
  - name: changes
    tags: [a11y, build]
nav: false
noindex: true
---

# Build-time accessibility contrast audit

`vark build` now runs a non-fatal **WCAG color-contrast audit** over your theme
colors (light *and* dark) and reports any pair that falls below the configured level, so
regressions surface before they ship. Read more under [Accessibility](/accessibility/).

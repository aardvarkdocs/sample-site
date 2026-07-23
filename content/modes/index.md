---
description: A page's mode front matter toggles the left nav, the right table of contents,
  and the content width. Live demos of every mode.
heading: Layout modes
heading-icon: fa-solid fa-table-columns
icon: fa-solid fa-table-cells-large
menu: docs
title: Overview
weight: 30
---

# Layout modes

Every page ships with a left navigation sidebar and a right-hand "On this page"
table of contents (TOC). When a page needs something different — more width, less
chrome, or an edge-to-edge canvas — set `mode` in its front matter.

> **This page uses the default layout.** Nav on the left, TOC on the right,
> content in a comfortable reading column. The pages linked below each switch to
> a different `mode` so you can see the difference immediately.

## The modes

| `mode` | Left nav | Right TOC | Content width |
| --- | :---: | :---: | --- |
| _(unset)_ / `default` | ✓ | ✓ | standard reading column |
| `wide` | ✓ | — | wider — good for big tables |
| `full` | — | — | wider, centered |
| `toc-only` | — | ✓ | wider — the hidden nav frees the room |
| `uncapped` | — | — | full-bleed: edge to edge, no width cap or padding |

It's a single front-matter line:

```yaml
---
title: Release dashboard
mode: wide
---
```

## See each mode live

- [**Wide**](/modes/wide/) — keeps the nav, drops the TOC, widens the column for big tables.
- [**Full**](/modes/full/) — drops both sidebars; centered, distraction-free reading.
- [**TOC only**](/modes/toc-only/) — drops the nav, keeps the TOC for in-page jumps.
- [**Uncapped**](/modes/uncapped/) — full-bleed graphics, corner to corner.

## Good to know

- Unrecognized values fall back to the default layout — a typo never breaks a page.
- Modes shape the **desktop** layout and compose with the responsive breakpoints:
  below 1100px the TOC hides and below 760px the nav hides, in every mode.
- The site header stays put in all modes, so there's always a way back.

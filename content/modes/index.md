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
| _(unset)_ / `default` | ✓ | ✓ | standard reading column (820px) |
| `wide` | ✓ | — | wider (1100px) — good for big tables |
| `full` | — | — | wider (1100px), centered |
| `toc-only` | — | ✓ | wider (1100px) — the hidden nav frees the room |
| `uncapped` | — | — | full-bleed: edge to edge, no width cap or padding |

The widths are the default theme's `--aardvark-content-max` (820px) and
`--aardvark-content-max-wide` (1100px), set at the top of `themes/vark/theme.scss` —
change them there to retune every mode at once.

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

- Values are matched case-insensitively; an unrecognized value (and `default`) gives
  the default layout — a typo never breaks a page.
- `uncapped` also drops the breadcrumb / page-action bar above the content (a
  full-bleed hero has nothing to sit under). The feedback widgets at the bottom of an
  uncapped page keep the 1100px cap so they stay readable.
- Modes shape the **desktop** layout and compose with the responsive breakpoints: at
  1100px and below the TOC hides in every mode, and at 760px and below the left nav
  becomes the hamburger drawer — on `full`, `toc-only`, and `uncapped` pages too, so
  the menu (and the header actions that move into the drawer) stay reachable on a
  phone.
- The site header stays put in all modes, so there's always a way back.

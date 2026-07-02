---
description: A demo of mode uncapped — content runs edge to edge with no width cap
  and no page padding, for full-bleed landing-page graphics.
icon: fa-solid fa-maximize
menu: docs
mode: uncapped
title: Uncapped mode
weight: 34
---

<div style="background: linear-gradient(135deg, #7048e8, #9775fa); color: #fff; padding: 110px 24px; text-align: center;">
<div style="font-size: .8rem; letter-spacing: .18em; text-transform: uppercase; opacity: .85;">mode: uncapped</div>
<div style="font-size: 2.8rem; font-weight: 800; margin: 10px 0 16px; line-height: 1.1;">Edge to edge</div>
<div style="max-width: 620px; margin: 0 auto; font-size: 1.15rem; opacity: .95;">This hero reaches both edges of the viewport — no content width cap, no page padding. Ideal for landing pages and full-width graphics.</div>
</div>

<div style="display: flex; flex-wrap: wrap;">
<div style="flex: 1 1 200px; background: #0ca678; color: #fff; padding: 56px 24px; text-align: center; font-weight: 700;">No max-width</div>
<div style="flex: 1 1 200px; background: #1098ad; color: #fff; padding: 56px 24px; text-align: center; font-weight: 700;">No side padding</div>
<div style="flex: 1 1 200px; background: #7048e8; color: #fff; padding: 56px 24px; text-align: center; font-weight: 700;">No sidebars</div>
</div>

<div style="max-width: 760px; margin: 0 auto; padding: 56px 40px;">

## What you're looking at

[↑ All layout modes](/modes/)

This page sets `mode: uncapped`. Like [`full`](/modes/full/) it hides both the nav
and the TOC — but it goes further: it also removes the content's max-width **and**
the page's padding. That's why the hero and the colored band above run corner to
corner, with no gutter on either side.

Because there's no padding, **you** own the spacing inside an uncapped page. The
bands above set their own `padding`; this explanatory section is wrapped in a
centered container with its own `max-width` and padding so the prose stays
readable. Mix full-bleed sections with contained ones however your design needs.

## When to use it

- Landing and marketing pages with full-width hero imagery or video.
- Dashboards or visualizations that should fill every available pixel.
- Any page where the content *is* the graphic, edge to edge.

For a chromeless page that still keeps a readable, centered text column, reach for
[`full`](/modes/full/) instead.

</div>

---
description: A demo of mode full — both the nav and the TOC are hidden for centered,
  distraction-free reading.
icon: fa-solid fa-expand
menu: docs
mode: full
title: Full mode
weight: 32
---

# Full mode

[↑ All layout modes](/modes/)

> **This page uses `mode: full`.** Both the left nav and the right TOC are gone.
> What's left is a single centered column — nothing in the margins competing for
> attention. The site header stays, so you can always navigate away.

Some pages read best with nothing around them: a launch announcement, a release
note, a long-form guide, an architecture write-up. `full` strips the chrome and
centers the content at a comfortable measure so the words carry the page.

## Why drop the chrome

A persistent sidebar is great for browsing a doc set, but on a page someone has
*arrived at* to read end-to-end, it's visual noise. Removing it — and the TOC —
narrows the focus to one thing. The content still uses a capped width (wider than
the default reading column, but not edge-to-edge), because long lines of prose
are tiring to read.

## When to reach for it

- Announcements and changelogs that are read top to bottom.
- Marketing or overview pages that want a clean canvas but still need readable text.
- Any page where the global nav is a distraction rather than a help.

## When not to

If readers need to jump between many sections of the same page, prefer
[`toc-only`](/modes/toc-only/) — it drops the nav but keeps the "On this page"
list. And if you want true edge-to-edge graphics, use [`uncapped`](/modes/uncapped/).

## Still reachable

Notice the header bar above is untouched: the logo, the tabs, search, and the
light/dark toggle all stay. `full` removes the page's *sidebars*, not the site's
navigation entirely — so a reader is never stranded.

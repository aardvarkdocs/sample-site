---
title: Why aardvark rebuilds every page (for now)
description: The edit loop stays fast by skipping the heavy publish phases — and per-page incremental skipping is a harder promise than it looks.
date: 2026-06-02
taxonomy:
  - name: blog
    leftnav: dates
    tags: [build, performance]
    authorName: aardvark engineering
    badgeText: Engineering
    tagCloud: true
---

# Why aardvark rebuilds every page (for now)

Here's an honest engineering answer to a question we get: does `vark` do incremental
builds? Today, no — every build renders every page. The edit loop stays fast a different
way: `vark dev` skips the build's heaviest phases entirely (Open Graph card rendering and
the whole-site PDF, which only matter when you publish), and the render pipeline itself is
lean enough that a full re-render of a mid-sized site lands in seconds.

Why not skip unchanged pages? Because on a docs site, "unchanged" means much more than
"the Markdown file has the same bytes."

A rendered aardvark page is a function of many inputs. The obvious one is the page's own
source — prose, front matter, the `{% %}` tags inside it. But pages also read **shared
inputs**: the site config (a renamed tab changes every page's header), the theme (one SCSS
variable recolors the whole site), data files loaded through templating, snippets and
includes, and the navigation itself — adding one page inserts a sidebar entry on all of its
siblings. Skip a page whose *own* file is unchanged while one of those shared inputs moved,
and you ship a stale build that looks fine until someone notices the sidebar is missing an
entry.

So any future page cache has to be conservative: a page can only be skipped when everything
that could affect its output is accounted for, and anything site-wide must invalidate
broadly rather than cleverly. That's a deliberate trade. A cache that is occasionally too
eager to rebuild costs you seconds; a cache that is ever too eager to *skip* costs you
correctness, and a docs generator that sometimes publishes stale pages is worse than a slow
one. Until we can make the skip provably safe, rebuilding everything — and keeping
"everything" cheap — is the honest default.

The dev-loop details live in the [`dev` command docs](/cli/), and the
[changelog](/changelog/) has the release notes.

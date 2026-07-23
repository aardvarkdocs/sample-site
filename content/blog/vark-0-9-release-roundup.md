---
title: vark 0.9 release roundup
description: The 0.9 release in one read — a self-generating CLI reference, a faster dev loop, and the best of the 0.8 line.
date: 2026-05-30
image: /landscape.jpg
taxonomy:
  - name: blog
    leftnav: dates
    tags: [release, cli]
    authorName: The aardvark team
    authorAvatar: /favicon.svg
    badgeText: Release
    tagCloud: true
---

# vark 0.9 release roundup

vark 0.9.0 landed this week. Here's what's in it, plus the highlights from the 0.8 line
that led up to it — the full timeline is always on the [changelog](/changelog/).

**The CLI reference now writes itself.** The [CLI reference](/cli/) page is generated
straight from `vark --help`: every flag and subcommand is documented from its own
`--help` output, so the docs stay in lockstep with the code. No hand-maintained option
tables, no drift — if a flag ships, its documentation ships with it. It's the docs-tooling
equivalent of eating your own dog food, and it's how this site's own CLI page is built.

**The edit loop got faster.** `vark dev` keeps rebuilds tight by skipping the build's
heaviest phases — Open Graph card rendering and the whole-site PDF — which only matter
when you publish. (Full per-page incremental skipping is a promise we're deliberately not
making yet; we wrote up why in
[Why aardvark rebuilds every page (for now)](/blog/how-incremental-builds-work/).)

**And from the 0.8 series**, in case you missed it:

- **Standardized code blocks** — every code block on the page, in the file-tree modal, and
  in OpenAPI samples now shares one **Copy** and **Download** affordance.
- **OpenAPI search indexing** (0.8.2) — operation and schema descriptions from your spec
  are part of the search index, so readers searching for an endpoint's behavior land on
  the right reference section.
- **Ask AI** (0.8.0) — the optional reader assistant that answers questions grounded in
  your docs. We introduced it properly in
  [its launch post](/blog/introducing-ask-ai/).

Upgrade with your package manager of choice, and if anything regresses, the
[changelog](/changelog/) is the quickest way to see what moved.

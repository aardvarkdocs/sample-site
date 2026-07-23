---
title: Multi-language docs in practice
description: A working setup for translated docs — per-language content directories, an automatic language picker, and model-filled translations grounded in a glossary.
date: 2026-04-10
image: /img/sample-landscape.svg
taxonomy:
  - name: blog
    leftnav: dates
    tags: [i18n, howto]
    authorName: The aardvark team
    authorAvatar: /favicon.svg
    badgeText: How-to
    tagCloud: true
---

# Multi-language docs in practice

Since 0.6.0, aardvark serves translated sites from per-language directories — and this site
is a live example: the English content lives in `content/`, the French mirror in
`content-fr/`, served under `/fr` with an automatic language picker in the header. Here's
the setup, start to finish.

First, declare your languages in `aardvark.config.yaml`:

```yaml
languages:
  base:
    code: en
    label: English
  others:
    - code: fr
      label: Français
      source: content-fr
```

That's the whole routing story. The base language builds at the site root; each additional
language builds under its code prefix, and the picker appears on every page.

The harder problem is keeping translations **filled and fresh**, and that's where
`vark build --translate` comes in. It compares the translated tree against the base
content and fills in pages that are *missing or changed* — not the whole site, every time —
using a model, with the results written into your language directory as ordinary Markdown
you can review and edit. A `--retranslate-all` flag exists for when you want a clean sweep.

Two things keep the output trustworthy. Unchanged pages are skipped via a
**content-hash cache**, so a page translated once isn't re-translated until its source
(or the glossary) changes. And the site's [definitions glossary](/definitions/) feeds the
translator, so your product terms — the words you *don't* want localized creatively —
survive intact.

Treat the translated tree like any other content: it's plain Markdown in your repo, it
diffs in review, and hand edits are kept for any page whose source hasn't changed — a
page whose source *does* change is re-translated wholesale. One caveat: the
"unchanged" bookkeeping lives in the local build cache, so on a fresh machine (or after
clearing the cache) a `--translate` run re-translates everything — commit your edits and
review that run's diff rather than letting it land blind. Details are in the
[CLI reference](/cli/) and the [changelog entry](/changelog/).

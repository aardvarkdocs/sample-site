---
title: Multi-language sites
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [i18n, build]
nav: false
noindex: true
---

# Multi-language sites

Serve translated content from per-language directories with an automatic language picker.
The base language builds at the site root and every other language under its code prefix, so
`content-fr/` becomes `/fr/…` with no routing to write.

[`vark build --translate`](/cli/) fills pages that are missing or changed with a model,
grounded in the site's definitions glossary; unchanged pages are skipped via a content-hash
cache, and `--retranslate-all` forces a clean sweep. Two things to know before the first run:
translation goes through the metered gateway, so it needs your `AARDVARK_SECRET_KEY` and it
costs money, and the "unchanged" bookkeeping lives in the local build cache — on a fresh
checkout, or after deleting `.aardvark-cache/`, a `--translate` run re-translates everything.
Translations are written into your language directory as ordinary Markdown you can review,
edit and commit.

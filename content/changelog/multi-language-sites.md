---
title: Multi-language sites
date: 2026-03-21
version: "0.6.0"
taxonomy:
  - name: changes
    tags: [i18n, build]
nav: false
noindex: true
---

# Multi-language sites

Serve translated content from per-language directories with an automatic language
picker. [`vark build --translate`](/cli/) fills missing or changed pages with a
model, grounded in the site's definitions glossary; unchanged pages are skipped
via a content-hash cache.

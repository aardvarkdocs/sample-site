---
description: Publish multiple documentation versions side by side — the latest at the
  site root, older releases under /vX/ — with a header version picker, per-version search,
  and canonical→latest SEO. A snapshot-in-tree, single-build model.
heading: Features
heading-icon: fa-solid fa-puzzle-piece
icon: fa-solid fa-code-branch
menu: docs
title: Versioning
weight: 55
---

# Versioned documentation

aardvark can publish **multiple versions of your docs at once** — the latest release
at the site root and older releases under a `/vX/` prefix — with a header version
switcher, version-scoped [search](/search/), and SEO that keeps the latest version as
the canonical surface.

Versioning is **opt-in by subtree**: you choose which sections are versioned (say
`/guide` and `/api`), and everything else — your landing page, blog, changelog — stays
**global**, a single shared copy across versions.

## How it works

Each older version is a **frozen snapshot committed to your repo** under
`versions/<id>/`, and the whole site builds in one pass (no separate per-version
builds). The current docs stay in `content/` and are served, unprefixed, at the root.
It's the same model Docusaurus uses — and it reuses the exact machinery that powers
multi-language sites, so a version is just a second URL prefix alongside the language
one.

## Enabling it

Declare which subtrees are versioned in `aardvark.config.yaml`. Nothing is versioned
until you cut your first version, so this block is dormant on its own:

```yaml
versions:
  paths: [/guide, /api]        # only these subtrees are versioned; the rest stay global
  current:
    id: latest
    label: "2.0 (latest)"      # the working copy in content/, served at the root
  released:                    # managed by `vark version cut` (newest first)
    - { id: v1, label: "1.x" }
```

## Cutting a version

When you're ready to freeze the current docs as a release, run:

```bash
vark version cut v1 --label "1.x"
```

This copies each `paths` subtree — across **every language** — into
`versions/v1/<lang>/…` and adds the `released:` entry above. Because aardvark builds
each page's sidebar from its front matter, the snapshot's front matter *is* its frozen
navigation. To see what's configured or to remove a version:

```bash
vark version list
vark version remove v1        # deletes the snapshot dir + config entry
```

Back-port a fix to an old version by editing its files directly under `versions/v1/`.

## URLs

The default version is served unprefixed; older versions get a `/<id>/` prefix. On a
multi-language site the language prefix stays outermost:

| Version | Language | URL |
| --- | --- | --- |
| latest | base | `/guide/intro/` |
| v1 | base | `/v1/guide/intro/` |
| latest | French | `/fr/guide/intro/` |
| v1 | French | `/fr/v1/guide/intro/` |

A **version switcher** appears in the header next to the language picker. Switching
keeps you on the same page in the target version when it exists there, or lands on that
version's home when it doesn't. Older versions also show a persistent "you're viewing an
older version" banner linking to the latest equivalent.

## SEO and search

The latest version is the canonical surface. Older versions are set to `noindex`, their
`<link rel="canonical">` points at the **latest equivalent**, and they're dropped from
`sitemap.xml` and `llms.txt` — so search engines consolidate ranking on the current docs
instead of treating each version as duplicate content. Opt an older version back into the
index with `indexed: true` on its `released:` entry.

The on-page search box is **scoped to the version you're reading** (a reader on `/v1/`
searches within v1), while crawler- and assistant-facing surfaces stay latest-only.

By default the version served at the root is `current` (your working `content/`). Pin a
released version there instead — e.g. keep writing `3.0` under `/latest/` while `2.x`
ships at the root — with `default: v2`.

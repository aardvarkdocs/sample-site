---
description: A demo of mode wide — the left nav stays, the right TOC is dropped, and
  the content column widens to fit big tables.
icon: fa-solid fa-left-right
menu: docs
mode: wide
title: Wide mode
weight: 31
---

# Wide mode

[↑ All layout modes](/modes/)

> **This page uses `mode: wide`.** The left nav is still here, but the right-hand
> TOC is gone and the content column is wider than the default — so the table
> below has room for all its columns without wrapping or scrolling.

`wide` keeps the navigation handy while giving content more horizontal space.
Reach for it on pages built around something wide: comparison matrices, data
tables, wide diagrams, or side-by-side code.

## Static site generators, compared

| Tool | Language | Templating | Interactive UI | Data files | i18n | Search | API reference | Output |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **aardvark** | Python | Real Python in tags | Mantine React islands | JSON / YAML / CSV | Built-in | Built-in | Built-in (OpenAPI) | Static HTML |
| Docusaurus | JavaScript | MDX | Full React app | Plugin | Plugin | Algolia / local | Plugin | Static HTML + SPA |
| MkDocs Material | Python | Jinja2 | Limited | None | Plugin | Built-in (lunr) | Plugin | Static HTML |
| Hugo | Go | Go templates | None | TOML / YAML / JSON | Built-in | Plugin | Plugin | Static HTML |
| Sphinx | Python | reST / Jinja2 | Limited | None | Built-in | Built-in | autodoc | Static HTML + PDF |
| Eleventy | JavaScript | Nunjucks / Liquid / … | BYO | JSON / JS | BYO | BYO | BYO | Static HTML |
| Astro | JavaScript | Astro / JSX | Islands (any framework) | Content collections | i18n routing | Integration | Integration | Static HTML + SSR |

That table has nine columns. In the default reading column it would wrap awkwardly
or force a horizontal scrollbar; in `wide` mode it lays out comfortably.

## How it composes

`wide` only changes the **desktop** layout. Narrow your browser below 1100px and
the TOC is already hidden site-wide, so the page looks like any other — the nav
collapses under 760px as usual.

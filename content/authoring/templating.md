---
description: Use real Python inside {% %} tags, and reference JSON/YAML/CSV data as
  data.file.property.
heading: Authoring
heading-icon: fa-solid fa-pen-nib
icon: fa-solid fa-code
menu: docs
title: Templating & data
weight: 20
---

# Templating & data

Logic in aardvark pages is **real Python**, written inside `{% raw %}{% %}{% endraw %}` tags.

## The two kinds of block

A block that is a **single expression** is evaluated and its result is printed:

{% raw %}
```aardvark
Today's answer is {% 6 * 7 %}.
```
{% endraw %}

A block that is one or more **statements** runs via `exec`; it writes to the page
with `page.print(...)` — the write-mirror of `page.get()`:

{% raw %}
```aardvark
{% 
for fruit in ["apples", "pears", "plums"]:
    page.print("- ", fruit, "\n")
%}
```
{% endraw %}

All blocks on a page share one namespace, so a variable set early is available
later.

## Data files

Drop `.json`, `.yaml`, or `.csv` files in `data/`. Each becomes `data.<stem>`:

- A JSON/YAML object is reachable as `data.file.property`.
- A CSV becomes a **list of row objects** keyed by the header row.

This site ships `data/products.yaml`. Here it is, live:

> There are **{% data.products.count %}** products. The first is
> **{% data.products.items[0].name %}** at ${% data.products.items[0].price %}.

A loop over the same data:

{%
for p in data.products.items:
    page.print(f'- {p.name} (${p.price})\n')
%}

The Markdown for that loop was:

{% raw %}
```aardvark
{%
for p in data.products.items:
    page.print(f'- {p.name} (${p.price})\n')
%}
```
{% endraw %}

## What's in scope

| Name | What it is |
| --- | --- |
| `data` | Your `data/` files (`data.file.prop`) |
| `site` | `site:` block from `aardvark.config.yaml` |
| `config` | The full configuration object |
| `page` | This page's front matter — `page.get(key, default)` reads it; `page.print(*strings)` writes to the page |
| `component(name, **props)` | Embed a React island (see [Components](/authoring/components-and-snippets/)) |
| `snippet(name, **props)` | Alias of `component` for your `snippets/` |
| `components` | Sorted list of every registered component name |
| `print(*args)` | Lower-level page output (always available; the only form inside custom-component bodies, where `page` isn't in scope) |

## Showing literal syntax

To display `{% raw %}{% %}{% endraw %}` without running it, wrap it:

{% raw %}
```aardvark
{% raw %}
this {% will_not_run() %} is shown verbatim
{‍% endraw %}
```
{% endraw %}

## Headings and anchor links

Every heading (levels 1–4) gets a stable `id` and a permalink. Hover a heading
and a link icon fades in to its right — click it to jump to that section and put
the anchor in your address bar to share. The `id` defaults to a GitHub-style
slug of the heading text (`## Heading anchors` → `#headings-and-anchor-links`),
and repeated headings are de-duplicated (`#setup`, `#setup-1`, …).

To pin a short, stable anchor yourself, add `{% raw %}{#custom-id}{% endraw %}`
at the end of the heading line:

{% raw %}
```markdown
## Configuration options {#config}
```
{% endraw %}

links as `#config` (the `{% raw %}{#…}{% endraw %}` marker is removed from the
rendered heading). Custom ids keep working even if you later reword the heading,
so existing links don't break.

## Page layout modes

A page's `mode` front matter controls its layout — toggling the left nav, the
right-hand TOC, and the content width:

```yaml
---
title: Release dashboard
mode: wide
---
```

The options are `wide`, `full`, `toc-only`, and `uncapped` (omit `mode`, or use
`default`, for the standard nav-plus-TOC layout). See **[Layout modes](/modes/)**
for the full table and a live demo of each.

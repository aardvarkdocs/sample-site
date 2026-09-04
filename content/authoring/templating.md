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

Logic in Aardvark pages is **real Python**, written inside `{% raw %}{% %}{% endraw %}` tags.

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

{% callout title="Good to know" severity="info" %}

- **`page.print()` takes strings only** — `page.print(count)` with an integer is a build
  error. Convert with `str()`, use an f-string, or emit the value as its own expression
  block. The plain `print(...)` that's also in scope converts for you.
- **A block ends at the first `%}`**, even one inside a Python string or a `#` comment —
  the rest of the block is silently left out. Mention a tag in a comment as prose
  ("the button tag"), or put the literal in a `{% raw %}{% raw %}{% endraw %}` region
  outside the Python block.
- **Errors name the file and line.** A syntax error or an exception in a block fails
  the build with the page path and the physical line number of the failing code, plus
  the offending snippet. A tag the engine doesn't recognise — a misspelled component
  name, a community component that was removed — is reported as an unknown tag rather
  than as a bare `SyntaxError`.

{% endCallout %}

## Data files

Drop `.json`, `.yaml` (or `.yml`), or `.csv` files in `data/`. Each becomes
`data.<stem>` (subfolders are scanned too, and it's the file name that becomes the key):

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

### How data objects behave

A loaded object is a dotted-access mapping, not a Python `dict`, and that is deliberate:
keys named `items`, `keys`, `values` or `count` are ordinary data (`data.products.items`
above), never shadowed by dict methods. What you get:

- **Dot or subscript**: `data.products.count` and `data.products['count']` are the same
  value. Nested objects work at any depth; lists are plain Python lists, so
  `data.products.items[0].name` and `for p in data.products.items:` both work.
- **A missing key is an error**, not `None`: `data.products.colour` fails the build with
  an `AttributeError` that names the key. Use `data.products.get('colour', 'n/a')` for an
  optional field.
- **`get` is the reserved name.** It's a real method, so a data key literally named `get`
  is reachable only by subscript (`data.file['get']`). It is the only one.
  Iterating an object (`for key in data.products:`) yields its keys; `len()` and `in`
  work as you'd expect.

The same object backs `page` (front matter) and `site` (the `site:` config block), so
`page.get('edition', 'free')` and `site.name` follow these rules too — with `print` as a
third reserved name on `page`.

## What's in scope

| Name | What it is |
| --- | --- |
| `data` | Your `data/` files (`data.file.prop`) |
| `site` | `site:` block from `aardvark.config.yaml` |
| `config` | The full configuration object |
| `page` | This page's front matter — `page.get(key, default)` reads it; `page.print(*strings)` writes to the page |
| `component(name, **props)` | Embed a React island. `component('library', 'Name', …)` reaches a [theme component library](/components/extras/component-libraries/); `component('aardvark', 'tag', …)` reaches a built-in by its tag name (e.g. `component('aardvark', 'card', …)`) so you can build one in a `for` loop. See [Components](/authoring/components-and-snippets/). |
| `snippet(name, **props)` | Alias of `component` for your `snippets/` |
| `asset(path)` | Return the build's fingerprinted URL for a static asset. Use it when constructing URLs dynamically; literal asset URLs are rewritten automatically. |
| `components` | Sorted list of every registered component name — Mantine, built-in islands, your snippets, and each theme-library component as `library:Name` |
| `custom_components` | Sorted list of every tag defined by a `components/*.md` file, built-ins included |
| `taxonomy(name)` / `member_html(member)` | Walk a [taxonomy](/components/extras/taxonomy/) from Python — its `.articles`, `.members`, `.by_tag` — and render a member's body as HTML, to build your own listing pages |
| `print(*args)` | Lower-level page output (always available; the only form inside custom-component bodies, where `page` isn't in scope) |

## Including partials

`{% raw %}{% include '/path/to/file.md' %}{% endraw %}` splices another file into the
page at that point. The partial is rendered through the **same engine and the same
namespace**, so it sees the including page's `page` front matter and every variable set
before it, and its Markdown then renders as part of the page. A path with a leading `/`
resolves against your content root; any other path is relative to the *including* file.
The argument is a Python expression, so `{% raw %}{% include page.partial %}{% endraw %}`
or a conditional works too. A missing file, a path that escapes the content directory, or
an include cycle fails the build.

Name a partial — or any folder of partials — with a leading underscore
(`content/_partials/note.md`): such files are available to `include` but are never
published as pages of their own. Full details and a live example are on the
[Include](/components/extras/include/) page.

## Showing literal syntax

To display `{% raw %}{% %}{% endraw %}` without running it, wrap it in a raw region:

{% raw %}
```aardvark
{% raw %}
this {% will_not_run() %} is shown verbatim
{% endraw %}{% '{' %}% endraw %}
```

Everything between the two markers is emitted verbatim — including the code-fence lines
this page's own examples wrap it in. Raw regions don't nest: the **first** end marker ends
the region, so a raw region can never display its own end marker. That's why the last line
of the sample above is assembled just outside the region, by an expression that prints the
opening brace (`{% raw %}{% '{' %}{% endraw %}`) with the rest following as ordinary text.
An unterminated raw marker is dropped and the rest of the page renders normally.

## Headings and anchor links

Every heading (levels 1–4) gets a stable `id` and a permalink. Hover a heading
and a link icon fades in to its right — click it to jump to that section and put
the anchor in your address bar to share. The `id` defaults to a GitHub-style
slug of the heading text (`## Heading anchors` → `#headings-and-anchor-links`),
and repeated headings are de-duplicated (`#setup`, `#setup-1`, …). The right-hand
**On this page** list shows levels 2 and 3.

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

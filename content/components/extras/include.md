---
title: "Include"
description: "The built-in include tag — splice a shared Markdown partial into a page and let it branch on the including page's front matter. Usage, path rules, and a live example with source."
product: "aardvark Cloud"
edition: pro
---

# Include

A **built-in** tag that renders another file *in place*:

{% raw %}
```aardvark
{% include '/path/to/file.md' %}
```
{% endraw %}

The included file is rendered through the **same `{% raw %}{% %}{% endraw %}`
engine and the same page namespace**, so a partial can read the *including*
page's front matter (`page.*`) — which may hold arbitrary data — and use
ordinary conditional logic to vary what it emits. The result is then parsed as
part of the page's single Markdown pass, so a `.md` partial's headings, lists,
and components all render normally.

## Where partials live

A file whose name (or any parent directory) starts with an underscore — e.g.
`content/_partials/note.md` — is a **partial**: it's available to `{% raw %}{%
include %}{% endraw %}` but is never published as its own page. Drop reusable
fragments under a `_partials/` directory and include them anywhere.

## Path resolution

| Path form | Resolves against | Example |
| --- | --- | --- |
| Leading `/` | the content root (per language) | `{% raw %}{% include '/_partials/note.md' %}{% endraw %}` → `content/_partials/note.md` |
| No leading `/` | the **including file's** directory | `{% raw %}{% include 'note.md' %}{% endraw %}` → a sibling of the current page |

The argument is a Python expression, so the path can be computed — a variable
(`{% raw %}{% include page.partial %}{% endraw %}`) or a conditional
(`{% raw %}{% include '/_partials/pro.md' if page.edition == 'pro' else '/_partials/free.md' %}{% endraw %}`).
A missing file or an include cycle fails the build with a clear error.

## Example

This partial lives at `content/components/_partials/plan-note.md`. It
reads two front-matter fields off whatever page includes it and branches on
them:

{% raw %}
```aardvark
{%
edition = page.get("edition", "free")  # the "edition" field, or "free" if the page omits it
product = page.get("product", "this product")  # the "product" field, or a generic fallback
if edition == "pro":
    plan = "Pro"
    note = "Every feature here is included."
else:
    plan = "Free"
    note = "Some features below require an upgrade."
%}
> **{% product %} — {% plan %} plan.** {% note %}
```
{% endraw %}

Including it:

{% raw %}
```aardvark
{% include '/components/_partials/plan-note.md' %}
```
{% endraw %}

renders, live:

{% include '/components/_partials/plan-note.md' %}

This page's front matter sets `product: "aardvark Cloud"` and `edition: pro`, so the
partial emits the **Pro** line above. A page that set `edition: free` — or
omitted it — would get the other line from the *same* partial, with no change to
the partial itself. That's the point: one shared fragment, varied per page by
the page's own data.

## CSS Selectors

`{% raw %}{% include %}{% endraw %}` adds no wrapper of its own — it splices the partial's
rendered Markdown in place, so the result is exactly the elements the partial emits. Style
those with their own selectors (whatever headings, lists, or component classes the partial
produces); there is no `include` element to target.

## Injecting Attributes

Because `{% raw %}{% include %}{% endraw %}` renders no element of its own, it has no
`attr={…}` channel. To vary what a partial emits per page, branch on the including page's
front matter (`page.*`) inside the partial, as shown above.

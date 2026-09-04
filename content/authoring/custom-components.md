---
description: Define a reusable, parameterized component in components/*.md — a named tag
  with typed params whose body holds your component() calls. A build-time macro, no JS.
icon: fa-solid fa-shapes
menu: docs
title: Custom components
weight: 21.5
---

# Custom components

Chaining `component(...)` calls inline is fine once, but it isn't reusable — the
composition can't be named, shared, or given a typed interface. A **custom
component** fixes that: define it once in a `.md` file under `components/`, with
front matter declaring its **tag name** and **parameters** (each with a type, an
optional default, and whether it's required), and a `{% raw %}{% %}{% endraw %}`
template body holding the `component(...)` calls. Then use it by its tag.

A custom component is a **build-time macro**: at build it *expands* into the
components it wraps and ships **no** JavaScript of its own. (That's the difference
from a `snippets/*.jsx` React component — see [the bottom of this page](#custom-components-vs-snippets).)

## Define one

`components/BadgeGroup.md` turns the classic "Group of Badges" chain into a tag:

```aardvark
---
name: BadgeGroup          # REQUIRED — the tag you'll write as {% raw %}{% BadgeGroup %}{% endraw %}
params:
  gap:
    type: string
    default: xs
---
{% raw %}{% component('Group', gap=gap, children=children) %}{% endraw %}
```

The declared params (`gap`) and the special `children` slot are available as
variables in the body. Every `*.md` under `components/` is scanned, subfolders
included, so you can group definitions however you like. The `name:` must be a bare
identifier (letters, digits, underscores; not starting with a digit), and two files in
`components/` can't declare the same `name` — that fails the build.

## Use it — inline or block

Self-closing when there's no body, or a paired tag (`{% raw %}{% end<Tag> %}{% endraw %}`,
first letter capitalized) when you want to wrap content. The wrapped content
renders in the page and arrives as `children`:

{% raw %}
```aardvark
{% BadgeGroup %}{% component('Badge', children='New') %}{% component('Badge', children='Beta', color='grape') %}{% endBadgeGroup %}
```
{% endraw %}

renders, live:

{% BadgeGroup %}{% component('Badge', children='New') %}{% component('Badge', children='Beta', color='grape') %}{% endBadgeGroup %}

`children` holds whatever you wrapped — inline text, `component(...)` calls, even
other custom components. If you wrap **Markdown** (headings, lists, prose), pad the
slot with blank lines in your definition so the page's Markdown pass renders it:
`{% raw %}{% component('Card', children="\n\n" + children + "\n\n") %}{% endraw %}`
(the same trick [block components](/authoring/block-components/) use).

If a macro needs audience-specific `changelog` or `openapi` output, put that
directive directly inside a paired `{% raw %}{% visibility %}{% endraw %}` block in
the macro. Do not put visibility around `{% raw %}{% children %}{% endraw %}` at
that point: the children have already rendered their page-level RSS/navigation
side effects, so Aardvark fails the build rather than publish them to the wrong audience.

## Parameters

Each entry under `params:` declares a typed input:

```yaml
params:
  title:
    type: string
    required: true        # no default → must be supplied
  color:
    type: string
    default: blue         # supplied or this
  size: int               # shorthand: a bare type = optional, no default
```

- **Types**: `string`, `int`, `float`, `bool`, `list` — nothing else (no dict/object;
  pass structured data as a `list` or a JSON string). Values from the call site
  are coerced to the declared type: `count="3"` becomes the integer `3`, a `list`
  accepts a comma-separated string (`tags="a, b"` → `['a', 'b']`), and a `bool`
  accepts a bare flag (`{% raw %}{% Tag compact %}{% endraw %}`) or `"true"` /
  `"false"`. A value that can't be coerced — `count="lots"`, `size=true` for an
  `int`, `"yes"` for a `bool` — is a build error.
- **`required: true`** with no value supplied is a build error; **`default`** fills
  in when the param is omitted. Declaring both is rejected (a default already makes
  it optional). A param with neither, left unsupplied, is `None` in the body.
- Passing a param the component didn't declare is a build error — every mistake is
  caught at build time, naming the component, the param, the page it was used on, and
  the defining file.
- **Reserved names.** `children` and `attr` are the body slot and the forwarded
  attribute dict, and `component`, `inline_component` and `snippet` are the render helpers
  the body calls — none can be a param name. Neither can a name starting with
  `__aardvark_`.
- **Reserved tags.** A component can't be named `raw`, `include`, `openapi`, `icon` or
  `taxonomy`, nor after a [block component](/authoring/block-components/) open or close
  tag (`accordion`, `endAccordion`, `card`, `tabs`, …) — those are handled by the template
  engine first, so the definition would never be reached. Discovery rejects the name
  with a clear error.

The calling page is **not** visible inside the body — a component is a pure
function of its declared inputs. Pass page data explicitly, e.g.
`{% raw %}{% Hero title=page.title %}{% endraw %}`. For the same reason, emit from
a body with `print(...)` or `{% raw %}{% value %}{% endraw %}` — `page.print()`
isn't available here, since there's no `page` in scope. `data`, `site` and `config`
*are* shared into the body, so a definition can read your `data/` files directly.

A component that expands itself — directly or through another component — is a
build error (`Circular custom component: A -> B -> A`), not an infinite loop.

## A definition body can blend anything

The body is a full template, so it can freely mix **Mantine `component()` calls**,
real **Python** (`{% raw %}{% %}{% endraw %}` blocks), raw **HTML/CSS**, **`<script>`**
tags, and **`attr={...}`** event handlers. `components/CopyCard.md` does all of it —
a Python expression, a Mantine `Button`, a `<style>` block, an `onclick` + `data-*`
via `attr`, and a top-level `<script>`:

{% raw %}
```aardvark
{% CopyCard label='Copy install command' text='pip install aardvark' %}
```
{% endraw %}

renders a working copy button — click it:

{% CopyCard label='Copy install command' text='pip install aardvark' %}

Two things worth knowing about injected JavaScript:

- A **`<script>` at the body's top level** runs on page load. A `<script>` passed as a
  component's `children` is treated as inert markup by the island runtime — it isn't
  guaranteed to run — so keep runnable scripts at the top level.
- Use **`attr`** for per-component handlers/data (`onclick`, `data-*`, `id`); use the
  `className`/`style` **props** for styling (React owns those). A site can restrict
  `attr` with `attrPolicy` in `aardvark.config.yaml`.

### Forwarding `attr` from a tag

`attr={...}` on a custom-component tag is evaluated as Python and handed to the body as
the variable `attr` (`None` when the caller passed none) — it's never applied automatically.
Forward it to the island you want it to land on, and your tag supports
`{% raw %}{% MyCard attr={'data-track': 'hero'} %}{% endraw %}` exactly like a direct
`component(..., attr=...)` call:

{% raw %}
```aardvark
{% component('Card', children=children, attr=attr) %}
```
{% endraw %}

{% callout title="One block, one Python program" severity="info" %}
A `{% raw %}{% %}{% endraw %}` block ends at the **first** `%}` — even one inside a
Python string or a `#` comment. Writing a tag such as `{% raw %}{% button %}{% endraw %}`
inside a Python block therefore ends the block early and the rest of it is dropped,
silently. Mention template syntax in a comment as plain prose ("the button tag") instead.
This applies to every page, but it bites most often in definitions, whose bodies are
usually one long Python block.
{% endCallout %}

## Built-in components

Aardvark ships well over a hundred **built-in components** defined exactly this way, so
you don't have to. **`{% raw %}{% button %}{% endraw %}`** renders a button or link,
exposing the full Mantine Button surface — `variant`, `color`, `size`, gradient,
sections, link target, spacing, `id`, an `onclick` handler, and more. See its page,
[Button](/components/buttons/button/), for the full list with live examples. The label
is the block body or a `text` param.

{% raw %}
```aardvark
{% button text='Get started' url='/start/' color='grape' %} {% button url='/docs/' variant='outline' %}Read the docs{% endButton %}
```
{% endraw %}

renders, live:

{% button text='Get started' url='/start/' color='grape' %} {% button url='/docs/' variant='outline' %}Read the docs{% endButton %}

The header's top-bar buttons (`topButtons` in `aardvark.config.yaml`) accept the same
fields.

Another built-in is **`{% raw %}{% callout %}{% endraw %}`** — a titled, colored
admonition box. Set `severity` to one of `success` (green), `info` (primary), `caution`
(yellow), or `warning` (red); `title` is optional; the block body is the message. Close it
with `{% raw %}{% endCallout %}{% endraw %}`. See its page,
[Callout](/components/feedback/callout/), for parameters and examples.

{% raw %}
```aardvark
{% callout title="This is a destructive action" severity="warning" %}
Be careful when proceeding here.
{% endCallout %}
```
{% endraw %}

renders, live:

{% callout title="This is a destructive action" severity="warning" %}
Be careful when proceeding here.
{% endCallout %}

`callout` pairs its `.md` definition with a built-in React snippet (`Callout.jsx`)
that maps each severity to its color and icon — a small example of a built-in component
composing a snippet.

To customize a built-in, define your own `components/<name>.md` with the same
`name:` — your version wins, everywhere the tag is used (including
`component('aardvark', '<name>', …)` calls).

## Custom components vs snippets

Both let you make your own building blocks; reach for the right one:

- **Custom component** (`components/*.md`) — *composes existing components* (Mantine,
  builtins, snippets) into a named, parameterized tag. No JavaScript is added. This
  is the recommended path for reuse, and what you want most of the time.
- **Snippet** (`snippets/*.jsx`) — a genuinely new **React component** written in
  JSX, for behavior/markup that composition can't express. It's bundled and mounted
  client-side, and earns its own `{% raw %}{% Name %}{% endraw %}` tag too. See
  [Custom snippets](/authoring/custom-snippets/) for how to write one and a full
  side-by-side breakdown.

Rule of thumb: composing what already exists → custom component; writing new React →
snippet.

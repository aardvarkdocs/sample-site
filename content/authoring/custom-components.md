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
variables in the body.

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

- **Types**: `string`, `int`, `float`, `bool`, `list`. Values from the call site
  are coerced to the declared type (so `count="3"` becomes the integer `3`, and a
  `list` accepts a comma-separated string). A value that can't be coerced is a
  build error.
- **`required: true`** with no value supplied is a build error; **`default`** fills
  in when the param is omitted. Declaring both is rejected (a default already makes
  it optional).
- Passing a param the component didn't declare is a build error — every mistake is
  caught at build time, naming the component, the param, and the file.

The calling page is **not** visible inside the body — a component is a pure
function of its declared inputs. Pass page data explicitly, e.g.
`{% raw %}{% Hero title=page.title %}{% endraw %}`. For the same reason, emit from
a body with `print(...)` or `{% raw %}{% value %}{% endraw %}` — `page.print()`
isn't available here, since there's no `page` in scope.

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

- A **`<script>` at the body's top level** runs on page load. A `<script>` placed
  *inside* a `component(...)` call becomes a React child and is rendered inert
  (browsers don't execute scripts inserted that way) — keep runnable scripts at the
  top level.
- Use **`attr`** for per-component handlers/data (`onclick`, `data-*`, `id`); use the
  `className`/`style` **props** for styling (React owns those). A site can restrict
  `attr` with `attrPolicy` in `aardvark.config.yaml`.

## Built-in components

Aardvark ships a few **built-in components** so you don't have to define them.
**`{% raw %}{% button %}{% endraw %}`** renders a button or link, exposing the full
Mantine Button surface — `variant`, `color`, `size`, gradient, sections, link target,
spacing, `id`, and more. See its page, [Button](/components/buttons/button/), for the full
list with live examples. The label is the block body or a `text` param.

{% raw %}
```aardvark
{% button text='Get started' url='/start/' color='grape' %} {% button url='/docs/' variant='outline' %}Read the docs{% endButton %}
```
{% endraw %}

renders, live:

{% button text='Get started' url='/start/' color='grape' %} {% button url='/docs/' variant='outline' %}Read the docs{% endButton %}

The header's top-bar buttons (`topButtons` in `aardvark.config.yaml`) use this same
component.

Another built-in is **`{% raw %}{% callout %}{% endraw %}`** — an admonition: set `title`
for an optional bold heading and `severity` (`success` / `info` / `caution` / `warning`) to
color the box and pick its icon. See its page, [Callout](/components/feedback/callout/), for
parameters and examples.

To customize a built-in, define your own `components/<name>.md` with the same
`name:` — your version wins.

Aardvark also ships **`{% raw %}{% callout %}{% endraw %}`** — a titled, colored
admonition box. Set `severity` to one
of `success` (green), `info` (primary), `caution` (yellow), or `warning` (red);
`title` is optional; the block body is the message. Close it with
`{% raw %}{% endCallout %}{% endraw %}`.

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

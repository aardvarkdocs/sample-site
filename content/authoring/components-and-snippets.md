---
description: Embed any Mantine component or your own React snippet from Markdown with
  component(), including nesting.
icon: fa-solid fa-puzzle-piece
menu: docs
title: Components & snippets
weight: 21
---

# Components & snippets

Call `component('Name', **props)` to drop a React component into a page. At
build time aardvark records a mount point and bundles the component; in the browser
it mounts as an **island** wrapped in a Mantine provider.

> **How islands render:** components are **client-rendered** — the bundled
> runtime mounts each one with React (`createRoot`) on load. Enabling
> `islands: { ssr: true }` additionally prerenders the widgets to static HTML at
> build time, so crawlers and no-JS readers see real markup; the client still
> re-renders on load (it does **not** *hydrate* / attach to that markup, so
> there's no server/client mismatch to worry about). This isn't Astro-style
> partial hydration — the whole component bundle ships and every island
> re-renders.

## Mantine components

Any Mantine component is available by name:

{% raw %}
```aardvark
{% component('Button', children='Get started', color='blue') %}
```
{% endraw %}

renders, live:

{% component('Button', children='Get started', color='blue') %}

- `children` is the content (text, or another `component(...)` call).
- All other keyword args become props. They must be JSON-serializable, so pass
  data and `defaultValue`/`defaultChecked` rather than functions. To attach an
  event handler or any raw HTML attribute, use the `attr` argument (below).

See the [Component gallery](/components/) for live examples.

## Custom snippets

Put a React component in `snippets/` and reference it by filename. This site
includes `snippets/ProductCard.jsx`:

{% raw %}
```aardvark
{% component('ProductCard', product='Aardvark Pro', tagline='Docs that build themselves', badge='New') %}
```
{% endraw %}

{% component('ProductCard', product='Aardvark Pro', tagline='Docs that build themselves', badge='New') %}

`snippet(...)` is an alias of `component(...)` if you prefer to make the intent
explicit.

### Overriding a built-in

A snippet **wins any name collision** with a Mantine component or a built-in island. Name a
file after one — `snippets/Button.jsx`, `snippets/Survey.jsx` — and `component('Button')`
mounts *your* component everywhere, not the shipped one; aardvark bundles your file in its
place. That's the supported way to customize a built-in island wholesale (restyle it, swap
its data source, change its behavior) without forking the theme — for example, replacing the
built-in [survey](/survey/) card with your own `snippets/Survey.jsx`. The precedence is
*Mantine → built-in island → your snippet*, last one wins, so your `snippets/` always takes
priority.

### A snippet is also a tag

Putting a file in `snippets/` gives you a matching `{% raw %}{% Name %}{% endraw %}`
**directive** too — the same way a [custom component](/authoring/custom-components/)
does. Write it as a tag, pass scalar props as attributes, and let the body become the
snippet's `children`:

{% raw %}
```aardvark
{% ProductCard product="Aardvark Pro" tagline="Docs that build themselves" badge="New" %}
```
{% endraw %}

That's exactly `{% raw %}{% component('ProductCard', …) %}{% endraw %}`, so reach for
whichever reads better. Two things only the call form can do: pass a **non-scalar prop**
(a list or dict — tag attributes are scalar, like every other directive), and run inside
a `for` loop (a `{% raw %}{% Name %}{% endraw %}` tag is expanded when the page is
*scanned*, before any loop runs). The `attr={% raw %}{…}{% endraw %}` escape hatch below
works in both forms. See [Custom snippets](/authoring/custom-snippets/) for the full story
and when to choose a snippet over a [custom component](/authoring/custom-components/).

## Attaching HTML attributes (attr)

Components render to real DOM in the browser, so you never write their final tag —
which means there's normally nowhere to hang an `onclick`, a `data-*` hook, or an
`id`. The `attr` argument fills that gap: pass a dict of raw HTML attributes and
they're applied to the component's **rendered root element** when it mounts.

{% raw %}
```aardvark
{% component('Button', children='Click me', attr={'onclick': "this.textContent='Clicked!'", 'data-track': 'cta'}) %}
```
{% endraw %}

renders a real button whose `onclick` runs your JavaScript — click it:

{% component('Button', children='Click me', attr={'onclick': "this.textContent='Clicked!'", 'data-track': 'cta'}) %}

Because the value is just a string of JavaScript — and nothing says it has to be a
single line — you can drop a whole anonymous function straight into `attr`. A
triple-quoted Python string carries a multiline body, so the handler can do real
work inline (here an IIFE; swap in a `fetch`, analytics, a modal — anything):

{% raw %}
```aardvark
{% component('Button', children='Say hello', attr={'onclick': '''
  (() => {
    const who = 'world';
    alert(`Hello, ${who}!`);   // …or call any API you like
  })()
'''}) %}
```
{% endraw %}

{% component('Button', children='Say hello', attr={'onclick': '''
  (() => {
    const who = 'world';
    alert(`Hello, ${who}!`);
  })()
'''}) %}

Values may be strings, numbers, or booleans (`True` → a bare boolean attribute;
`False`/`None` → omitted). They're applied with `setAttribute`, so a value can only
set an attribute on that one element — it can never inject markup elsewhere.

- Use `attr` for **event handlers** (`onclick`, …), **`data-*`** / **`aria-*`**,
  `id`, and other custom attributes.
- Use normal **props** for `className` and `style` — React manages those, and an
  `attr` would fight it (aardvark warns in the console if you try).
- A few Mantine components render only context and have no DOM node of their own —
  `Accordion`, `Combobox`, `MenuSub`, `NumberFormatter`. `attr` on these
  applies only at the top level; nested, put the `attr` on a child element instead.
  (`Menu`, `Popover`, and `HoverCard` *do* take `attr`, but it lands on the rendered
  `.Dropdown` overlay — not the trigger.)
- Custom snippets support `attr` when they **forward their ref** to a root element —
  see `snippets/ProductCard.jsx`. Every Mantine component supports it out of the box.

A **custom class or style** is the one case to reach past `attr`: pass them as the
`className` and `style` props so Mantine *merges* them with its own. (Setting `class`
or `style` through `attr` would overwrite the component's — aardvark warns if you try.)

{% raw %}
```aardvark
{% component('Button', children='Custom look', className='cta-pill', style={'borderRadius': '999px', 'textTransform': 'uppercase'}) %}
```
{% endraw %}

{% component('Button', children='Custom look', className='cta-pill', style={'borderRadius': '999px', 'textTransform': 'uppercase'}) %}

`cta-pill` lands on the rendered button alongside Mantine's own classes (ready for
your CSS to target), and the inline `style` is merged in — neither clobbers the
component's styling.

`attr` is intentionally powerful (it can run JavaScript), in keeping with aardvark's
trusted, in-repo content model. A site that wants to restrict it can set an
`attrPolicy` in `aardvark.config.yaml` — patterns may end in `*` for a prefix match:

```yaml
attrPolicy:
  deny: ['on*']                 # block inline event handlers
  # allow: ['data-*', 'aria-*', 'id']   # …or allowlist-only
```

## Nesting

Because a `component(...)` call returns its mount markup, you can nest calls by
passing one as another's `children`:

{% raw %}
```aardvark
{% component('Group', children=component('Badge', children='New') + component('Badge', children='Beta', color='grape')) %}
```
{% endraw %}

{% component('Group', children=component('Badge', children='New') + component('Badge', children='Beta', color='grape')) %}

This is how compound components (Accordion, Tabs, Card sections, …) are built —
see the gallery for examples. For a compound whose body is **Markdown** rather
than a string, reach for a [block component](/authoring/block-components/) instead.

To **reuse** a chain like this — name it, give it typed parameters, and call it as
`{% raw %}{% MyTag … %}{% endraw %}` instead of repeating the `component(...)` calls —
define a [custom component](/authoring/custom-components/). It's the recommended way
to package a composition for reuse.

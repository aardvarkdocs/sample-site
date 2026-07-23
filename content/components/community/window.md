---
title: "Window"
description: "Community Component — a draggable, resizable window with a title bar and controls, wrapping @gfazioli/mantine-window. Drag, resize, collapse, and live examples."
menu: components
parent: community
weight: 20
---

# Window

`{% raw %}{% window %}{% endraw %}` is a **draggable, resizable window** with a title bar and
window controls (close, collapse, and a tools menu). Grab the header to move it, drag any edge or
corner to resize it, and collapse it to just the title bar. The block body is the window content.

A **Community Component** — wraps [Window](https://gfazioli.github.io/mantine-window/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-window`.

This is a different component from the Mantine-core
[`floatingwindow`](/components/overlays/floatingwindow/) builtin, which is a trigger-opened titled
card. By default this window sits **inside the page flow** (in a relative host) so the docs stay
readable; pass `withinPortal=true` to float it over the whole viewport instead.

Use it as `{% raw %}{% window %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'window', …)`.

## Demonstrations

### A basic window

The block body is the window content; `title` fills the header. Drag the header to move it and any
edge or corner to resize it.

{% raw %}
```aardvark
{% window title='Readme' %}
Drag me by the header, or grab an edge to resize.

The body renders as **Markdown**, so you can use the usual formatting here.
{% endWindow %}
```
{% endraw %}

{% window title='Readme' %}
Drag me by the header, or grab an edge to resize.

The body renders as **Markdown**, so you can use the usual formatting here.
{% endWindow %}

### Constrained drag and resize

`draggable` limits how the window moves (`none`, `window`, `header`, or `both`) and `resizable`
limits how it resizes (`none`, `vertical`, `horizontal`, or `both`). Here it can only be moved by
its header and only resized horizontally.

{% raw %}
```aardvark
{% window title='Header-drag, horizontal-resize' draggable='header' resizable='horizontal' %}
This window only moves by its title bar and only grows sideways.
{% endWindow %}
```
{% endraw %}

{% window title='Header-drag, horizontal-resize' draggable='header' resizable='horizontal' %}
This window only moves by its title bar and only grows sideways.
{% endWindow %}

### Sizing and styling

Seed the initial geometry with `width` and `height`, tint the chrome with `color`, and set the
`radius` and `shadow`.

{% raw %}
```aardvark
{% window title='Styled' color='grape' radius='lg' shadow='xl' width=360 height=220 %}
A larger, rounded, grape-tinted window.
{% endWindow %}
```
{% endraw %}

{% window title='Styled' color='grape' radius='lg' shadow='xl' width=360 height=220 %}
A larger, rounded, grape-tinted window.
{% endWindow %}

### Trimming the controls

Turn off the controls you don't need — here only the close button stays, with the collapse and
tools buttons removed.

{% raw %}
```aardvark
{% window title='Just a close button' withCollapseButton=false withToolsButton=false %}
A minimal window chrome.
{% endWindow %}
```
{% endraw %}

{% window title='Just a close button' withCollapseButton=false withToolsButton=false %}
A minimal window chrome.
{% endWindow %}

## With other components

The body renders as Markdown, so a window can hold any other component. Here it wraps a
[`badge`](/components/data-display/badge/) and a [`text`](/components/typography/text/) block.

{% raw %}
```aardvark
{% window title='Release notes' width=380 %}
{% badge color='teal' %}v2.0{% endBadge %}

{% text %}A short changelog lives inside the draggable window.{% endText %}
{% endWindow %}
```
{% endraw %}

{% window title='Release notes' width=380 %}
{% badge color='teal' %}v2.0{% endBadge %}

{% text %}A short changelog lives inside the draggable window.{% endText %}
{% endWindow %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `withinPortal`) become `=true`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | text | The header title. |
| `draggable` | `none`, `window`, `header`, `both` (default `both`) | Where the window can be grabbed to move. |
| `resizable` | `none`, `vertical`, `horizontal`, `both` (default `both`) | Which directions the window can be resized. |
| `color` | a Mantine color | Accent color for the chrome. |
| `radius` | `xs`–`xl` or a number | Corner radius. |
| `shadow` | `xs`–`xl` (`md` default) | Drop shadow. |
| `width` | integer px | Initial width (seeds the package's `defaultWidth`). |
| `height` | integer px | Initial height (seeds the package's `defaultHeight`). |
| `withinPortal` | `true` / `false` (default) | Float over the whole viewport instead of sitting in the page flow. |
| `withCloseButton` | `true` (default) / `false` | Show the close button. |
| `withCollapseButton` | `true` (default) / `false` | Show the collapse button. |
| `withToolsButton` | `true` (default) / `false` | Show the tools-menu button. |
| `withBorder` | `true` (default) / `false` | Draw a border around the window. |
| `attr={…}` | an object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The window renders inside an island wrapper you can target in custom CSS:

```css
[data-aardvark-island="Window"] {
  /* your overrides */
}
```

The package also exposes CSS variables on the window root — `--window-background`,
`--window-radius`, and `--window-shadow` — which you can set through the `attr` style passthrough
below.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (data attributes, ARIA, inline `style`) straight
onto the rendered element — handy for hooks your own CSS or scripts key off, or for setting the
package's CSS variables.

{% window title='Custom background' attr={'data-testid': 'demo-window', 'style': '--window-background: var(--mantine-color-blue-light)'} %}
A window whose background is set through the CSS-variable passthrough.
{% endWindow %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% window title='Custom background' attr={'data-testid': 'demo-window', 'style': '--window-background: var(--mantine-color-blue-light)'} %}
A window whose background is set through the CSS-variable passthrough.
{% endWindow %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'window', title='Custom background',
          attr={'data-testid': 'demo-window', 'style': '--window-background: var(--mantine-color-blue-light)'},
          children='A window whose background is set through the CSS-variable passthrough.')
```
{% endAccordionSection %}
{% endAccordion %}

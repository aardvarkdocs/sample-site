---
title: "Picker"
description: "Community Component — an animated iOS-style scroll/wheel picker wrapping @gfazioli/mantine-picker. Options, the selection band, item sizing, and live examples."
menu: components
parent: community
weight: 10
---

# Picker

`{% raw %}{% picker %}{% endraw %}` is an **animated, iOS-style scroll/wheel picker**: a vertical
wheel of options where the centred item is the selected one. Drag it, spin it with the mouse
wheel, or arrow-key through it — the items scale, fade, and snap into place. Give it the options
as `data` (a comma-separated list) and, optionally, a starting `defaultValue`.

A **Community Component** — wraps [Picker](https://gfazioli.github.io/mantine-picker/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-picker`.

Use it as `{% raw %}{% picker %}{% endraw %}` in Markdown, or call it from Python logic (loops,
snippets) via `component('aardvark', 'picker', …)`.

## Demonstrations

### Basic options

Pass the options as `data` — a comma-separated list. The first item is selected by default; the
centred row is the current value.

{% raw %}
```aardvark
{% picker data='Red, Orange, Yellow, Green, Blue, Indigo, Violet' %}
```
{% endraw %}

{% picker data='Red, Orange, Yellow, Green, Blue, Indigo, Violet' %}

### A starting value

Set `defaultValue` to pre-select an item other than the first.

{% raw %}
```aardvark
{% picker data='Mon, Tue, Wed, Thu, Fri, Sat, Sun' defaultValue='Wed' %}
```
{% endraw %}

{% picker data='Mon, Tue, Wed, Thu, Fri, Sat, Sun' defaultValue='Wed' %}

### Taller rows and more visible items

`itemHeight` sets each row's height in pixels and `visibleItems` how many rows show at once (use
an odd number so one sits in the centre).

{% raw %}
```aardvark
{% picker data='10, 20, 30, 40, 50, 60, 70, 80, 90' defaultValue='40' itemHeight=52 visibleItems=5 %}
```
{% endraw %}

{% picker data='10, 20, 30, 40, 50, 60, 70, 80, 90' defaultValue='40' itemHeight=52 visibleItems=5 %}

### Plain wheel (no band)

Turn off the highlight band and dividers with `withHighlight=false` and `withDividers=false` for a
cleaner wheel, and switch off the wrap-around with `loop=false`.

{% raw %}
```aardvark
{% picker data='Bronze, Silver, Gold, Platinum' withHighlight=false withDividers=false loop=false %}
```
{% endraw %}

{% picker data='Bronze, Silver, Gold, Platinum' withHighlight=false withDividers=false loop=false %}

## With other components

The picker is a self-contained widget, so it slots straight into any layout. Here a
[`paper`](/components/layout/paper/) surface frames it with a [`text`](/components/typography/text/)
label above.

{% raw %}
```aardvark
{% paper withBorder=true p='md' radius='md' %}
{% text fw=600 %}Pick a size{% endText %}

{% picker data='XS, S, M, L, XL, XXL' defaultValue='M' %}
{% endPaper %}
```
{% endraw %}

{% paper withBorder=true p='md' radius='md' %}
{% text fw=600 %}Pick a size{% endText %}

{% picker data='XS, S, M, L, XL, XXL' defaultValue='M' %}
{% endPaper %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `disabled`) become `=true`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | comma-separated list, e.g. `'Red, Green, Blue'` | The options shown on the wheel. |
| `defaultValue` | one of the `data` values | The initially selected item (defaults to the first). |
| `itemHeight` | integer px (`40` default) | Height of each row. |
| `visibleItems` | odd integer (`3` default) | How many rows are visible at once. |
| `loop` | `true` (default) / `false` | Wrap around past the last item back to the first. |
| `animate` | `true` (default) / `false` | Animate the scroll to the selected value on mount. |
| `withHighlight` | `true` (default) / `false` | Show the highlight band over the selected row. |
| `withDividers` | `true` (default) / `false` | Show the dividers above and below the selected row. |
| `size` | `xs`–`xl` | Component size. |
| `label` | text | Accessible label for the picker. |
| `disabled` | `true` / `false` (default) | Disable all interaction. |
| `readOnly` | `true` / `false` (default) | Keep the appearance but block interaction. |
| `attr={…}` | an object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The picker renders inside an island wrapper you can target in custom CSS:

```css
[data-aardvark-island="Picker"] {
  /* your overrides */
}
```

The package also exposes its own CSS variables on the picker root — `--picker-height`,
`--picker-item-height`, `--picker-animation-duration`, `--picker-mask-height`, and more — which
you can set through the `attr` style passthrough below.

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes (data attributes, ARIA, inline `style`) straight
onto the rendered element — handy for hooks your own CSS or scripts key off, or for setting the
package's CSS variables.

{% picker data='1, 2, 3, 4, 5' attr={'data-testid': 'qty-picker', 'style': '--picker-mask-height: 40%'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% picker data='1, 2, 3, 4, 5' attr={'data-testid': 'qty-picker', 'style': '--picker-mask-height: 40%'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'picker', data='1, 2, 3, 4, 5', attr={'data-testid': 'qty-picker', 'style': '--picker-mask-height: 40%'})
```
{% endAccordionSection %}
{% endAccordion %}

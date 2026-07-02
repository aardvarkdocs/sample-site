---
title: "LensSelect"
description: "The built-in lensselect tag — a fisheye/lens magnification select where the item under the cursor swells like a macOS Dock icon and its neighbours scale by proximity. A Community Component wrapping @gfazioli/mantine-lens-select."
menu: components
parent: community
weight: 70
---

# LensSelect

`lensselect` is a **macOS Dock-style** select: a row (or column) of items where the one under
your cursor swells and its neighbours scale by proximity, giving that fisheye-lens magnification
you know from the Dock. Hand it a list of items, or a numeric range, and it hydrates into a
fully interactive island in the browser — no JavaScript to write.

A **Community Component** — wraps [LensSelect](https://gfazioli.github.io/mantine-lens-select/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-lens-select`.

## Demonstrations

### A row of items

Pass items through `data` as a JSON array of `{value, view}` — `view` is the item's content and
is optional (omit it for the default pill). Hover across the row to see the lens follow your
cursor.

{% raw %}
```aardvark
{% lensselect data='[
  {"value":"home","view":"🏠"},
  {"value":"search","view":"🔍"},
  {"value":"mail","view":"✉️"},
  {"value":"music","view":"🎵"},
  {"value":"photos","view":"🖼️"},
  {"value":"settings","view":"⚙️"}
]' %}
```
{% endraw %}

{% lensselect data='[
  {"value":"home","view":"🏠"},
  {"value":"search","view":"🔍"},
  {"value":"mail","view":"✉️"},
  {"value":"music","view":"🎵"},
  {"value":"photos","view":"🖼️"},
  {"value":"settings","view":"⚙️"}
]' %}

### A generated numeric range

With no `data`, give `count` for values `1..N`, or `min`/`max`/`step` for a custom range —
LensSelect renders default pills for each. This makes a compact, scrubber-like picker:

{% raw %}
```aardvark
{% lensselect min=0 max=100 step=10 %}
```
{% endraw %}

{% lensselect min=0 max=100 step=10 %}

### macOS Dock feel

Turn on `expandOnHover` so items push their neighbours apart as they magnify (the real Dock
behaviour), raise `magnification`, and widen `lensRange` so more neighbours respond:

{% raw %}
```aardvark
{% lensselect expandOnHover=true magnification=2.5 lensRange=4 itemSize='40' gap='8' data='[
  {"value":"a","view":"A"},
  {"value":"b","view":"B"},
  {"value":"c","view":"C"},
  {"value":"d","view":"D"},
  {"value":"e","view":"E"}
]' %}
```
{% endraw %}

{% lensselect expandOnHover=true magnification=2.5 lensRange=4 itemSize='40' gap='8' data='[
  {"value":"a","view":"A"},
  {"value":"b","view":"B"},
  {"value":"c","view":"C"},
  {"value":"d","view":"D"},
  {"value":"e","view":"E"}
]' %}

### Vertical orientation and a hover selection mode

Set `orientation='vertical'` for a column, `selectionMode='hover'` to auto-select on hover
(no click needed), and `withIndicator=true` to show a marker beside the active item:

{% raw %}
```aardvark
{% lensselect orientation='vertical' selectionMode='hover' withIndicator=true data='[
  {"value":"one","view":"1"},
  {"value":"two","view":"2"},
  {"value":"three","view":"3"},
  {"value":"four","view":"4"}
]' %}
```
{% endraw %}

{% lensselect orientation='vertical' selectionMode='hover' withIndicator=true data='[
  {"value":"one","view":"1"},
  {"value":"two","view":"2"},
  {"value":"three","view":"3"},
  {"value":"four","view":"4"}
]' %}

## With other components

A LensSelect makes a tidy inline control, so it sits well beside a label rendered with
[Text](/components/typography/text/):

{% raw %}
```aardvark
{% text fw=600 %}Rate it{% endText %}
{% lensselect count=5 withScale=true magnification=2 %}
```
{% endraw %}

{% text fw=600 %}Rate it{% endText %}
{% lensselect count=5 withScale=true magnification=2 %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `expandOnHover`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array of `{value, view}` | The items. `value` is the unique id; `view` (optional) is the content. |
| `defaultValue` | string | The `value` selected on first render. |
| `count` | int | Generate values `1..count` when no `data` is given. |
| `min` / `max` / `step` | float | Generate a custom numeric range (overrides `count` when `step` is set). |
| `precision` | int (default `0`) | Decimal places for generated numeric values. |
| `orientation` | `horizontal` (default) / `vertical` | Layout direction. |
| `magnification` | float (default `2`) | Maximum magnification factor under the cursor. |
| `lensRange` | int (default `3`) | How many adjacent items the lens influences. |
| `itemSize` | string px (default `24`) | Base size of each item. |
| `gap` | string px (default `10`) | Gap between items. |
| `selectionMode` | `click` (default) / `hover` | How an item is selected. |
| `easing` | `linear` / `ease-out` / `ease-in-out` / `spring` / `cubic-bezier(…)` | Transition easing. |
| `transitionDuration` | int ms (default `200`) | Transition duration. |
| `pillColor` / `hoverColor` / `activeColor` | Mantine color | Default-pill colors for the inactive / hovered / active states. |
| `pillRadius` | Mantine radius (default `xl`) | Default-pill corner radius. |
| `ariaLabel` | string | Accessible label for the component. |
| `withScale` | `true` (default) / `false` | Scale items on hover. |
| `withOpacity` | `true` / `false` (default `false`) | Fade distant items. |
| `withBlur` | `true` / `false` (default `false`) | Blur distant items. |
| `expandOnHover` | `true` / `false` (default `false`) | Push neighbours apart on magnify (Dock style). |
| `withWheel` | `true` / `false` (default `false`) | Enable mouse-wheel navigation. |
| `loop` | `true` / `false` (default `false`) | Wrap-around navigation. |
| `withIndicator` | `true` / `false` (default `false`) | Show a marker beside the active item. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The island mounts under a stable wrapper you can target from your own CSS:

```css
[data-aardvark-island="LensSelect"] {
  /* your overrides */
}
```

The upstream component also exposes Mantine Styles-API class names (`root`, `track`, `item`,
`itemContent`, `itemPill`, `indicator`) and CSS variables (`--ls-item-size`,
`--ls-magnification`, `--ls-range`, `--ls-gap`, `--ls-pill-color`, `--ls-easing`, …) for finer
control.

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes onto the rendered root element — handy for
analytics hooks, test ids, or ARIA attributes the component doesn't expose as a prop. The
object passes through verbatim (it is not a React prop):

{% lensselect attr={'data-testid': 'dock', 'data-analytics': 'launcher'} count=4 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% lensselect attr={'data-testid': 'dock', 'data-analytics': 'launcher'} count=4 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'lensselect', attr={'data-testid': 'dock', 'data-analytics': 'launcher'}, count=4)
```
{% endAccordionSection %}
{% endAccordion %}

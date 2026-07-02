---
title: "DepthSelect"
description: "The built-in depthselect tag — a 3D Time Machine-style stack select where cards recede into depth and you riffle through them. A Community Component wrapping @gfazioli/mantine-depth-select."
menu: components
parent: community
weight: 60
---

# DepthSelect

`depthselect` is a 3D **stack select** — a "Time Machine"-style column of cards that recede
into depth. The front card is in focus; the ones behind shrink, drop, fade, and blur with
distance, and you riffle forward and back with the built-in controls, the scroll wheel, or the
keyboard. Drop a set of cards into a page with no JavaScript; it hydrates into a fully
interactive island in the browser.

A **Community Component** — wraps [DepthSelect](https://gfazioli.github.io/mantine-depth-select/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-depth-select`.

## Demonstrations

### A basic stack

Pass the cards through `data` as a JSON array of `{value, view}` objects: `value` is the unique
id and `view` is the card's content. The first card is selected by default.

{% raw %}
```aardvark
{% depthselect data='[
  {"value":"one","view":"Card One"},
  {"value":"two","view":"Card Two"},
  {"value":"three","view":"Card Three"},
  {"value":"four","view":"Card Four"},
  {"value":"five","view":"Card Five"}
]' %}
```
{% endraw %}

{% depthselect data='[
  {"value":"one","view":"Card One"},
  {"value":"two","view":"Card Two"},
  {"value":"three","view":"Card Three"},
  {"value":"four","view":"Card Four"},
  {"value":"five","view":"Card Five"}
]' %}

### Tuning the depth

`visibleCards` sets how many cards show in the stack, and `scaleStep`, `translateYStep`,
`opacityStep`, and `blurStep` control how sharply each card recedes per depth level. Here a
deeper stack with a gentler falloff:

{% raw %}
```aardvark
{% depthselect visibleCards=6 scaleStep=0.06 translateYStep=20 opacityStep=0.1 blurStep=0 data='[
  {"value":"a","view":"Alpha"},
  {"value":"b","view":"Bravo"},
  {"value":"c","view":"Charlie"},
  {"value":"d","view":"Delta"},
  {"value":"e","view":"Echo"},
  {"value":"f","view":"Foxtrot"}
]' %}
```
{% endraw %}

{% depthselect visibleCards=6 scaleStep=0.06 translateYStep=20 opacityStep=0.1 blurStep=0 data='[
  {"value":"a","view":"Alpha"},
  {"value":"b","view":"Bravo"},
  {"value":"c","view":"Charlie"},
  {"value":"d","view":"Delta"},
  {"value":"e","view":"Echo"},
  {"value":"f","view":"Foxtrot"}
]' %}

### Looping, controls, and selection

Set `loop=true` to wrap from the last card back to the first, `controlsPosition` to move the
nav buttons, and `defaultValue` to start on a specific card. Turn off `withControls` or
`withScrollNavigation` to drop those affordances.

{% raw %}
```aardvark
{% depthselect loop=true controlsPosition='left' defaultValue='two' data='[
  {"value":"one","view":"First"},
  {"value":"two","view":"Second"},
  {"value":"three","view":"Third"}
]' %}
```
{% endraw %}

{% depthselect loop=true controlsPosition='left' defaultValue='two' data='[
  {"value":"one","view":"First"},
  {"value":"two","view":"Second"},
  {"value":"three","view":"Third"}
]' %}

## With other components

Each card's `view` is rendered content, so a DepthSelect reads naturally next to other tags —
for example introduced by a [Title](/components/typography/title/) and a
[Text](/components/typography/text/) lead-in:

{% raw %}
```aardvark
{% title order=3 %}Recent snapshots{% endTitle %}
{% text c='dimmed' %}Riffle through the stack to pick one.{% endText %}
{% depthselect data='[
  {"value":"mon","view":"Monday"},
  {"value":"tue","view":"Tuesday"},
  {"value":"wed","view":"Wednesday"}
]' %}
```
{% endraw %}

{% title order=3 %}Recent snapshots{% endTitle %}
{% text c='dimmed' %}Riffle through the stack to pick one.{% endText %}
{% depthselect data='[
  {"value":"mon","view":"Monday"},
  {"value":"tue","view":"Tuesday"},
  {"value":"wed","view":"Wednesday"}
]' %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `loop`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array of `{value, view}` | The cards. `value` is the unique id; `view` is the card content. |
| `defaultValue` | string | The `value` of the card selected on first render (defaults to the first). |
| `visibleCards` | int (default `4`) | How many cards are visible in the stack. |
| `controlsPosition` | `right` (default) / `left` | Where the nav controls sit relative to the stack. |
| `transitionDuration` | int ms (default `400`) | Duration of the riffle animation. |
| `scaleStep` | float (default `0.1`) | Scale reduction per depth level. |
| `translateYStep` | int px (default `30`) | Vertical offset per depth level. |
| `opacityStep` | float (default `0.15`) | Opacity reduction per depth level. |
| `blurStep` | int px (default `1`) | Blur increment per depth level. |
| `ariaLabel` | string (default `Depth select`) | Accessible label for the component. |
| `withControls` | `true` (default) / `false` | Show the built-in navigation controls. |
| `withScrollNavigation` | `true` (default) / `false` | Enable mouse-wheel navigation. |
| `loop` | `true` / `false` (default `false`) | Wrap from the last card to the first and back. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element. |

## CSS Selector

The island mounts under a stable wrapper you can target from your own CSS:

```css
[data-aardvark-island="DepthSelect"] {
  /* your overrides */
}
```

The upstream component also exposes Mantine Styles-API class names (`root`, `stack`, `card`,
`controls`, `controlUp`, `controlDown`, `controlLabel`) and CSS variables
(`--ds-scale-step`, `--ds-translate-y-step`, `--ds-opacity-step`, `--ds-blur-step`,
`--ds-visible-cards`, `--ds-transition-duration`) for finer control.

## Injecting Attributes

Use `attr={…}` to forward raw HTML attributes onto the rendered root element — handy for
analytics hooks, test ids, or ARIA attributes the component doesn't expose as a prop. The
object passes through verbatim (it is not a React prop):

{% depthselect attr={'data-testid': 'snapshot-stack', 'data-analytics': 'gallery'} data='[
  {"value":"one","view":"One"},
  {"value":"two","view":"Two"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% depthselect attr={'data-testid': 'snapshot-stack', 'data-analytics': 'gallery'} data='[
  {"value":"one","view":"One"},
  {"value":"two","view":"Two"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'depthselect',
          attr={'data-testid': 'snapshot-stack', 'data-analytics': 'gallery'}, data='''[
  {"value":"one","view":"One"},
  {"value":"two","view":"Two"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

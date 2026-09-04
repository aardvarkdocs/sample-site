---
title: "AlphaSlider"
description: "The built-in alphaslider tag — pick an alpha (opacity, 0–1) for a color. Usage, options, and live examples."
---

# AlphaSlider

A **built-in** tag for an alpha slider — a thin track that fades a color from transparent to
opaque, for picking an alpha (opacity) from 0 to 1. It's one of Mantine's color-picker
building blocks. It ships with Aardvark, so it's a single tag with no setup. Set the base
`color` so the track can show the fade, and `defaultValue` for the starting opacity (it
starts fully opaque, `1`, when you leave it off).

Use it as `{% raw %}{% alphaslider %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'alphaslider', …)`.

## Demonstrations

### Basic alpha

Set the base `color` (so the track can render its fade) and a `defaultValue` from 0
(transparent) to 1 (opaque). Drag to change the opacity.

{% alphaslider color='#1c7ed6' defaultValue=0.6 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% alphaslider color='#1c7ed6' defaultValue=0.6 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'alphaslider', color='#1c7ed6', defaultValue=0.6)
```
{% endAccordionSection %}
{% endAccordion %}

### Colors and sizes

Any base `color` paints the track's fade; `size` sets the track thickness (`xs`, `sm`, `md`,
`lg`, `xl`). The band comes with fully rounded ends and no attribute changes that shape —
restyle `.mantine-AlphaSlider-sliderOverlay` (see the CSS selectors below) for a different one.

{% alphaslider color='#fa5252' defaultValue=0.4 size='xl' %}

{% alphaslider color='#40c057' defaultValue=0.8 size='sm' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% alphaslider color='#fa5252' defaultValue=0.4 size='xl' %}
{% alphaslider color='#40c057' defaultValue=0.8 size='sm' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'alphaslider', color='#fa5252', defaultValue=0.4, size='xl')
component('aardvark', 'alphaslider', color='#40c057', defaultValue=0.8, size='sm')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Generate one alpha slider per swatch from data with a Python loop — the same
`component('aardvark', 'alphaslider', …)` call, once per item, laid out in a card grid.

{%
swatches = [
    {"name": "Primary", "color": "#1c7ed6", "alpha": 0.9},
    {"name": "Success", "color": "#40c057", "alpha": 0.6},
    {"name": "Danger", "color": "#fa5252", "alpha": 0.4},
]
controls = ''
for s in swatches:
    row = '**' + s["name"] + '**\n\n' + component(
        'aardvark', 'alphaslider', color=s["color"], defaultValue=s["alpha"], size='lg',
    )
    controls += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
swatches = [
    {"name": "Primary", "color": "#1c7ed6", "alpha": 0.9},
    {"name": "Success", "color": "#40c057", "alpha": 0.6},
    {"name": "Danger", "color": "#fa5252", "alpha": 0.4},
]
controls = ''
for s in swatches:
    row = '**' + s["name"] + '**\n\n' + component(
        'aardvark', 'alphaslider', color=s["color"], defaultValue=s["alpha"], size='lg',
    )
    controls += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Values | Description |
| --- | --- | --- |
| `color` | color string | The base color the alpha applies to (e.g. `#1c7ed6`). Without it the track has no fade to show. |
| `defaultValue` | number `0`–`1` | Starting alpha — the reader can drag it. `0` is transparent, `1` is opaque (the default). |
| `size` | `xs`, `sm`, `md` (default), `lg`, `xl` | Track thickness. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the slider's root element. |

## CSS Selectors

Target a `{% raw %}{% alphaslider %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every AlphaSlider instance on the page */
[data-aardvark-island="AlphaSlider"] { }

/* Mantine Styles API parts */
.mantine-AlphaSlider-slider { }
.mantine-AlphaSlider-sliderOverlay { }
.mantine-AlphaSlider-thumb { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. The `change` event fires once a drag ends, or each time an arrow key steps the value — not continuously while dragging — and carries the new alpha rounded to two decimals. Here it is wired to `onchange`, so releasing the thumb reads the new value, logs it to the console, and alerts it:

{% alphaslider color='#1c7ed6' defaultValue=0.6 attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% alphaslider color='#1c7ed6' defaultValue=0.6 attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'alphaslider', color='#1c7ed6', defaultValue=0.6, attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

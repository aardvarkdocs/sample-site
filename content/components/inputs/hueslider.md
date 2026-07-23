---
title: "HueSlider"
description: "The built-in hueslider tag — pick a hue (0–360) along the color spectrum. Usage, options, and live examples."
---

# HueSlider

A **built-in** tag for a hue slider — a thin track of the full color spectrum for picking a
hue from 0 to 360. It's one of Mantine's color-picker building blocks. It ships with aardvark,
so it's a single tag with no setup. Set `defaultValue` for the starting hue, and tune the
track with `size` and `radius`.

Use it as `{% raw %}{% hueslider %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'hueslider', …)`.

## Demonstrations

### Basic hue

Set a `defaultValue` from 0 to 360 (the starting hue). Drag along the spectrum to change it.

{% hueslider defaultValue=120 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% hueslider defaultValue=120 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hueslider', defaultValue=120)
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes and radius

`size` sets the track thickness (`xs`–`xl`) and `radius` rounds its ends (`xs`–`xl`).

{% hueslider defaultValue=0 size='xl' radius='xl' %}

{% hueslider defaultValue=200 size='sm' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% hueslider defaultValue=0 size='xl' radius='xl' %}
{% hueslider defaultValue=200 size='sm' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'hueslider', defaultValue=0, size='xl', radius='xl')
component('aardvark', 'hueslider', defaultValue=200, size='sm')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Generate one hue slider per channel from data with a Python loop — the same
`component('aardvark', 'hueslider', …)` call, once per item, laid out in a card grid.

{%
channels = [
    {"name": "Red zone", "hue": 0},
    {"name": "Green zone", "hue": 120},
    {"name": "Blue zone", "hue": 240},
]
controls = ''
for c in channels:
    row = '**' + c["name"] + '**\n\n' + component(
        'aardvark', 'hueslider', defaultValue=c["hue"], size='lg',
    )
    controls += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
channels = [
    {"name": "Red zone", "hue": 0},
    {"name": "Green zone", "hue": 120},
    {"name": "Blue zone", "hue": 240},
]
controls = ''
for c in channels:
    row = '**' + c["name"] + '**\n\n' + component(
        'aardvark', 'hueslider', defaultValue=c["hue"], size='lg',
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
| `defaultValue` | integer `0`–`360` | Starting hue — the reader can drag it. |
| `size` | `xs`–`xl` | Track thickness. |
| `radius` | `xs`–`xl` | Corner rounding of the track ends. |
| `attr` | raw-HTML map | Extra HTML attributes, passed as `attr={…}`. |

## CSS Selectors

Target a `{% raw %}{% hueslider %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every HueSlider instance on the page */
[data-aardvark-island="HueSlider"] { }

/* Mantine Styles API parts */
.mantine-HueSlider-slider { }
.mantine-HueSlider-sliderOverlay { }
.mantine-HueSlider-thumb { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so dragging the hue control reads the changed control value, logs it to the console, and alerts it:

{% hueslider defaultValue=120 attr={'onchange': '''
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
{% hueslider defaultValue=120 attr={'onchange': '''
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
component('aardvark', 'hueslider', defaultValue=120, attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

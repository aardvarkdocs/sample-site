---
title: "AngleSlider"
description: "The built-in angleslider tag — pick an angle on a dial (0–360°). Usage, options, marks, and live examples."
---

# AngleSlider

A **built-in** tag for an angle slider — a circular dial for picking an angle from 0 to 360
degrees. It ships with aardvark, so it's a single tag with no setup. Set the dial diameter
with `size`, the starting angle with `defaultValue`, and the increment with `step`.

Use it as `{% raw %}{% angleslider %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'angleslider', …)`.

## Demonstrations

### Basic dial

Set `defaultValue` (in degrees) and a `size`. Drag around the dial to change it.

{% angleslider size=80 defaultValue=90 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% angleslider size=80 defaultValue=90 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'angleslider', size=80, defaultValue=90)
```
{% endAccordionSection %}
{% endAccordion %}

### Stepping and marks

`step` snaps the angle to a fixed increment; `marks` adds labelled ticks as a JSON array of
`{value, label}`. A larger `thumbSize` makes the handle easier to grab.

{% angleslider size=100 step=45 thumbSize=12 defaultValue=45 marks='[{"value": 0, "label": "N"}, {"value": 90, "label": "E"}, {"value": 180, "label": "S"}, {"value": 270, "label": "W"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% angleslider size=100 step=45 thumbSize=12 defaultValue=45 marks='[{"value": 0, "label": "N"}, {"value": 90, "label": "E"}, {"value": 180, "label": "S"}, {"value": 270, "label": "W"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'angleslider',
          size=100, step=45, thumbSize=12, defaultValue=45,
          marks='[{"value": 0, "label": "N"}, {"value": 90, "label": "E"}, {"value": 180, "label": "S"}, {"value": 270, "label": "W"}]')
```
{% endAccordionSection %}
{% endAccordion %}

### No center label, and disabled

The center shows the current degree label by default. Set `withLabel=false` to hide it, and
add the bare `disabled` flag for a read-only dial.

{% angleslider size=80 defaultValue=135 withLabel=false %}

{% angleslider size=80 defaultValue=200 disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% angleslider size=80 defaultValue=135 withLabel=false %}
{% angleslider size=80 defaultValue=200 disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'angleslider', size=80, defaultValue=135, withLabel=False)
component('aardvark', 'angleslider', size=80, defaultValue=200, disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Generate one dial per axis from data with a Python loop — the same
`component('aardvark', 'angleslider', …)` call, once per item, laid out in a card grid.

{%
axes = [
    {"name": "Heading", "value": 45},
    {"name": "Pitch", "value": 270},
    {"name": "Roll", "value": 135},
]
dials = ''
for a in axes:
    row = '**' + a["name"] + '**\n\n' + component(
        'aardvark', 'angleslider', size=90, step=15, defaultValue=a["value"],
    )
    dials += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=dials))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
axes = [
    {"name": "Heading", "value": 45},
    {"name": "Pitch", "value": 270},
    {"name": "Roll", "value": 135},
]
dials = ''
for a in axes:
    row = '**' + a["name"] + '**\n\n' + component(
        'aardvark', 'angleslider', size=90, step=15, defaultValue=a["value"],
    )
    dials += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=dials))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Values | Description |
| --- | --- | --- |
| `size` | integer | Diameter of the dial in pixels. |
| `step` | integer | Increment per move, in degrees. |
| `defaultValue` | integer | Starting angle in degrees — the reader can drag it. |
| `thumbSize` | integer | Diameter of the thumb in pixels. |
| `marks` | JSON array string | Labelled ticks as `[{"value": n, "label": "…"}, …]`. |
| `withLabel` | boolean | Show the degree label in the center (on by default; set `false` to hide). |
| `disabled` | boolean | Make the dial read-only. |
| `attr` | raw-HTML map | Extra HTML attributes, passed as `attr={…}`. |

The center label format (`formatLabel` in Mantine) is a JavaScript function rather than a
value, so it can't be set from a build-time tag or `component('aardvark', 'angleslider', …)`
call — the dial shows the raw degree value. Toggle it off entirely with `withLabel=false`.

## CSS Selectors

Target a `{% raw %}{% angleslider %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every AngleSlider instance on the page */
[data-aardvark-island="AngleSlider"] { }

/* Mantine Styles API parts */
.mantine-AngleSlider-root { }
.mantine-AngleSlider-thumb { }
.mantine-AngleSlider-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so turning the dial reads the changed control value, logs it to the console, and alerts it:

{% angleslider size=80 defaultValue=90 attr={'onchange': '''
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
{% angleslider size=80 defaultValue=90 attr={'onchange': '''
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
component('aardvark', 'angleslider', size=80, defaultValue=90, attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

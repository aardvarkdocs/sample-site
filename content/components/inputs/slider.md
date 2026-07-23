---
title: "Slider"
description: "The built-in slider tag — pick a number in a range, with marks. Usage, options, marks, colors, and live examples."
---

# Slider

A **built-in** tag for a slider — let the reader pick a number within a range by dragging a
thumb. It ships with aardvark, so it's a single tag with no setup. Tune the bounds with `min`
and `max`, the increment with `step`, and the starting position with `defaultValue`.

Use it as `{% raw %}{% slider %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'slider', …)`.

## Demonstrations

### Basic range

Set `min`, `max`, `step`, and a `defaultValue`. Drag the thumb to change it.

{% slider min=0 max=100 step=5 defaultValue=40 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% slider min=0 max=100 step=5 defaultValue=40 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'slider', min=0, max=100, step=5, defaultValue=40)
```
{% endAccordionSection %}
{% endAccordion %}

### Marks

Pass `marks` as a JSON array of `{value, label}` objects. Add `restrictToMarks` to snap the
thumb to those positions only.

{% slider min=0 max=100 defaultValue=50 color='grape' marks='[{"value": 0, "label": "0%"}, {"value": 50, "label": "50%"}, {"value": 100, "label": "100%"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% slider min=0 max=100 defaultValue=50 color='grape' marks='[{"value": 0, "label": "0%"}, {"value": 50, "label": "50%"}, {"value": 100, "label": "100%"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
The `marks` array rides through as a native Python list of dicts:

```python
component('aardvark', 'slider',
          min=0, max=100, defaultValue=50, color='grape',
          marks='[{"value": 0, "label": "0%"}, {"value": 50, "label": "50%"}, {"value": 100, "label": "100%"}]')
```
{% endAccordionSection %}
{% endAccordion %}

### Colors, sizes, and inverted fill

Any theme `color` paints the filled track; `size` and `radius` take `xs`–`xl`. Add `inverted`
to fill from the max side instead of the min, and `labelAlwaysOn` to keep the value bubble
visible.

{% slider defaultValue=30 color='teal' size='lg' labelAlwaysOn=true %}

{% slider defaultValue=70 color='orange' radius='xl' inverted=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% slider defaultValue=30 color='teal' size='lg' labelAlwaysOn=true %}
{% slider defaultValue=70 color='orange' radius='xl' inverted=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'slider', defaultValue=30, color='teal', size='lg', labelAlwaysOn=True)
component('aardvark', 'slider', defaultValue=70, color='orange', radius='xl', inverted=True)
```
{% endAccordionSection %}
{% endAccordion %}

### Disabled

Add the bare `disabled` flag to make the slider read-only.

{% slider defaultValue=60 disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% slider defaultValue=60 disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'slider', defaultValue=60, disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Build a labelled control inside a `{% raw %}{% card %}{% endraw %}`, and generate a whole row
of sliders from data with a Python loop — the same `component('aardvark', 'slider', …)` call,
once per item.

{%
levels = [
    {"name": "Bass", "value": 70, "color": "blue"},
    {"name": "Mid", "value": 45, "color": "grape"},
    {"name": "Treble", "value": 60, "color": "teal"},
]
mixer = ''
for level in levels:
    row = '**' + level["name"] + '**\n\n' + component(
        'aardvark', 'slider',
        min=0, max=100, defaultValue=level["value"],
        color=level["color"], labelAlwaysOn=True,
    )
    mixer += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=mixer))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
levels = [
    {"name": "Bass", "value": 70, "color": "blue"},
    {"name": "Mid", "value": 45, "color": "grape"},
    {"name": "Treble", "value": 60, "color": "teal"},
]
mixer = ''
for level in levels:
    row = '**' + level["name"] + '**\n\n' + component(
        'aardvark', 'slider',
        min=0, max=100, defaultValue=level["value"],
        color=level["color"], labelAlwaysOn=True,
    )
    mixer += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=mixer))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Values | Description |
| --- | --- | --- |
| `min` | number | Lower bound of the range (default `0`). |
| `max` | number | Upper bound of the range (default `100`). |
| `step` | number | Increment per move. |
| `defaultValue` | number | Starting value — the reader can drag it. |
| `marks` | JSON array string | Tick marks as `[{"value": n, "label": "…"}, …]`. |
| `color` | theme color | Fill color of the track (e.g. `blue`, `grape`, `teal`). |
| `size` | `xs`–`xl` | Track thickness. |
| `radius` | `xs`–`xl` | Corner rounding of the track. |
| `label` | string | Static text for the thumb tip (a plain string sets a fixed label). |
| `labelAlwaysOn` | boolean | Keep the value bubble visible, not only while dragging. |
| `inverted` | boolean | Fill from the max side instead of the min. |
| `restrictToMarks` | boolean | Snap the thumb to the `marks` positions only. |
| `showLabelOnHover` | boolean | Show the label on hover (on by default; set `false` to suppress). |
| `disabled` | boolean | Make the slider read-only. |
| `attr` | raw-HTML map | Extra HTML attributes, passed as `attr={…}`. |

## CSS Selectors

Target a `{% raw %}{% slider %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Slider instance on the page */
[data-aardvark-island="Slider"] { }

/* Mantine Styles API parts */
.mantine-Slider-root { }
.mantine-Slider-track { }
.mantine-Slider-bar { }
.mantine-Slider-thumb { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so dragging the slider reads the changed control value, logs it to the console, and alerts it:

{% slider min=0 max=100 step=5 defaultValue=40 attr={'onchange': '''
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
{% slider min=0 max=100 step=5 defaultValue=40 attr={'onchange': '''
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
component('aardvark', 'slider', min=0, max=100, step=5, defaultValue=40, attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

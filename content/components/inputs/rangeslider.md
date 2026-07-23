---
title: "RangeSlider"
description: "The built-in rangeslider tag — pick a range with two thumbs. Usage, the defaultValue pair, marks, options, and live examples."
---

# RangeSlider

A **built-in** tag for a range slider — let the reader pick a low and high bound by dragging
either of two thumbs. It ships with aardvark, so it's a single tag with no setup. The
`defaultValue` is a pair of numbers (the starting low and high), and `minRange` keeps the two
thumbs a minimum distance apart.

Use it as `{% raw %}{% rangeslider %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'rangeslider', …)`.

## Demonstrations

### Basic range

Set `min`, `max`, and a `defaultValue` of **two numbers** — the starting low and high. Drag
either thumb.

{% rangeslider min=0 max=100 defaultValue='20, 80' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rangeslider min=0 max=100 defaultValue='20, 80' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
The `defaultValue` pair stays a `'low, high'` string — the macro parses it into a two-number
list:

```python
component('aardvark', 'rangeslider', min=0, max=100, defaultValue='20, 80')
```
{% endAccordionSection %}
{% endAccordion %}

### Marks and a minimum gap

Pass `marks` as a JSON array of `{value, label}`, and `minRange` to fix the smallest gap the
two thumbs may have. Add `restrictToMarks` to snap to the marks only.

{% rangeslider min=0 max=100 defaultValue='25, 75' minRange=10 color='teal' marks='[{"value": 0, "label": "0"}, {"value": 50, "label": "50"}, {"value": 100, "label": "100"}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rangeslider min=0 max=100 defaultValue='25, 75' minRange=10 color='teal' marks='[{"value": 0, "label": "0"}, {"value": 50, "label": "50"}, {"value": 100, "label": "100"}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rangeslider',
          min=0, max=100, defaultValue='25, 75', minRange=10, color='teal',
          marks='[{"value": 0, "label": "0"}, {"value": 50, "label": "50"}, {"value": 100, "label": "100"}]')
```
{% endAccordionSection %}
{% endAccordion %}

### Colors, sizes, and inverted fill

`color` paints the filled span between the thumbs; `size` and `radius` take `xs`–`xl`. Add
`inverted` to fill the outside instead of the inside, and `labelAlwaysOn` to keep both value
bubbles visible.

{% rangeslider defaultValue='30, 60' size='lg' color='grape' labelAlwaysOn=true %}

{% rangeslider defaultValue='30, 70' color='orange' inverted=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rangeslider defaultValue='30, 60' size='lg' color='grape' labelAlwaysOn=true %}
{% rangeslider defaultValue='30, 70' color='orange' inverted=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rangeslider', defaultValue='30, 60', size='lg', color='grape', labelAlwaysOn=True)
component('aardvark', 'rangeslider', defaultValue='30, 70', color='orange', inverted=True)
```
{% endAccordionSection %}
{% endAccordion %}

### Disabled

Add the bare `disabled` flag to make the range read-only.

{% rangeslider defaultValue='40, 60' disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rangeslider defaultValue='40, 60' disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rangeslider', defaultValue='40, 60', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Generate one range slider per filter from data with a Python loop — the same
`component('aardvark', 'rangeslider', …)` call, once per item, laid out in a card grid.

{%
filters = [
    {"name": "Price ($)", "min": 0, "max": 500, "default": "100, 350", "color": "blue"},
    {"name": "Rating", "min": 0, "max": 5, "default": "3, 5", "color": "teal"},
    {"name": "Weight (kg)", "min": 0, "max": 20, "default": "2, 8", "color": "grape"},
]
controls = ''
for f in filters:
    row = '**' + f["name"] + '**\n\n' + component(
        'aardvark', 'rangeslider',
        min=f["min"], max=f["max"], defaultValue=f["default"],
        color=f["color"], labelAlwaysOn=True,
    )
    controls += component('aardvark', 'card', variant='plain', children=row)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
filters = [
    {"name": "Price ($)", "min": 0, "max": 500, "default": "100, 350", "color": "blue"},
    {"name": "Rating", "min": 0, "max": 5, "default": "3, 5", "color": "teal"},
    {"name": "Weight (kg)", "min": 0, "max": 20, "default": "2, 8", "color": "grape"},
]
controls = ''
for f in filters:
    row = '**' + f["name"] + '**\n\n' + component(
        'aardvark', 'rangeslider',
        min=f["min"], max=f["max"], defaultValue=f["default"],
        color=f["color"], labelAlwaysOn=True,
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
| `min` | number | Lower bound of the range (default `0`). |
| `max` | number | Upper bound of the range (default `100`). |
| `step` | number | Increment per move. |
| `defaultValue` | `'low, high'` string | Starting low and high pair (e.g. `'20, 80'`) — the reader can drag both. |
| `minRange` | number | Smallest allowed gap between the two thumbs. |
| `marks` | JSON array string | Tick marks as `[{"value": n, "label": "…"}, …]`. |
| `color` | theme color | Fill color of the span between the thumbs. |
| `size` | `xs`–`xl` | Track thickness. |
| `radius` | `xs`–`xl` | Corner rounding of the track. |
| `label` | string | Static text for the thumb tips. |
| `labelAlwaysOn` | boolean | Keep the value bubbles visible, not only while dragging. |
| `inverted` | boolean | Fill the outside instead of the inside. |
| `restrictToMarks` | boolean | Snap the thumbs to the `marks` positions only. |
| `showLabelOnHover` | boolean | Show the labels on hover (on by default; set `false` to suppress). |
| `disabled` | boolean | Make the range read-only. |
| `attr` | raw-HTML map | Extra HTML attributes, passed as `attr={…}`. |

## CSS Selectors

Target a `{% raw %}{% rangeslider %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every RangeSlider instance on the page */
[data-aardvark-island="RangeSlider"] { }

/* Mantine Styles API parts */
.mantine-RangeSlider-root { }
.mantine-RangeSlider-track { }
.mantine-RangeSlider-bar { }
.mantine-RangeSlider-thumb { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so dragging either thumb reads the range values, logs them to the console, and alerts them:

{% rangeslider min=0 max=100 defaultValue='20, 80' attr={'onchange': '''
const controls = Array.from(this.querySelectorAll('[role="slider"], input'));
const value = controls.map((control) => control.value || control.getAttribute('aria-valuenow')).filter(Boolean).join(' - ');
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rangeslider min=0 max=100 defaultValue='20, 80' attr={'onchange': '''
const controls = Array.from(this.querySelectorAll('[role="slider"], input'));
const value = controls.map((control) => control.value || control.getAttribute('aria-valuenow')).filter(Boolean).join(' - ');
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rangeslider', min=0, max=100, defaultValue='20, 80', attr={'onchange': '''
const controls = Array.from(this.querySelectorAll('[role="slider"], input'));
const value = controls.map((control) => control.value || control.getAttribute('aria-valuenow')).filter(Boolean).join(' - ');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

---
title: "ColorPicker"
description: "The built-in colorpicker tag — an inline saturation + hue (+ alpha) picker. Usage, formats, swatches, options, and live examples."
---

# ColorPicker

A **built-in** tag for an inline color picker — a saturation field plus a hue slider (and, for
the alpha formats, an opacity slider), shown directly on the page rather than in a dropdown.
It ships with aardvark, so it's a single tag with no setup. Set a `format`, an optional
`defaultValue`, and optional preset `swatches`.

Use it as `{% raw %}{% colorpicker %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'colorpicker', …)`.

## Demonstrations

### Basic picker

Set a `format` and an optional `defaultValue`. Drag in the saturation field and on the hue
slider.

{% colorpicker format='hex' defaultValue='#1c7ed6' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorpicker format='hex' defaultValue='#1c7ed6' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorpicker', format='hex', defaultValue='#1c7ed6')
```
{% endAccordionSection %}
{% endAccordion %}

### Alpha format and swatches

The `*a` formats (`rgba`, `hsla`, `hexa`) add an opacity slider. Pass `swatches` as a
comma-separated list and `swatchesPerRow` to control the grid width.

{% colorpicker format='rgba' defaultValue='rgba(28, 126, 214, 0.8)' swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2' swatchesPerRow=5 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorpicker format='rgba' defaultValue='rgba(28, 126, 214, 0.8)' swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2' swatchesPerRow=5 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
The `swatches` string is split on commas into the list Mantine expects:

```python
component('aardvark', 'colorpicker',
          format='rgba', defaultValue='rgba(28, 126, 214, 0.8)',
          swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2', swatchesPerRow=5)
```
{% endAccordionSection %}
{% endAccordion %}

### Sizes and full width

`size` scales the control (`xs`–`xl`), and `fullWidth` stretches it to the container's width.

{% colorpicker format='hex' defaultValue='#7950f2' size='xl' fullWidth=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorpicker format='hex' defaultValue='#7950f2' size='xl' fullWidth=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorpicker', format='hex', defaultValue='#7950f2', size='xl', fullWidth=True)
```
{% endAccordionSection %}
{% endAccordion %}

### Swatches only

Turn the picker off with `withPicker=false` to offer a fixed palette and nothing else.

{% colorpicker format='hex' withPicker=false swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorpicker format='hex' withPicker=false swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorpicker',
          format='hex', withPicker=False,
          swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Generate one swatches-only picker per palette from data with a Python loop — the same
`component('aardvark', 'colorpicker', …)` call, once per item, laid out in a card grid.

{%
palettes = [
    {"name": "Warm", "colors": "#fa5252, #fab005, #fd7e14"},
    {"name": "Cool", "colors": "#228be6, #15aabf, #40c057"},
    {"name": "Royal", "colors": "#7950f2, #be4bdb, #e64980"},
]
controls = ''
for p in palettes:
    picker = '**' + p["name"] + '**\n\n' + component(
        'aardvark', 'colorpicker',
        format='hex', withPicker=False, swatches=p["colors"], swatchesPerRow=3,
    )
    controls += component('aardvark', 'card', variant='plain', children=picker)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
palettes = [
    {"name": "Warm", "colors": "#fa5252, #fab005, #fd7e14"},
    {"name": "Cool", "colors": "#228be6, #15aabf, #40c057"},
    {"name": "Royal", "colors": "#7950f2, #be4bdb, #e64980"},
]
controls = ''
for p in palettes:
    picker = '**' + p["name"] + '**\n\n' + component(
        'aardvark', 'colorpicker',
        format='hex', withPicker=False, swatches=p["colors"], swatchesPerRow=3,
    )
    controls += component('aardvark', 'card', variant='plain', children=picker)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Values | Description |
| --- | --- | --- |
| `defaultValue` | string | Starting color (matching the `format`). |
| `format` | `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla` | Color format; the `*a` formats add the alpha (opacity) slider. |
| `swatches` | comma-separated colors | Preset swatches below the picker (e.g. `'#fa5252, #228be6'`). |
| `swatchesPerRow` | integer | How many swatches per row. |
| `size` | `xs`–`xl` | Size of the control. |
| `fullWidth` | boolean | Stretch the control to the container's width. |
| `withPicker` | boolean | Show the saturation field and sliders (on by default; set `false` to show only swatches). |
| `attr` | raw-HTML map | Extra HTML attributes, passed as `attr={…}`. |

## CSS Selectors

Target a `{% raw %}{% colorpicker %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every ColorPicker instance on the page */
[data-aardvark-island="ColorPicker"] { }

/* Mantine Styles API parts */
.mantine-ColorPicker-wrapper { }
.mantine-ColorPicker-saturation { }
.mantine-ColorPicker-slider { }
.mantine-ColorPicker-swatch { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the picker reads the changed control value, logs it to the console, and alerts it:

{% colorpicker format='hex' defaultValue='#1c7ed6' attr={'onchange': '''
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
{% colorpicker format='hex' defaultValue='#1c7ed6' attr={'onchange': '''
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
component('aardvark', 'colorpicker', format='hex', defaultValue='#1c7ed6', attr={'onchange': '''
const control = event.target.closest('[role="slider"], input') || this.querySelector('[role="slider"], input');
const value = this.value || this.dataset.aardvarkValue || (control ? (control.value || control.getAttribute('aria-valuenow')) : '');
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

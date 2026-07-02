---
title: "ColorInput"
description: "The built-in colorinput tag — a text input with a color swatch and dropdown picker. Usage, formats, swatches, options, and live examples."
---

# ColorInput

A **built-in** tag for a color input — a text field with a color swatch and a dropdown color
picker. It ships with aardvark, so it's a single tag with no setup. Give it a `label`, a
`format` (how the value reads back), and an optional `defaultValue`; the reader can type a
value, pick from the dropdown, or use the eye-dropper.

Use it as `{% raw %}{% colorinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'colorinput', …)`.

## Demonstrations

### Basic input

Add a `label`, a `format`, and an optional `defaultValue`. Click the swatch to open the
picker.

{% colorinput label='Brand color' format='hex' defaultValue='#1c7ed6' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorinput label='Brand color' format='hex' defaultValue='#1c7ed6' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorinput', label='Brand color', format='hex', defaultValue='#1c7ed6')
```
{% endAccordionSection %}
{% endAccordion %}

### Description and placeholder

`description` adds helper text under the label, and `placeholder` fills the empty field.

{% colorinput label='Accent color' description='Used for links and buttons' placeholder='Pick a color' format='hex' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorinput label='Accent color' description='Used for links and buttons' placeholder='Pick a color' format='hex' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorinput',
          label='Accent color', description='Used for links and buttons',
          placeholder='Pick a color', format='hex')
```
{% endAccordionSection %}
{% endAccordion %}

### Preset swatches

Pass `swatches` as a comma-separated list of colors to offer presets under the picker.

{% colorinput label='Pick a preset' format='hex' swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorinput label='Pick a preset' format='hex' swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
The `swatches` string is split on commas into the list Mantine expects:

```python
component('aardvark', 'colorinput',
          label='Pick a preset', format='hex',
          swatches='#fa5252, #228be6, #40c057, #fab005, #7950f2')
```
{% endAccordionSection %}
{% endAccordion %}

### Formats, pick-only, and sizes

The `format` controls how the value reads back — including the `*a` formats with alpha. Add
`disallowInput` for a pick-only field (no typing), `disabled` for a read-only one, and `size`
/ `radius` (`xs`–`xl`) to scale it.

{% colorinput label='RGBA' format='rgba' defaultValue='rgba(28, 126, 214, 0.6)' size='lg' %}

{% colorinput label='Pick only' format='hex' defaultValue='#40c057' disallowInput=true %}

{% colorinput label='Disabled' format='hex' defaultValue='#fab005' disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorinput label='RGBA' format='rgba' defaultValue='rgba(28, 126, 214, 0.6)' size='lg' %}
{% colorinput label='Pick only' format='hex' defaultValue='#40c057' disallowInput=true %}
{% colorinput label='Disabled' format='hex' defaultValue='#fab005' disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorinput', label='RGBA', format='rgba', defaultValue='rgba(28, 126, 214, 0.6)', size='lg')
component('aardvark', 'colorinput', label='Pick only', format='hex', defaultValue='#40c057', disallowInput=True)
component('aardvark', 'colorinput', label='Disabled', format='hex', defaultValue='#fab005', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Generate one color input per brand token from data with a Python loop — the same
`component('aardvark', 'colorinput', …)` call, once per item, laid out in a card grid.

{%
tokens = [
    {"name": "Primary", "value": "#1c7ed6"},
    {"name": "Success", "value": "#40c057"},
    {"name": "Warning", "value": "#fab005"},
]
controls = ''
for t in tokens:
    field = component(
        'aardvark', 'colorinput',
        label=t["name"], format='hex', defaultValue=t["value"],
    )
    controls += component('aardvark', 'card', variant='plain', children=field)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
%}

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
tokens = [
    {"name": "Primary", "value": "#1c7ed6"},
    {"name": "Success", "value": "#40c057"},
    {"name": "Warning", "value": "#fab005"},
]
controls = ''
for t in tokens:
    field = component(
        'aardvark', 'colorinput',
        label=t["name"], format='hex', defaultValue=t["value"],
    )
    controls += component('aardvark', 'card', variant='plain', children=field)
page.print(component('aardvark', 'cardGrid', cols={'base': 1, 'sm': 3}, children=controls))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default.

| Attribute | Values | Description |
| --- | --- | --- |
| `label` | string | Field label. |
| `description` | string | Helper text below the label. |
| `placeholder` | string | Placeholder text for the empty field. |
| `defaultValue` | string | Starting color (matching the `format`). |
| `format` | `hex`, `hexa`, `rgb`, `rgba`, `hsl`, `hsla` | How the value reads back; the `*a` formats add an alpha channel. |
| `swatches` | comma-separated colors | Preset swatches shown under the picker (e.g. `'#fa5252, #228be6'`). |
| `size` | `xs`–`xl` | Field size. |
| `radius` | `xs`–`xl` | Corner rounding of the field. |
| `withPicker` | boolean | Show the dropdown picker (on by default; set `false` for swatch/text only). |
| `disallowInput` | boolean | Pick-only — disable typing into the field. |
| `withEyeDropper` | boolean | Show the eye-dropper button (on by default, where the browser supports it). |
| `disabled` | boolean | Make the field read-only. |
| `attr` | raw-HTML map | Extra HTML attributes, passed as `attr={…}`. |

## CSS Selectors

Target a `{% colorinput %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every ColorInput instance on the page */
[data-aardvark-island="ColorInput"] { }

/* Mantine Styles API parts */
.mantine-ColorInput-root { }
.mantine-ColorInput-input { }
.mantine-ColorInput-colorPreview { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% colorinput label='Brand color' format='hex' defaultValue='#1c7ed6' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% colorinput label='Brand color' format='hex' defaultValue='#1c7ed6' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'colorinput', label='Brand color', format='hex', defaultValue='#1c7ed6', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

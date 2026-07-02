---
title: "Chip"
description: "The built-in chip tag — a checkbox or radio styled as a selectable pill. Usage, options, variants, colors, sizes, types, and live examples."
---

# Chip

A chip — a checkbox or radio styled as a selectable pill. The label is the block body
or the `text` attribute, and the chip is interactive — readers can toggle it. Add
`defaultChecked` to start it selected, and pick `type` (`checkbox` or `radio`).

Use it as `{% raw %}{% chip %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'chip', …)`.

## Label and default state

The label is the block body or the `text` attribute. `defaultChecked` starts it
selected.

{% chip %}React{% endChip %} {% chip defaultChecked=true color='grape' %}Selected{% endChip %} {% chip text='Vue' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% chip %}React{% endChip %}
{% chip defaultChecked=true color='grape' %}Selected{% endChip %}
{% chip text='Vue' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'chip', children='React')
component('aardvark', 'chip', defaultChecked=True, color='grape', children='Selected')
component('aardvark', 'chip', text='Vue')
```
{% endAccordionSection %}
{% endAccordion %}

In a loop, render a row of chips from data:

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
for tag in ['React', 'Vue', 'Svelte']:
    component('aardvark', 'chip', children=tag)
```
{% endAccordionSection %}
{% endAccordion %}

## Variants

`variant` is `filled` (default), `light`, or `outline`.

{% chip defaultChecked=true %}filled{% endChip %} {% chip variant='light' defaultChecked=true %}light{% endChip %} {% chip variant='outline' defaultChecked=true %}outline{% endChip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% chip defaultChecked=true %}filled{% endChip %}
{% chip variant='light' defaultChecked=true %}light{% endChip %}
{% chip variant='outline' defaultChecked=true %}outline{% endChip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'chip', defaultChecked=True, children='filled')
component('aardvark', 'chip', variant='light', defaultChecked=True, children='light')
component('aardvark', 'chip', variant='outline', defaultChecked=True, children='outline')
```
{% endAccordionSection %}
{% endAccordion %}

## Colors, sizes, and radius

`color` is any theme color; `size` is `xs`–`xl`; `radius` rounds the pill.

{% chip color='green' defaultChecked=true %}green{% endChip %} {% chip color='orange' defaultChecked=true %}orange{% endChip %} {% chip size='lg' defaultChecked=true %}large{% endChip %} {% chip radius='sm' defaultChecked=true %}less round{% endChip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% chip color='green' defaultChecked=true %}green{% endChip %}
{% chip color='orange' defaultChecked=true %}orange{% endChip %}
{% chip size='lg' defaultChecked=true %}large{% endChip %}
{% chip radius='sm' defaultChecked=true %}less round{% endChip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'chip', color='green', defaultChecked=True, children='green')
component('aardvark', 'chip', color='orange', defaultChecked=True, children='orange')
component('aardvark', 'chip', size='lg', defaultChecked=True, children='large')
component('aardvark', 'chip', radius='sm', defaultChecked=True, children='less round')
```
{% endAccordionSection %}
{% endAccordion %}

## Type and disabled

`type='radio'` gives the chip a round selection marker (use it for one-of-many sets);
`disabled` makes it non-interactive.

{% chip type='radio' defaultChecked=true %}radio chip{% endChip %} {% chip disabled=true %}disabled{% endChip %} {% chip disabled=true defaultChecked=true %}disabled, selected{% endChip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% chip type='radio' defaultChecked=true %}radio chip{% endChip %}
{% chip disabled=true %}disabled{% endChip %}
{% chip disabled=true defaultChecked=true %}disabled, selected{% endChip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'chip', type='radio', defaultChecked=True, children='radio chip')
component('aardvark', 'chip', disabled=True, children='disabled')
component('aardvark', 'chip', disabled=True, defaultChecked=True,
          children='disabled, selected')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Combine chips with a heading and a [button](/components/buttons/button/) to build a
small filter row.

Filter by framework

{% chip defaultChecked=true %}React{% endChip %} {% chip %}Vue{% endChip %} {% chip %}Svelte{% endChip %}

{% button %}Apply{% endButton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Filter by framework

{% chip defaultChecked=true %}React{% endChip %}
{% chip %}Vue{% endChip %}
{% chip %}Svelte{% endChip %}

{% button %}Apply{% endButton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'chip', defaultChecked=True, children='React')
component('aardvark', 'chip', children='Vue')
component('aardvark', 'chip', children='Svelte')
component('aardvark', 'button', children='Apply')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `text` | string | The label, when not using the block body. |
| `variant` | `filled` (default), `light`, `outline` | Visual style of the pill. |
| `color` | theme color name (`blue`, `green`, …) | Fill / accent color when selected. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Overall size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner rounding of the pill. |
| `type` | `checkbox` (default), `radio` | Selection marker shape and grouping semantics. |
| `defaultChecked` | bare flag (`true`) | Start the chip selected. It stays interactive — the reader can toggle it. |
| `disabled` | bare flag (`true`) | Render non-interactive. |
| `autoContrast` | bare flag (`true`) | Auto-pick a readable label color against `color`. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered root. |

## CSS Selectors

Target a `{% chip %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Chip instance on the page */
[data-aardvark-island="Chip"] { }

/* Mantine Styles API parts */
.mantine-Chip-root { }
.mantine-Chip-label { }
.mantine-Chip-input { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so toggling it logs its checked state to the console and alerts it:

{% chip attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''} %}React{% endChip %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% chip attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''} %}React{% endChip %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'chip', children='React', attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

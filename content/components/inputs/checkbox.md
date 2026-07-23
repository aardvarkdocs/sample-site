---
title: "Checkbox"
description: "The built-in checkbox tag — a single labeled checkbox. Usage, options, and live examples (colors, sizes, label position, indeterminate, disabled)."
---

# Checkbox

A single checkbox with a label. The label is the `label` attribute or the block
body, and the box is interactive — readers can toggle it. Add `defaultChecked` to
start it ticked, or `indeterminate` for the mixed state.

Use it as `{% raw %}{% checkbox %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'checkbox', …)`.

## Label and default state

The label comes from the `label` attribute or the block body. Add `defaultChecked` to
start the box ticked.

{% checkbox label='Accept the terms' %}

{% checkbox defaultChecked=true color='green' %}Subscribe to updates{% endCheckbox %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% checkbox label='Accept the terms' %}

{% checkbox defaultChecked=true color='green' %}Subscribe to updates{% endCheckbox %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'checkbox', label='Accept the terms')

component('aardvark', 'checkbox', defaultChecked=True, color='green',
          children='Subscribe to updates')
```
{% endAccordionSection %}
{% endAccordion %}

## Colors and sizes

`color` is any theme color for the checked fill; `size` is `xs`–`xl`.

{% checkbox label='blue' defaultChecked=true %}
{% checkbox label='grape' color='grape' defaultChecked=true %}
{% checkbox label='large' size='lg' defaultChecked=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% checkbox label='blue' defaultChecked=true %}
{% checkbox label='grape' color='grape' defaultChecked=true %}
{% checkbox label='large' size='lg' defaultChecked=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'checkbox', label='blue', defaultChecked=True)
component('aardvark', 'checkbox', label='grape', color='grape', defaultChecked=True)
component('aardvark', 'checkbox', label='large', size='lg', defaultChecked=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Label position, indeterminate, and disabled

`labelPosition='left'` puts the label before the box; `indeterminate` shows the
mixed/partial state; `disabled` makes it non-interactive.

{% checkbox label='Label on the left' labelPosition='left' defaultChecked=true %}
{% checkbox label='Indeterminate' indeterminate=true %}
{% checkbox label='Disabled' disabled=true defaultChecked=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% checkbox label='Label on the left' labelPosition='left' defaultChecked=true %}
{% checkbox label='Indeterminate' indeterminate=true %}
{% checkbox label='Disabled' disabled=true defaultChecked=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'checkbox', label='Label on the left',
          labelPosition='left', defaultChecked=True)
component('aardvark', 'checkbox', label='Indeterminate', indeterminate=True)
component('aardvark', 'checkbox', label='Disabled', disabled=True, defaultChecked=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Radius, icon color, and helper text

`radius` rounds the corners; `iconColor` colors the check mark itself; `description`
and `error` add helper text below the label.

{% checkbox label='Rounded' radius='xl' defaultChecked=true %}
{% checkbox label='Custom check color' iconColor='yellow' color='dark' defaultChecked=true %}
{% checkbox label='With a description' description='We only email about outages.' defaultChecked=true %}
{% checkbox label='With an error' error='You must accept to continue.' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% checkbox label='Rounded' radius='xl' defaultChecked=true %}
{% checkbox label='Custom check color' iconColor='yellow' color='dark' defaultChecked=true %}
{% checkbox label='With a description' description='We only email about outages.' defaultChecked=true %}
{% checkbox label='With an error' error='You must accept to continue.' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'checkbox', label='Rounded', radius='xl', defaultChecked=True)
component('aardvark', 'checkbox', label='Custom check color', iconColor='yellow',
          color='dark', defaultChecked=True)
component('aardvark', 'checkbox', label='With a description',
          description='We only email about outages.', defaultChecked=True)
component('aardvark', 'checkbox', label='With an error',
          error='You must accept to continue.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a checkbox with surrounding text and a [button](/components/buttons/button/)
to build a small consent row.

Please review and confirm before continuing.

{% checkbox label='I have read the privacy policy' defaultChecked=true %}

{% button %}Continue{% endButton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Please review and confirm before continuing.

{% checkbox label='I have read the privacy policy' defaultChecked=true %}

{% button %}Continue{% endButton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'checkbox', label='I have read the privacy policy',
          defaultChecked=True)
component('aardvark', 'button', children='Continue')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The label, when not using the block body. Plain text — Markdown (e.g. `**bold**`) is not rendered. |
| `defaultChecked` | bare flag (`true`) | Start the box ticked. It stays interactive — the reader can toggle it. |
| `indeterminate` | bare flag (`true`) | Show the mixed/partial state (a dash instead of a check). |
| `disabled` | bare flag (`true`) | Render non-interactive. |
| `color` | theme color name (`blue`, `green`, `grape`, …) | Fill color when checked. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Overall size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner rounding of the box. |
| `labelPosition` | `right` (default), `left` | Which side of the box the label sits on. |
| `iconColor` | theme color name | Color of the check mark itself. |
| `description` | string | Helper text shown below the label. |
| `error` | string | Error text shown below the label (also marks the box invalid). |
| `autoContrast` | bare flag (`true`) | Auto-pick a readable check-mark color against `color`. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered root. |

## CSS Selectors

Target a `{% raw %}{% checkbox %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Checkbox instance on the page */
[data-aardvark-island="Checkbox"] { }

/* Mantine Styles API parts */
.mantine-Checkbox-root { }
.mantine-Checkbox-input { }
.mantine-Checkbox-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so toggling it logs its checked state to the console and alerts it:

{% checkbox label='Accept the terms' attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% checkbox label='Accept the terms' attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'checkbox', label='Accept the terms', attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

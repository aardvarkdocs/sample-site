---
title: "SegmentedControl"
description: "The built-in segmentedcontrol tag — a row of mutually exclusive options. Usage, the data list, defaultValue, colors, sizes, orientation, full width, and live examples."
---

# SegmentedControl

A segmented control — a row of mutually exclusive options, like a compact set of tabs.
Give `data` a comma-separated list of labels (or a JSON array of `{label, value}`
objects), and pick the starting option with `defaultValue`. The control is interactive,
so readers can switch between segments.

Use it as `{% raw %}{% segmentedcontrol %}{% endraw %}` in Markdown, or call it from
Python logic (loops, snippets) via `component('aardvark', 'segmentedcontrol', …)`.

## The data list and default value

`data` is a comma-separated list of labels; `defaultValue` is the one selected on load.

{% segmentedcontrol data='Preview, Code, Export' defaultValue='Code' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% segmentedcontrol data='Preview, Code, Export' defaultValue='Code' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol', data='Preview, Code, Export',
          defaultValue='Code')
```
{% endAccordionSection %}
{% endAccordion %}

From Python you can pass `data` as a real list of strings or `{label, value}` dicts —
handy when building it in a loop:

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol',
          data=['Preview', 'Code', 'Export'], defaultValue='Code')
```
{% endAccordionSection %}
{% endAccordion %}

## Separate label and value

When the value you store differs from the label, pass a **JSON array** of
`{label, value}` objects.

{% segmentedcontrol data='[{"label": "On", "value": "1"}, {"label": "Off", "value": "0"}]' defaultValue='1' color='teal' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% segmentedcontrol data='[{"label": "On", "value": "1"}, {"label": "Off", "value": "0"}]' defaultValue='1' color='teal' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol',
          data=[{'label': 'On', 'value': '1'}, {'label': 'Off', 'value': '0'}],
          defaultValue='1', color='teal')
```
{% endAccordionSection %}
{% endAccordion %}

## Colors, sizes, and radius

`color` tints the active indicator; `size` is `xs`–`xl`; `radius` rounds the track.

{% segmentedcontrol data='Light, Dark' color='grape' defaultValue='Dark' %}

{% segmentedcontrol data='S, M, L' size='lg' radius='xl' defaultValue='M' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% segmentedcontrol data='Light, Dark' color='grape' defaultValue='Dark' %}

{% segmentedcontrol data='S, M, L' size='lg' radius='xl' defaultValue='M' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol', data='Light, Dark', color='grape',
          defaultValue='Dark')
component('aardvark', 'segmentedcontrol', data='S, M, L', size='lg', radius='xl',
          defaultValue='M')
```
{% endAccordionSection %}
{% endAccordion %}

## Full width, orientation, and states

`fullWidth` stretches to the container; `orientation='vertical'` stacks the segments;
`disabled` greys it out; `readOnly` shows a selection the reader can't change;
`withItemsBorders=false` drops the dividers between segments.

{% segmentedcontrol data='Day, Week, Month, Year' fullWidth=true defaultValue='Week' %}

{% segmentedcontrol data='Top, Middle, Bottom' orientation='vertical' defaultValue='Middle' %}

{% segmentedcontrol data='Read, Write' defaultValue='Read' disabled=true %}

{% segmentedcontrol data='One, Two, Three' defaultValue='Two' withItemsBorders=false %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% segmentedcontrol data='Day, Week, Month, Year' fullWidth=true defaultValue='Week' %}

{% segmentedcontrol data='Top, Middle, Bottom' orientation='vertical' defaultValue='Middle' %}

{% segmentedcontrol data='Read, Write' defaultValue='Read' disabled=true %}

{% segmentedcontrol data='One, Two, Three' defaultValue='Two' withItemsBorders=false %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol', data='Day, Week, Month, Year',
          fullWidth=True, defaultValue='Week')
component('aardvark', 'segmentedcontrol', data='Top, Middle, Bottom',
          orientation='vertical', defaultValue='Middle')
component('aardvark', 'segmentedcontrol', data='Read, Write', defaultValue='Read',
          disabled=True)
component('aardvark', 'segmentedcontrol', data='One, Two, Three', defaultValue='Two',
          withItemsBorders=False)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a segmented control with a heading and a [button](/components/buttons/button/) to
build a small view-switcher row.

Choose a view

{% segmentedcontrol data='List, Grid, Calendar' defaultValue='Grid' fullWidth=true %}

{% button %}Apply{% endButton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Choose a view

{% segmentedcontrol data='List, Grid, Calendar' defaultValue='Grid' fullWidth=true %}

{% button %}Apply{% endButton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol', data='List, Grid, Calendar',
          defaultValue='Grid', fullWidth=True)
component('aardvark', 'button', children='Apply')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | comma-separated labels (`One, Two, Three`) or a JSON array of `{label, value}` | The options. A bare label list uses each label as its own value; from Python, also a real list of strings or dicts. |
| `defaultValue` | one of the option values | Which option starts selected. |
| `color` | theme color name (`blue`, `teal`, …) | Color of the active indicator. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Overall size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner rounding of the track. |
| `orientation` | `horizontal` (default), `vertical` | Lay the segments in a row or a column. |
| `fullWidth` | bare flag (`true`) | Stretch to the container's width. |
| `disabled` | bare flag (`true`) | Render non-interactive. |
| `readOnly` | bare flag (`true`) | Display-only — show a selection the reader can't change. |
| `withItemsBorders` | bare flag — `false` to turn off (on by default) | Dividers between items. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered root. |

## CSS Selectors

Target a `{% segmentedcontrol %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every SegmentedControl instance on the page */
[data-aardvark-island="SegmentedControl"] { }

/* Mantine Styles API parts */
.mantine-SegmentedControl-root { }
.mantine-SegmentedControl-control { }
.mantine-SegmentedControl-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so selecting a segment logs the active value to the console and alerts it:

{% segmentedcontrol data='Preview, Code, Export' defaultValue='Code' attr={'onchange': '''
const value = this.querySelector('input:checked')?.value ?? '(none)';
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% segmentedcontrol data='Preview, Code, Export' defaultValue='Code' attr={'onchange': '''
const value = this.querySelector('input:checked')?.value ?? '(none)';
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'segmentedcontrol', data='Preview, Code, Export', defaultValue='Code', attr={'onchange': '''
const value = this.querySelector('input:checked')?.value ?? '(none)';
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

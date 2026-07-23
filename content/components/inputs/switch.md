---
title: "Switch"
description: "The built-in switch tag — a toggle switch with a label and optional on/off track text. Usage, options, colors, sizes, label position, and live examples."
---

# Switch

A toggle switch with a label. The label is the `label` attribute or the block body,
and the switch is interactive — readers can flip it. Add `defaultChecked` to start it
on, and `onLabel` / `offLabel` for short text shown inside the track.

Use it as `{% raw %}{% switch %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'switch', …)`.

## Label, default state, and track text

The label comes from the `label` attribute or the block body. `defaultChecked` starts
it on; `onLabel` / `offLabel` print short text inside the track.

{% switch label='Dark mode' defaultChecked=true %}

{% switch label='Notifications' onLabel='ON' offLabel='OFF' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% switch label='Dark mode' defaultChecked=true %}

{% switch label='Notifications' onLabel='ON' offLabel='OFF' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'switch', label='Dark mode', defaultChecked=True)

component('aardvark', 'switch', label='Notifications', onLabel='ON', offLabel='OFF')
```
{% endAccordionSection %}
{% endAccordion %}

## Colors and sizes

`color` is any theme color for the on-state track; `size` is `xs`–`xl`.

{% switch label='blue' defaultChecked=true %}
{% switch label='teal' color='teal' defaultChecked=true %}
{% switch label='large' size='lg' defaultChecked=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% switch label='blue' defaultChecked=true %}
{% switch label='teal' color='teal' defaultChecked=true %}
{% switch label='large' size='lg' defaultChecked=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'switch', label='blue', defaultChecked=True)
component('aardvark', 'switch', label='teal', color='teal', defaultChecked=True)
component('aardvark', 'switch', label='large', size='lg', defaultChecked=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Radius, thumb indicator, label position, and disabled

`radius` rounds the track; `withThumbIndicator` shows the inner thumb dot;
`labelPosition='left'` puts the label first; `disabled` makes it non-interactive.

{% switch label='Square track' radius='xs' defaultChecked=true %}
{% switch label='Thumb indicator' withThumbIndicator=true defaultChecked=true %}
{% switch label='Label on the left' labelPosition='left' defaultChecked=true %}
{% switch label='Disabled' disabled=true defaultChecked=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% switch label='Square track' radius='xs' defaultChecked=true %}
{% switch label='Thumb indicator' withThumbIndicator=true defaultChecked=true %}
{% switch label='Label on the left' labelPosition='left' defaultChecked=true %}
{% switch label='Disabled' disabled=true defaultChecked=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'switch', label='Square track', radius='xs', defaultChecked=True)
component('aardvark', 'switch', label='Thumb indicator', withThumbIndicator=True,
          defaultChecked=True)
component('aardvark', 'switch', label='Label on the left', labelPosition='left',
          defaultChecked=True)
component('aardvark', 'switch', label='Disabled', disabled=True, defaultChecked=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Helper text

`description` and `error` add helper text below the label.

{% switch label='Beta features' description='Experimental — may change without notice.' %}
{% switch label='Required setting' error='Turn this on to save.' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% switch label='Beta features' description='Experimental — may change without notice.' %}
{% switch label='Required setting' error='Turn this on to save.' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'switch', label='Beta features',
          description='Experimental — may change without notice.')
component('aardvark', 'switch', label='Required setting', error='Turn this on to save.')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Combine a switch with a heading and a [button](/components/buttons/button/) to build a
small settings row.

Notification settings

{% switch label='Email me about replies' defaultChecked=true %}

{% button %}Save{% endButton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Notification settings

{% switch label='Email me about replies' defaultChecked=true %}

{% button %}Save{% endButton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'switch', label='Email me about replies', defaultChecked=True)
component('aardvark', 'button', children='Save')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default. For a React icon on the thumb
(`thumbIcon`), call `{% raw %}{% component('Switch', …) %}{% endraw %}` directly — a
build-time tag can only pass the on/off labels as text.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The label, when not using the block body. Plain text — Markdown (e.g. `**bold**`) is not rendered. |
| `defaultChecked` | bare flag (`true`) | Start the switch on. It stays interactive — the reader can toggle it. |
| `onLabel` | string | Short text shown inside the track in the on position. |
| `offLabel` | string | Short text shown inside the track in the off position. |
| `disabled` | bare flag (`true`) | Render non-interactive. |
| `color` | theme color name (`blue`, `teal`, …) | Track color in the on state. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Overall size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner rounding of the track. |
| `labelPosition` | `right` (default), `left` | Which side of the switch the label sits on. |
| `withThumbIndicator` | bare flag (`true`) | Show the inner thumb indicator dot. |
| `description` | string | Helper text shown below the label. |
| `error` | string | Error text shown below the label (also marks the switch invalid). |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered root. |

## CSS Selectors

Target a `{% raw %}{% switch %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Switch instance on the page */
[data-aardvark-island="Switch"] { }

/* Mantine Styles API parts */
.mantine-Switch-root { }
.mantine-Switch-track { }
.mantine-Switch-thumb { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so toggling it logs its checked state to the console and alerts it:

{% switch label='Dark mode' defaultChecked=true attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% switch label='Dark mode' defaultChecked=true attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'switch', label='Dark mode', defaultChecked=True, attr={'onchange': '''
const value = this.checked;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

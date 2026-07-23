---
title: "Radio"
description: "The built-in radio tag — a single labeled radio button. Usage, options, grouping with a shared name, colors, sizes, and live examples."
---

# Radio

A single radio button with a label. The label is the `label` attribute or the block
body. Give several radios the **same `name`** to make them a mutually exclusive group,
the way standard HTML radios behave. Add `defaultChecked` to pick the option selected
on load.

Use it as `{% raw %}{% radio %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'radio', …)`.

## A radio group

Give each radio the same `name` so selecting one deselects the others. `value` is what
that option submits; `defaultChecked` picks the starting selection.

{% radio label='Email' name='contact' value='email' defaultChecked=true %}
{% radio label='Phone' name='contact' value='phone' %}
{% radio label='Mail' name='contact' value='mail' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% radio label='Email' name='contact' value='email' defaultChecked=true %}
{% radio label='Phone' name='contact' value='phone' %}
{% radio label='Mail' name='contact' value='mail' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'radio', label='Email', name='contact', value='email',
          defaultChecked=True)
component('aardvark', 'radio', label='Phone', name='contact', value='phone')
component('aardvark', 'radio', label='Mail', name='contact', value='mail')
```
{% endAccordionSection %}
{% endAccordion %}

In a loop, build the group from data and select the first option:

<br>

{% accordion %}
{% accordionSection title="Source: Python" %}
```python
for i, opt in enumerate(['Email', 'Phone', 'Mail']):
    component('aardvark', 'radio', label=opt, name='contact', value=opt.lower(),
              defaultChecked=(i == 0))
```
{% endAccordionSection %}
{% endAccordion %}

## Colors and sizes

`color` is any theme color for the selected dot; `size` is `xs`–`xl`. (Each example
uses a distinct `name` so they don't fight over one selection.)

{% radio label='blue' name='demo' defaultChecked=true %}
{% radio label='grape' name='demo2' color='grape' defaultChecked=true %}
{% radio label='large' name='demo3' size='lg' defaultChecked=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% radio label='blue' name='demo' defaultChecked=true %}
{% radio label='grape' name='demo2' color='grape' defaultChecked=true %}
{% radio label='large' name='demo3' size='lg' defaultChecked=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'radio', label='blue', name='demo', defaultChecked=True)
component('aardvark', 'radio', label='grape', name='demo2', color='grape',
          defaultChecked=True)
component('aardvark', 'radio', label='large', name='demo3', size='lg',
          defaultChecked=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Label position, icon color, helper text, and disabled

`labelPosition='left'` puts the label first; `iconColor` colors the inner dot;
`description` and `error` add helper text; `disabled` makes it non-interactive.

{% radio label='Label on the left' name='lp' labelPosition='left' defaultChecked=true %}
{% radio label='Custom dot color' name='ic' iconColor='yellow' color='dark' defaultChecked=true %}
{% radio label='With a description' name='ds' description='We will only call about your order.' defaultChecked=true %}
{% radio label='Disabled' name='db' disabled=true defaultChecked=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% radio label='Label on the left' name='lp' labelPosition='left' defaultChecked=true %}
{% radio label='Custom dot color' name='ic' iconColor='yellow' color='dark' defaultChecked=true %}
{% radio label='With a description' name='ds' description='We will only call about your order.' defaultChecked=true %}
{% radio label='Disabled' name='db' disabled=true defaultChecked=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'radio', label='Label on the left', name='lp',
          labelPosition='left', defaultChecked=True)
component('aardvark', 'radio', label='Custom dot color', name='ic',
          iconColor='yellow', color='dark', defaultChecked=True)
component('aardvark', 'radio', label='With a description', name='ds',
          description='We will only call about your order.', defaultChecked=True)
component('aardvark', 'radio', label='Disabled', name='db', disabled=True,
          defaultChecked=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Combine a radio group with a heading and a [button](/components/buttons/button/) to
build a small choice form.

How should we reach you?

{% radio label='Email' name='reach' value='email' defaultChecked=true %}
{% radio label='Phone' name='reach' value='phone' %}

{% button %}Save preference{% endButton %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
How should we reach you?

{% radio label='Email' name='reach' value='email' defaultChecked=true %}
{% radio label='Phone' name='reach' value='phone' %}

{% button %}Save preference{% endButton %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'radio', label='Email', name='reach', value='email',
          defaultChecked=True)
component('aardvark', 'radio', label='Phone', name='reach', value='phone')
component('aardvark', 'button', children='Save preference')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | The label, when not using the block body. Plain text — Markdown (e.g. `**bold**`) is not rendered. |
| `name` | string | Radio-group name — give grouped radios the same value to make them mutually exclusive. |
| `value` | string | The value this option submits. |
| `defaultChecked` | bare flag (`true`) | Start this option selected. |
| `disabled` | bare flag (`true`) | Render non-interactive. |
| `color` | theme color name (`blue`, `grape`, …) | Fill color of the selected dot. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Overall size. |
| `labelPosition` | `right` (default), `left` | Which side of the button the label sits on. |
| `iconColor` | theme color name | Color of the inner dot. |
| `description` | string | Helper text shown below the label. |
| `error` | string | Error text shown below the label (also marks the option invalid). |
| `autoContrast` | bare flag (`true`) | Auto-pick a readable dot color against `color`. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered root. |

## CSS Selectors

Target a `{% raw %}{% radio %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Radio instance on the page */
[data-aardvark-island="Radio"] { }

/* Mantine Styles API parts */
.mantine-Radio-root { }
.mantine-Radio-radio { }
.mantine-Radio-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so selecting an option logs its value to the console and alerts it:

{% radio label='Email' name='contact' value='email' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% radio label='SMS' name='contact' value='sms' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% radio label='Email' name='contact' value='email' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
{% radio label='SMS' name='contact' value='sms' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
print(component('aardvark', 'radio', label='Email', name='contact', value='email', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''}))
print(component('aardvark', 'radio', label='SMS', name='contact', value='sms', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''}))
```
{% endAccordionSection %}
{% endAccordion %}

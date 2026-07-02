---
title: "Fieldset"
description: "The built-in fieldset tag — a bordered group of related fields with a legend caption; the block body holds the inputs."
---

# Fieldset

A built-in block tag that groups related fields in a bordered box with a `legend` caption.
The block body holds the inputs, and `disabled` can cascade a disabled state to every
control inside. Use it to break a long form into labelled sections.

Use it as `{% raw %}{% fieldset %} … {% endFieldset %}{% endraw %}` in Markdown, or call it
from Python logic (loops, snippets) via `component('aardvark', 'fieldset', …)` with the
grouped fields passed as `children`.

## A labelled group

The body between `{% raw %}{% fieldset %}{% endraw %}` and
`{% raw %}{% endFieldset %}{% endraw %}` holds the fields; `legend` is the caption rendered
in the border.

{% fieldset legend='Personal information' %}
{% textinput label='First name' placeholder='Ada' %}
{% textinput label='Last name' placeholder='Lovelace' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Personal information' %}
{% textinput label='First name' placeholder='Ada' %}
{% textinput label='Last name' placeholder='Lovelace' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'textinput', label='First name', placeholder='Ada')
    + component('aardvark', 'textinput', label='Last name', placeholder='Lovelace')
)
component('aardvark', 'fieldset', legend='Personal information', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Variant

`variant` is `default`, `filled`, or `unstyled`.

{% fieldset legend='Account (filled)' variant='filled' %}
{% textinput label='Email' placeholder='you@example.com' %}
{% passwordinput label='Password' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Account (filled)' variant='filled' %}
{% textinput label='Email' placeholder='you@example.com' %}
{% passwordinput label='Password' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'textinput', label='Email', placeholder='you@example.com')
    + component('aardvark', 'passwordinput', label='Password')
)
component('aardvark', 'fieldset', legend='Account (filled)', variant='filled', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Radius

`radius` sets the border radius — `xs`–`xl` or any CSS value.

{% fieldset legend='Rounded' radius='lg' %}
{% textinput label='Nickname' placeholder='Ada' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Rounded' radius='lg' %}
{% textinput label='Nickname' placeholder='Ada' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = component('aardvark', 'textinput', label='Nickname', placeholder='Ada')
component('aardvark', 'fieldset', legend='Rounded', radius='lg', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Disabled cascade

`disabled` cascades a disabled state to every control inside the group, so you can lock a
whole section with one flag.

{% fieldset legend='Locked' disabled=true %}
{% textinput label='Read-only field' defaultValue='Cannot edit' %}
{% nativeselect label='Plan' data='Free|Pro' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Locked' disabled=true %}
{% textinput label='Read-only field' defaultValue='Cannot edit' %}
{% nativeselect label='Plan' data='Free|Pro' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'textinput', label='Read-only field', defaultValue='Cannot edit')
    + component('aardvark', 'nativeselect', label='Plan', data='Free|Pro')
)
component('aardvark', 'fieldset', legend='Locked', disabled=True, children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Fieldset is a container, so any of the field tags can go inside it — text inputs, selects,
file pickers, and more — to compose a complete form section.

{% fieldset legend='Shipping' %}
{% textinput label='Street address' placeholder='123 Analytical Ave' %}
{% nativeselect label='Country' data='United States|Canada|United Kingdom' %}
{% fileinput label='Delivery note (optional)' placeholder='Attach a file' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Shipping' %}
{% textinput label='Street address' placeholder='123 Analytical Ave' %}
{% nativeselect label='Country' data='United States|Canada|United Kingdom' %}
{% fileinput label='Delivery note (optional)' placeholder='Attach a file' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'textinput', label='Street address', placeholder='123 Analytical Ave')
    + component('aardvark', 'nativeselect', label='Country', data='United States|Canada|United Kingdom')
    + component('aardvark', 'fileinput', label='Delivery note (optional)', placeholder='Attach a file')
)
component('aardvark', 'fieldset', legend='Shipping', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `legend` | string | The caption rendered in the border. |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the bordered group. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Border radius. |
| `disabled` | `true` / `false` | Disable every control inside the group. Default `false`. |
| *(body)* | Markdown / field tags | The grouped inputs. In Python, pass them as `children`. |

## CSS Selectors

Target a `{% fieldset %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Fieldset instance on the page */
[data-aardvark-island="Fieldset"] { }

/* Mantine Styles API parts */
.mantine-Fieldset-root { }
.mantine-Fieldset-legend { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element.

{% fieldset legend='Personal information' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}{% textinput label='Name' %}{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Personal information' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}{% textinput label='Name' %}{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'fieldset', legend='Personal information',
          children=component('aardvark', 'textinput', label='Name'),
          attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

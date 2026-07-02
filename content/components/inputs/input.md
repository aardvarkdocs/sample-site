---
title: "Input"
description: "The built-in input tag — the low-level, unstyled base input primitive every field is built on; just the styled control, no label or message wrapper."
---

# Input

A built-in tag for the base input primitive — the styled control with no label,
description, or error message of its own. Every other field on this page is built on it.
Reach for `input` when you want just the box (for example, inside your own layout). For a
full labelled field, use [TextInput](/components/inputs/textinput/) instead.

Use it as `{% raw %}{% input %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'input', …)`.

{% callout severity='info' title='No wrapper — just the control' %}
`Input` is the unstyled base. The label, description, and error *messages* you see on the
other fields come from `Input.Wrapper`, which they compose on top of `Input`. So `input`
here has no `label` or `description`, and its `error` is a **boolean** that adds error
styling rather than a message string.
{% endCallout %}

## Basic control

`placeholder` is shown when the control is empty; `type` sets the HTML input type.

{% input placeholder='Search…' type='search' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% input placeholder='Search…' type='search' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'input', placeholder='Search…', type='search')
```
{% endAccordionSection %}
{% endAccordion %}

## Type and default value

`type` accepts any HTML input type (`search`, `email`, `tel`, …); `defaultValue` sets the
initial value.

{% input type='email' placeholder='you@example.com' %}

{% input type='tel' defaultValue='+1 555 0100' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% input type='email' placeholder='you@example.com' %}

{% input type='tel' defaultValue='+1 555 0100' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'input', type='email', placeholder='you@example.com')

component('aardvark', 'input', type='tel', defaultValue='+1 555 0100')
```
{% endAccordionSection %}
{% endAccordion %}

## Variant, size, and radius

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`.

{% input placeholder='Filled' variant='filled' %}

{% input placeholder='Large + round' size='lg' radius='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% input placeholder='Filled' variant='filled' %}

{% input placeholder='Large + round' size='lg' radius='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'input', placeholder='Filled', variant='filled')

component('aardvark', 'input', placeholder='Large + round', size='lg', radius='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## Error and disabled

`error` is a boolean that adds error styling (there is no wrapper to render a message);
`disabled` renders the control inert.

{% input placeholder='Error styling' error=true %}

{% input placeholder='Disabled' disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% input placeholder='Error styling' error=true %}

{% input placeholder='Disabled' disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'input', placeholder='Error styling', error=True)

component('aardvark', 'input', placeholder='Disabled', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Sections

`leftSection` and `rightSection` put text inside the control — handy for units or symbols.

{% input placeholder='Amount' leftSection='$' rightSection='USD' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% input placeholder='Amount' leftSection='$' rightSection='USD' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'input', placeholder='Amount', leftSection='$', rightSection='USD')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

`input` has no label, so when you need an accessible field reach for the wrapped
[textinput](/components/inputs/textinput/) instead. The bare control is best for
composing your own layouts — here it sits next to a [button](/components/buttons/button/)
as an inline search bar inside a [group](/components/layout/group/).

{% group %}
{% input placeholder='Search the docs…' type='search' %}
{% button %}Search{% endButton %}
{% endGroup %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% group %}
{% input placeholder='Search the docs…' type='search' %}
{% button %}Search{% endButton %}
{% endGroup %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'input', placeholder='Search the docs…', type='search')
    + component('aardvark', 'button', children='Search')
)
component('aardvark', 'group', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `placeholder` | string | Placeholder shown when the control is empty. |
| `type` | HTML input type (`text`, `search`, `email`, `tel`, `url`, …) | The native input type. |
| `defaultValue` | string | Initial value of the control. |
| `variant` | `default`, `filled`, `unstyled` | Visual style. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Corner radius. |
| `disabled` | `true` / `false` | Render the control disabled. Default `false`. |
| `error` | `true` / `false` | Add error styling. Boolean — there is no wrapper for a message. Default `false`. |
| `leftSection` | string | Text shown inside the control on the left. |
| `rightSection` | string | Text shown inside the control on the right. |

## CSS Selectors

Target a `{% input %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Input instance on the page */
[data-aardvark-island="Input"] { }

/* Mantine Styles API parts */
.mantine-Input-wrapper { }
.mantine-Input-input { }
.mantine-Input-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% input placeholder='Search…' type='search' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% input placeholder='Search…' type='search' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'input', placeholder='Search…', type='search', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

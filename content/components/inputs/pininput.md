---
title: "PinInput"
description: "The built-in pininput tag — a row of single-character boxes for one-time codes and PINs, with length, type, mask, and OTP autofill."
---

# PinInput

A built-in tag for one-time-code or PIN entry — a row of single-character boxes that
advance as you type. It is not an Input wrapper, so it has no label or message of its own;
its `error` is a boolean that adds error styling to every box. Pair it with a heading or a
[textinput](/components/inputs/textinput/) label when you need a caption.

Use it as `{% raw %}{% pininput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'pininput', …)`.

## Basic PIN

`length` sets the number of boxes (four by default).

{% pininput length=4 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4)
```
{% endAccordionSection %}
{% endAccordion %}

## Length and type

`type` is `number` (default, digits only) or `alphanumeric` (letters and digits).

{% pininput length=6 type='number' %}

{% pininput length=5 type='alphanumeric' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=6 type='number' %}

{% pininput length=5 type='alphanumeric' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=6, type='number')

component('aardvark', 'pininput', length=5, type='alphanumeric')
```
{% endAccordionSection %}
{% endAccordion %}

## Mask and OTP autofill

`mask` obscures entered characters like a password; `oneTimeCode` opts into the browser's
one-time-code autofill so an SMS code can be filled automatically.

{% pininput length=4 mask=true oneTimeCode=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 mask=true oneTimeCode=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, mask=True, oneTimeCode=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Placeholder, size, radius, and gap

`placeholder` sets the per-box placeholder character; `size` and `radius` style each box;
`gap` is the space between boxes.

{% pininput length=4 placeholder='○' size='lg' radius='xl' gap='md' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 placeholder='○' size='lg' radius='xl' gap='md' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, placeholder='○', size='lg', radius='xl', gap='md')
```
{% endAccordionSection %}
{% endAccordion %}

## Error and disabled

`error` is a boolean that adds error styling and `aria-invalid` to every box; `disabled`
makes the whole row inert.

{% pininput length=4 error=true %}

{% pininput length=4 disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 error=true %}

{% pininput length=4 disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, error=True)

component('aardvark', 'pininput', length=4, disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

PinInput has no label of its own, so pair it with a heading and supporting text inside a
[card](/components/data-display/card/) to make a complete verification prompt.

{% card title='Verify your email' %}
We sent a 6-digit code to your inbox.

{% pininput length=6 type='number' oneTimeCode=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Verify your email' %}
We sent a 6-digit code to your inbox.

{% pininput length=6 type='number' oneTimeCode=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
body = (
    'We sent a 6-digit code to your inbox.\n\n'
    + component('aardvark', 'pininput', length=6, type='number', oneTimeCode=True)
)
component('aardvark', 'card', title='Verify your email', children=body)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `length` | integer | Number of single-character boxes. Default `4`. |
| `type` | `number`, `alphanumeric` | Accepted characters. `number` (default) is digits only; `alphanumeric` allows letters and digits. |
| `mask` | `true` / `false` | Obscure entered characters like a password. Default `false`. |
| `oneTimeCode` | `true` / `false` | Opt into the browser's one-time-code (OTP) autofill. Default `false`. |
| `placeholder` | string | Per-box placeholder character. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Box size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Box corner radius. |
| `gap` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Space between boxes. |
| `disabled` | `true` / `false` | Disable every box. Default `false`. |
| `error` | `true` / `false` | Add error styling and `aria-invalid` to every box. Boolean — there is no wrapper for a message. Default `false`. |

## CSS Selectors

Target a `{% pininput %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every PinInput instance on the page */
[data-aardvark-island="PinInput"] { }

/* Mantine Styles API parts */
.mantine-PinInput-root { }
.mantine-PinInput-pinInput { }
.mantine-PinInput-input { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it. For a PIN field that's a demonstration only — never log or transmit a real PIN value in production:

{% pininput length=4 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

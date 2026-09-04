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

`type` is `alphanumeric` (the default — letters and digits) or `number` (digits only).

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

`mask` obscures entered characters like a password. The browser's one-time-code autofill is **on by
default** — every box carries `autocomplete="one-time-code"`, so a texted code can be filled in one
tap. Pass `oneTimeCode=false` to turn that off for a PIN that isn't a one-time code.

{% pininput length=4 mask=true %}

{% pininput length=4 oneTimeCode=false %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 mask=true %}

{% pininput length=4 oneTimeCode=false %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, mask=True)

component('aardvark', 'pininput', length=4, oneTimeCode=False)
```
{% endAccordionSection %}
{% endAccordion %}

## Placeholder, size, radius, and gap

`placeholder` sets the per-box placeholder character (`○` when you leave it off); `size` and
`radius` style each box; `gap` is the space between boxes (`sm` by default).

{% pininput length=4 placeholder='•' size='lg' radius='xl' gap='md' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 placeholder='•' size='lg' radius='xl' gap='md' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, placeholder='•', size='lg', radius='xl', gap='md')
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
| `type` | `alphanumeric` (default), `number` | Accepted characters. `alphanumeric` allows letters and digits; `number` is digits only. |
| `mask` | `true` / `false` | Obscure entered characters like a password. Default `false`. |
| `oneTimeCode` | `true` / `false` | The browser's one-time-code (OTP) autofill. **On by default** — pass `false` to turn it off. |
| `placeholder` | string | Per-box placeholder character. Default `○`. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Box size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Box corner radius. |
| `gap` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Space between boxes. Default `sm`. |
| `disabled` | `true` / `false` | Disable every box. Default `false`. |
| `error` | `true` / `false` | Add error styling and `aria-invalid` to every box. Boolean — there is no wrapper for a message. Default `false`. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the first box — see below. |

## CSS Selectors

Target a `{% raw %}{% pininput %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

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

A PinInput is a row of separate `<input>` boxes, and `attr={…}` lands on the **first** one — so
`this.value` inside a handler is that box's single character, not the whole code. To read the code,
walk up to the row (Mantine gives it `role="group"`) and join every box, as below. Advancing from
box to box does not commit that box, so the native `change` doesn't fire on every keystroke — it
fires when focus leaves the component altogether, by which point the reader has normally filled
the whole code. That is why the handler below can alert with the complete value. For a PIN field
this is a demonstration only — never log or transmit a real PIN value in production:

{% pininput length=4 attr={'onchange': '''
const boxes = Array.from(this.closest('[role="group"]')?.querySelectorAll('input') || []);
const value = boxes.map((box) => box.value).join('');
console.log('attr demo value:', value);
if (boxes.length && value.length === boxes.length) alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pininput length=4 attr={'onchange': '''
const boxes = Array.from(this.closest('[role="group"]')?.querySelectorAll('input') || []);
const value = boxes.map((box) => box.value).join('');
console.log('attr demo value:', value);
if (boxes.length && value.length === boxes.length) alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pininput', length=4, attr={'onchange': '''
const boxes = Array.from(this.closest('[role="group"]')?.querySelectorAll('input') || []);
const value = boxes.map((box) => box.value).join('');
console.log('attr demo value:', value);
if (boxes.length && value.length === boxes.length) alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

---
title: "MaskInput"
description: "The built-in maskinput tag — a text field that formats entry against a fixed pattern (phone, date, card), with the full Input wrapper."
---

# MaskInput

A *masked* text field — entry is constrained to a fixed pattern as the reader types, with
separators inserted automatically. Reach for it for phone numbers, dates, and card numbers.
It carries the same Input wrapper as [TextInput](/components/inputs/textinput/) — label,
description, error, sections — plus the `mask` pattern.

Use it as `{% raw %}{% maskinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'maskinput', …)`.

## Mask tokens

`mask` is a pattern where each token constrains one character and every other character is a
literal separator inserted for you.

| Token | Matches |
| --- | --- |
| `9` | A digit (`0`–`9`). |
| `a` | A letter (`A`–`Z`, `a`–`z`). |
| `A` | An uppercase letter (`A`–`Z`). |
| `*` | A letter or a digit. |
| `#` | A digit or a sign (`0`–`9`, `+`, `-`). |
| anything else | A literal separator, inserted automatically. |

## Basic field

A phone mask: type digits and the parentheses, space, and dash appear on their own.

{% maskinput label='Phone' mask='(999) 999-9999' placeholder='(___) ___-____' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% maskinput label='Phone' mask='(999) 999-9999' placeholder='(___) ___-____' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'maskinput', label='Phone',
          mask='(999) 999-9999', placeholder='(___) ___-____')
```
{% endAccordionSection %}
{% endAccordion %}

## More patterns

A date mask uses only `9`; a card mask groups digits; a license mask mixes letters and
digits.

{% maskinput label='Date' mask='99/99/9999' placeholder='MM/DD/YYYY' %}

{% maskinput label='Card' mask='9999 9999 9999 9999' placeholder='0000 0000 0000 0000' %}

{% maskinput label='License' mask='aaa-9999' description='Three letters, a dash, four digits' %}

{% maskinput label='Serial' mask='****-****' description='Letters or digits' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% maskinput label='Date' mask='99/99/9999' placeholder='MM/DD/YYYY' %}

{% maskinput label='Card' mask='9999 9999 9999 9999' placeholder='0000 0000 0000 0000' %}

{% maskinput label='License' mask='aaa-9999' description='Three letters, a dash, four digits' %}

{% maskinput label='Serial' mask='****-****' description='Letters or digits' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'maskinput', label='Date',
          mask='99/99/9999', placeholder='MM/DD/YYYY')

component('aardvark', 'maskinput', label='Card',
          mask='9999 9999 9999 9999', placeholder='0000 0000 0000 0000')

component('aardvark', 'maskinput', label='License', mask='aaa-9999',
          description='Three letters, a dash, four digits')

component('aardvark', 'maskinput', label='Serial', mask='****-****',
          description='Letters or digits')
```
{% endAccordionSection %}
{% endAccordion %}

## Default value

`defaultValue` seeds the field; the value is masked on render.

{% maskinput label='Phone' mask='(999) 999-9999' defaultValue='(555) 010-0199' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% maskinput label='Phone' mask='(999) 999-9999' defaultValue='(555) 010-0199' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'maskinput', label='Phone',
          mask='(999) 999-9999', defaultValue='(555) 010-0199')
```
{% endAccordionSection %}
{% endAccordion %}

## Required, error, and disabled

`required` and `withAsterisk` add the asterisk; `error` shows a validation message; `disabled`
greys the control out.

{% maskinput label='Phone' mask='(999) 999-9999' required=true placeholder='(___) ___-____' %}

{% maskinput label='Card' mask='9999 9999 9999 9999' error='Card number is incomplete' placeholder='0000 0000 0000 0000' %}

{% maskinput label='On-file number' mask='(999) 999-9999' disabled=true defaultValue='(555) 010-0199' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% maskinput label='Phone' mask='(999) 999-9999' required=true placeholder='(___) ___-____' %}

{% maskinput label='Card' mask='9999 9999 9999 9999' error='Card number is incomplete' placeholder='0000 0000 0000 0000' %}

{% maskinput label='On-file number' mask='(999) 999-9999' disabled=true defaultValue='(555) 010-0199' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'maskinput', label='Phone', mask='(999) 999-9999',
          required=True, placeholder='(___) ___-____')

component('aardvark', 'maskinput', label='Card', mask='9999 9999 9999 9999',
          error='Card number is incomplete',
          placeholder='0000 0000 0000 0000')

component('aardvark', 'maskinput', label='On-file number',
          mask='(999) 999-9999', disabled=True, defaultValue='(555) 010-0199')
```
{% endAccordionSection %}
{% endAccordion %}

## Variants, size, radius, and sections

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`;
`leftSection`/`rightSection` add text inside the field.

{% maskinput label='Filled' mask='99/99/9999' variant='filled' placeholder='MM/DD/YYYY' %}

{% maskinput label='Large, round' mask='(999) 999-9999' size='lg' radius='xl' placeholder='(___) ___-____' %}

{% maskinput label='Phone' mask='999 999-9999' leftSection='+1' placeholder='000 000-0000' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% maskinput label='Filled' mask='99/99/9999' variant='filled' placeholder='MM/DD/YYYY' %}

{% maskinput label='Large, round' mask='(999) 999-9999' size='lg' radius='xl' placeholder='(___) ___-____' %}

{% maskinput label='Phone' mask='999 999-9999' leftSection='+1' placeholder='000 000-0000' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'maskinput', label='Filled', mask='99/99/9999',
          variant='filled', placeholder='MM/DD/YYYY')

component('aardvark', 'maskinput', label='Large, round',
          mask='(999) 999-9999', size='lg', radius='xl',
          placeholder='(___) ___-____')

component('aardvark', 'maskinput', label='Phone', mask='999 999-9999',
          leftSection='+1', placeholder='000 000-0000')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Combine a masked phone field with a [TextInput](/components/inputs/textinput/) inside a
{% raw %}{% card %}{% endraw %}.

{% card title='Contact' %}
{% textinput label='Full name' placeholder='Ada Lovelace' required=true %}

{% maskinput label='Phone' mask='(999) 999-9999' placeholder='(___) ___-____' required=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Contact' %}
{% textinput label='Full name' placeholder='Ada Lovelace' required=true %}

{% maskinput label='Phone' mask='(999) 999-9999' placeholder='(___) ___-____' required=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
name = component('aardvark', 'textinput', label='Full name',
                 placeholder='Ada Lovelace', required=True)
phone = component('aardvark', 'maskinput', label='Phone',
                  mask='(999) 999-9999', placeholder='(___) ___-____',
                  required=True)
component('aardvark', 'card', title='Contact', children=name + phone)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `mask` | string of tokens (`9`, `a`, `A`, `*`, `#`) plus literal separators | The entry pattern (see the tokens table above). |
| `label` | string | Field label above the input. |
| `description` | string | Helper text below the label. |
| `placeholder` | string | Placeholder shown when the field is empty. |
| `error` | string | Validation message below the field; switches it to the error color. |
| `defaultValue` | string | Initial value (masked on render). |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the input. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS length | Corner radius. |
| `required` | bool (`true` / `false`) | Mark the field required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required` attribute. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `leftSection` | string | Text shown inside the field, before the value. |
| `rightSection` | string | Text shown inside the field, after the value. |

## CSS Selectors

Target a `{% raw %}{% maskinput %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every MaskInput instance on the page */
[data-aardvark-island="MaskInput"] { }

/* Mantine Styles API parts */
.mantine-MaskInput-root { }
.mantine-MaskInput-input { }
.mantine-MaskInput-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% maskinput label='Phone' mask='(999) 999-9999' placeholder='(___) ___-____' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% maskinput label='Phone' mask='(999) 999-9999' placeholder='(___) ___-____' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'maskinput', label='Phone',
          mask='(999) 999-9999', placeholder='(___) ___-____', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

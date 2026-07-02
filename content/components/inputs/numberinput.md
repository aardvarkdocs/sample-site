---
title: "NumberInput"
description: "The built-in numberinput tag — numeric entry with min/max/step, decimalScale, prefix/suffix, thousand separators, and increment controls."
---

# NumberInput

A numeric field with increment/decrement controls, bounds, and formatting. It carries the
same Input wrapper as [TextInput](/components/inputs/textinput/) and adds the numeric
specifics: `min`/`max`/`step`, `decimalScale`, `prefix`/`suffix`, `thousandSeparator`,
`allowNegative`/`allowDecimal`, `clampBehavior`, and `hideControls`. Reach for it for
quantities, prices, ratings, and percentages.

Use it as `{% raw %}{% numberinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'numberinput', …)`.

## Basic field

A label, bounds, a step, and a starting value.

{% numberinput label='Quantity' min=0 max=100 step=1 defaultValue=1 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Quantity' min=0 max=100 step=1 defaultValue=1 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Quantity',
          min=0, max=100, step=1, defaultValue=1)
```
{% endAccordionSection %}
{% endAccordion %}

## Bounds, step, and precision

`min`, `max`, and `step` constrain the value; `decimalScale` fixes the number of decimal
places; `clampBehavior` is `strict` (keep the value inside the bounds while typing), `blur`
(clamp on blur), or `none`.

{% numberinput label='Rating (0–5, halves)' min=0 max=5 step=0.5 decimalScale=1 defaultValue=2.5 %}

{% numberinput label='Strict clamp' min=1 max=10 clampBehavior='strict' defaultValue=5 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Rating (0–5, halves)' min=0 max=5 step=0.5 decimalScale=1 defaultValue=2.5 %}

{% numberinput label='Strict clamp' min=1 max=10 clampBehavior='strict' defaultValue=5 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Rating (0–5, halves)',
          min=0, max=5, step=0.5, decimalScale=1, defaultValue=2.5)

component('aardvark', 'numberinput', label='Strict clamp',
          min=1, max=10, clampBehavior='strict', defaultValue=5)
```
{% endAccordionSection %}
{% endAccordion %}

## Prefix, suffix, and separators

`prefix` and `suffix` wrap the value; `thousandSeparator` groups digits.

{% numberinput label='Price' prefix='$' thousandSeparator=',' decimalScale=2 defaultValue=1999.5 %}

{% numberinput label='Weight' suffix=' kg' min=0 defaultValue=72 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Price' prefix='$' thousandSeparator=',' decimalScale=2 defaultValue=1999.5 %}

{% numberinput label='Weight' suffix=' kg' min=0 defaultValue=72 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Price', prefix='$',
          thousandSeparator=',', decimalScale=2, defaultValue=1999.5)

component('aardvark', 'numberinput', label='Weight', suffix=' kg',
          min=0, defaultValue=72)
```
{% endAccordionSection %}
{% endAccordion %}

## Sign and decimals

`allowNegative=false` blocks negatives; `allowDecimal=false` blocks the decimal point (whole
numbers only).

{% numberinput label='Whole, positive only' allowNegative=false allowDecimal=false defaultValue=5 %}

{% numberinput label='Temperature (°C)' allowNegative=true step=0.1 decimalScale=1 defaultValue=-4.5 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Whole, positive only' allowNegative=false allowDecimal=false defaultValue=5 %}

{% numberinput label='Temperature (°C)' allowNegative=true step=0.1 decimalScale=1 defaultValue=-4.5 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Whole, positive only',
          allowNegative=False, allowDecimal=False, defaultValue=5)

component('aardvark', 'numberinput', label='Temperature (°C)',
          allowNegative=True, step=0.1, decimalScale=1, defaultValue=-4.5)
```
{% endAccordionSection %}
{% endAccordion %}

## Hide the stepper controls

`hideControls` removes the increment/decrement buttons, leaving a plain numeric field.

{% numberinput label='No controls' hideControls=true defaultValue=10 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='No controls' hideControls=true defaultValue=10 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='No controls',
          hideControls=True, defaultValue=10)
```
{% endAccordionSection %}
{% endAccordion %}

## Required, error, and disabled

`required` and `withAsterisk` add the asterisk; `error` shows a validation message; `disabled`
greys the control out.

{% numberinput label='Seats' required=true min=1 defaultValue=1 %}

{% numberinput label='Discount %' error='Must be 100 or less' max=100 defaultValue=120 %}

{% numberinput label='Plan limit' disabled=true defaultValue=50 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Seats' required=true min=1 defaultValue=1 %}

{% numberinput label='Discount %' error='Must be 100 or less' max=100 defaultValue=120 %}

{% numberinput label='Plan limit' disabled=true defaultValue=50 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Seats', required=True,
          min=1, defaultValue=1)

component('aardvark', 'numberinput', label='Discount %',
          error='Must be 100 or less', max=100, defaultValue=120)

component('aardvark', 'numberinput', label='Plan limit',
          disabled=True, defaultValue=50)
```
{% endAccordionSection %}
{% endAccordion %}

## Variants, size, radius, and sections

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`;
`leftSection`/`rightSection` add text inside the field.

{% numberinput label='Filled' variant='filled' defaultValue=42 %}

{% numberinput label='Large, round' size='lg' radius='xl' defaultValue=7 %}

{% numberinput label='CPU cores' leftSection='⚙' rightSection='cores' min=1 defaultValue=4 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Filled' variant='filled' defaultValue=42 %}

{% numberinput label='Large, round' size='lg' radius='xl' defaultValue=7 %}

{% numberinput label='CPU cores' leftSection='⚙' rightSection='cores' min=1 defaultValue=4 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Filled', variant='filled',
          defaultValue=42)

component('aardvark', 'numberinput', label='Large, round', size='lg',
          radius='xl', defaultValue=7)

component('aardvark', 'numberinput', label='CPU cores', leftSection='⚙',
          rightSection='cores', min=1, defaultValue=4)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Combine a price field with a quantity field inside a {% raw %}{% card %}{% endraw %}.

{% card title='Order line' %}
{% numberinput label='Unit price' prefix='$' decimalScale=2 min=0 defaultValue=19.99 %}

{% numberinput label='Quantity' min=1 max=99 defaultValue=1 %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Order line' %}
{% numberinput label='Unit price' prefix='$' decimalScale=2 min=0 defaultValue=19.99 %}

{% numberinput label='Quantity' min=1 max=99 defaultValue=1 %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
price = component('aardvark', 'numberinput', label='Unit price', prefix='$',
                  decimalScale=2, min=0, defaultValue=19.99)
qty = component('aardvark', 'numberinput', label='Quantity',
                min=1, max=99, defaultValue=1)
component('aardvark', 'card', title='Order line', children=price + qty)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | Field label above the input. |
| `description` | string | Helper text below the label. |
| `placeholder` | string | Placeholder shown when the field is empty. |
| `error` | string | Validation message below the field; switches it to the error color. |
| `defaultValue` | number | Initial numeric value. |
| `min` | number | Lowest allowed value. |
| `max` | number | Highest allowed value. |
| `step` | number | Increment applied by the stepper buttons and arrow keys. |
| `decimalScale` | integer | Fixed number of decimal places to display. |
| `prefix` | string | Text shown immediately before the value. |
| `suffix` | string | Text shown immediately after the value. |
| `thousandSeparator` | string (e.g. `,`) | Digit-group separator. |
| `allowNegative` | bool (`true` / `false`) | Allow negative values (default `true`; set `false` to block). |
| `allowDecimal` | bool (`true` / `false`) | Allow a decimal point (default `true`; set `false` for whole numbers). |
| `hideControls` | bool (`true` / `false`) | Remove the increment/decrement stepper buttons. |
| `clampBehavior` | `strict`, `blur`, `none` | When the value is clamped to `min`/`max`. |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the input. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS length | Corner radius. |
| `required` | bool (`true` / `false`) | Mark the field required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required` attribute. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `leftSection` | string | Text shown inside the field, before the value. |
| `rightSection` | string | Text shown inside the field, after the value. |

## CSS Selectors

Target a `{% numberinput %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every NumberInput instance on the page */
[data-aardvark-island="NumberInput"] { }

/* Mantine Styles API parts */
.mantine-NumberInput-root { }
.mantine-NumberInput-input { }
.mantine-NumberInput-control { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% numberinput label='Quantity' min=0 max=100 step=1 defaultValue=1 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% numberinput label='Quantity' min=0 max=100 step=1 defaultValue=1 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'numberinput', label='Quantity',
          min=0, max=100, step=1, defaultValue=1, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

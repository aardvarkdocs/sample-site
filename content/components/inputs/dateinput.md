---
title: "DateInput"
description: "The built-in dateinput tag — a free-typing date field that parses what you type against a display format. Usage, the string value, and a live example."
---

# DateInput

A **free-typing date field**: type a date (or pick it) and it's parsed against `valueFormat`,
showing the formatted result. Reach for it when a plain, keyboard-first date entry beats a full
calendar popover. It carries the same Input wrapper as
[TextInput](/components/inputs/textinput/) — label, description, error, sizes — and hydrates
into an interactive island.

Use it as `{% raw %}{% dateinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'dateinput', …)`.

{% callout severity='info' title='Dates are strings' %}
Mantine 9's date components take and return **date strings** — `YYYY-MM-DD` (or `YYYY-MM-DD HH:mm`
when the format includes time), never `Date` objects. So `defaultValue` is a string like
`'2026-01-15'`.
{% endCallout %}

## A basic field

`defaultValue` seeds the field (a `YYYY-MM-DD` string); `valueFormat` controls how it's displayed.

{% dateinput label='Release date' defaultValue='2026-01-15' valueFormat='MMM D, YYYY' clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dateinput label='Release date' defaultValue='2026-01-15' valueFormat='MMM D, YYYY' clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dateinput', label='Release date',
          defaultValue='2026-01-15', valueFormat='MMM D, YYYY', clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Sizes, variants, and validation

`size` and `radius` run `xs`–`xl`; `variant` is `default`, `filled`, or `unstyled`. `error` shows
a validation message, and `required` / `withAsterisk` add the asterisk.

{% dateinput label='Start' description='Pick the first day' size='md' variant='filled' required=true placeholder='Choose a date' %}

{% dateinput label='Due' error='A due date is required' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dateinput label='Start' description='Pick the first day' size='md' variant='filled' required=true placeholder='Choose a date' %}

{% dateinput label='Due' error='A due date is required' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dateinput', label='Start', description='Pick the first day',
          size='md', variant='filled', required=True, placeholder='Choose a date')

component('aardvark', 'dateinput', label='Due', error='A due date is required')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `defaultValue` | `YYYY-MM-DD` string | Initial value (a date string, never a `Date`). |
| `valueFormat` | a dayjs format string (e.g. `MMM D, YYYY`) | How the value is displayed and parsed. |
| `label` | string | Field label above the input. |
| `description` | string | Helper text below the label. |
| `placeholder` | string | Placeholder shown when empty. |
| `error` | string | Validation message; switches the field to the error color. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`–`xl` or a CSS length | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `required` | bool (`true` / `false`) | Mark required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required`. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `clearable` | bool (`true` / `false`) | Show an × to clear the value. |

## CSS Selectors

Target a `{% dateinput %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every DateInput instance on the page */
[data-aardvark-island="DateInput"] { }

/* Scoped to the dates library build */
[data-aardvark-lib="dates"][data-aardvark-island="DateInput"] { }

/* Mantine Styles API parts */
.mantine-DateInput-root { }
.mantine-DateInput-input { }
.mantine-DateInput-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% dateinput label='Release date' defaultValue='2026-01-15' valueFormat='MMM D, YYYY' clearable=true attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% dateinput label='Release date' defaultValue='2026-01-15' valueFormat='MMM D, YYYY' clearable=true attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'dateinput', label='Release date',
          defaultValue='2026-01-15', valueFormat='MMM D, YYYY', clearable=True, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

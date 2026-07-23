---
title: "DatePickerInput"
description: "The built-in datepickerinput tag — a date field that opens a calendar to pick a day, a range, or several days. Usage, the type modes, and live examples."
---

# DatePickerInput

A date field that **opens a calendar popover** to pick a value — one day, a **range**, or
**several** days, set by `type`. Reach for it over [DateInput](/components/inputs/dateinput/) when
you want the calendar UI rather than free typing. It carries the usual Input wrapper and hydrates
into an interactive island.

Use it as `{% raw %}{% datepickerinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'datepickerinput', …)`.

{% callout severity='info' title='Dates are strings' %}
Values are **date strings** (`YYYY-MM-DD`). For `type='range'` or `type='multiple'`, pass
`defaultValue` as a **JSON array** of those strings — e.g. `'["2026-01-01","2026-01-07"]'`.
{% endCallout %}

## Pick a single day

{% datepickerinput label='Ship date' defaultValue='2026-03-09' valueFormat='MMM D, YYYY' clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datepickerinput label='Ship date' defaultValue='2026-03-09' valueFormat='MMM D, YYYY' clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datepickerinput', label='Ship date',
          defaultValue='2026-03-09', valueFormat='MMM D, YYYY', clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Pick a range

`type='range'` selects a start and end day; seed it with a two-element JSON array.

{% datepickerinput label='Sprint' type='range' defaultValue='["2026-01-05","2026-01-16"]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datepickerinput label='Sprint' type='range' defaultValue='["2026-01-05","2026-01-16"]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datepickerinput', label='Sprint', type='range',
          defaultValue='["2026-01-05","2026-01-16"]')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `type` | `default` (single), `range`, `multiple` | What the calendar selects. |
| `defaultValue` | `YYYY-MM-DD` string, or a JSON array of them for `range` / `multiple` | Initial value. |
| `valueFormat` | a dayjs format string | How the value is displayed. |
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

Target a `{% raw %}{% datepickerinput %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every DatePickerInput instance on the page */
[data-aardvark-island="DatePickerInput"] { }

/* Mantine Styles API parts */
.mantine-DatePickerInput-root { }
.mantine-DatePickerInput-input { }
.mantine-DatePickerInput-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so choosing a date logs the field value to the console and alerts it:

{% datepickerinput label='Ship date' defaultValue='2026-03-09' valueFormat='MMM D, YYYY' clearable=true attr={'onchange': '''
const value = event.target.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datepickerinput label='Ship date' defaultValue='2026-03-09' valueFormat='MMM D, YYYY' clearable=true attr={'onchange': '''
const value = event.target.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datepickerinput', label='Ship date',
          defaultValue='2026-03-09', valueFormat='MMM D, YYYY', clearable=True, attr={'onchange': '''
const value = event.target.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

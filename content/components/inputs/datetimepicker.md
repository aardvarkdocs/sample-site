---
title: "DateTimePicker"
description: "The built-in datetimepicker tag — a combined date-and-time field with a calendar plus a time picker. Usage, the string value, and a live example."
---

# DateTimePicker

A combined **date-and-time field** — it opens a calendar to pick the day and a time picker for the
clock, in one control. Reach for it when an event needs both. It carries the usual Input wrapper
and hydrates into an interactive island.

Use it as `{% raw %}{% datetimepicker %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'datetimepicker', …)`.

{% callout severity='info' title='Dates are strings' %}
The value is a **date-time string** — `YYYY-MM-DD HH:mm:ss` (or `YYYY-MM-DD HH:mm` without
`withSeconds`), never a `Date`.
{% endCallout %}

## A date-and-time field

`withSeconds` adds the seconds field; `valueFormat` controls the display.

{% datetimepicker label='Starts at' defaultValue='2026-01-15 09:30:00' withSeconds=true valueFormat='MMM D, YYYY HH:mm:ss' clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datetimepicker label='Starts at' defaultValue='2026-01-15 09:30:00' withSeconds=true valueFormat='MMM D, YYYY HH:mm:ss' clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datetimepicker', label='Starts at',
          defaultValue='2026-01-15 09:30:00', withSeconds=True,
          valueFormat='MMM D, YYYY HH:mm:ss', clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `defaultValue` | `YYYY-MM-DD HH:mm:ss` string | Initial value (a date-time string). |
| `valueFormat` | a dayjs format string | How the value is displayed. |
| `withSeconds` | bool (`true` / `false`) | Show and capture seconds. |
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

Target a `{% raw %}{% datetimepicker %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every DateTimePicker instance on the page */
[data-aardvark-island="DateTimePicker"] { }

/* Mantine Styles API parts */
.mantine-DateTimePicker-root { }
.mantine-DateTimePicker-input { }
.mantine-DateTimePicker-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so choosing a date-time logs the field value to the console and alerts it:

{% datetimepicker label='Starts at' defaultValue='2026-01-15 09:30:00' withSeconds=true valueFormat='MMM D, YYYY HH:mm:ss' clearable=true attr={'onchange': '''
const value = event.target.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% datetimepicker label='Starts at' defaultValue='2026-01-15 09:30:00' withSeconds=true valueFormat='MMM D, YYYY HH:mm:ss' clearable=true attr={'onchange': '''
const value = event.target.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'datetimepicker', label='Starts at',
          defaultValue='2026-01-15 09:30:00', withSeconds=True,
          valueFormat='MMM D, YYYY HH:mm:ss', clearable=True, attr={'onchange': '''
const value = event.target.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

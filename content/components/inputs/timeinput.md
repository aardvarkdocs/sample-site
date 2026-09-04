---
title: "TimeInput"
description: "The built-in timeinput tag — a time field built on the browser's native time control. Usage, the string value, and a live example."
---

# TimeInput

A **time field** built on the browser's native `<input type="time">`, dressed in the Mantine Input
wrapper. Reach for it for a plain time entry (a meeting start, an alarm). It hydrates into an
interactive island.

The field comes from `@mantine/dates`, which is part of a new site's dependencies — so the tag works
in a scaffolded site with no extra setup. In a project that trimmed its dependencies, reinstall
`@mantine/dates` before using it.

Use it as `{% raw %}{% timeinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'timeinput', …)`.

{% callout severity='info' title='Times are strings' %}
The value is a **time string** — `HH:mm` (or `HH:mm:ss` with `withSeconds`), always on a 24-hour
clock. How the control *looks* is the browser's choice: on a locale that prefers a 12-hour clock it
shows an AM/PM picker, and the value it hands back is still `HH:mm`.
{% endCallout %}

## A time field

`withSeconds` adds the seconds field; the usual Input wrapper props apply.

{% timeinput label='Stand-up' defaultValue='09:30' description='Value is HH:mm' %}

{% timeinput label='Precise start' defaultValue='09:30:15' withSeconds=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeinput label='Stand-up' defaultValue='09:30' description='Value is HH:mm' %}

{% timeinput label='Precise start' defaultValue='09:30:15' withSeconds=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeinput', label='Stand-up', defaultValue='09:30',
          description='Value is HH:mm')

component('aardvark', 'timeinput', label='Precise start',
          defaultValue='09:30:15', withSeconds=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `defaultValue` | `HH:mm` string (or `HH:mm:ss` with `withSeconds`) | Initial value. |
| `withSeconds` | bool (`true` / `false`) | Show and capture seconds. |
| `label` | string | Field label above the input. |
| `description` | string | Helper text below the label. |
| `error` | string | Validation message; switches the field to the error color. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`–`xl` or a CSS length | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `required` | bool (`true` / `false`) | Mark required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required`. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered `<input>`. |

## CSS Selectors

Target a `{% raw %}{% timeinput %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every TimeInput instance on the page */
[data-aardvark-island="TimeInput"] { }

/* Mantine Styles API parts */
.mantine-TimeInput-root { }
.mantine-TimeInput-input { }
.mantine-TimeInput-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the
rendered `<input>`, so `this` inside a handler is the field itself and `this.value` is the `HH:mm` string.
Here it is wired to `onchange`, which fires when the reader picks a new time:

{% timeinput label='Stand-up' defaultValue='09:30' description='Value is HH:mm' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% timeinput label='Stand-up' defaultValue='09:30' description='Value is HH:mm' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'timeinput', label='Stand-up', defaultValue='09:30', description='Value is HH:mm', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

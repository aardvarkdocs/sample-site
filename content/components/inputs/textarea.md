---
title: "Textarea"
description: "The built-in textarea tag — a multi-line text field with autosize, minRows/maxRows, resize, and the full Mantine Input wrapper."
---

# Textarea

A multi-line text field. It carries the same Input wrapper as
[TextInput](/components/inputs/textinput/) — label, description, error, sections —
and adds the textarea specifics: `autosize`, `minRows`/`maxRows`, and `resize`. Reach for it
for bios, notes, messages, and any longer free-form value.

Use it as `{% raw %}{% textarea %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'textarea', …)`.

## Basic field

A label, a placeholder, and a fixed starting height with `minRows`.

{% textarea label='Bio' placeholder='Tell us about yourself' minRows=3 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Bio' placeholder='Tell us about yourself' minRows=3 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Bio',
          placeholder='Tell us about yourself', minRows=3)
```
{% endAccordionSection %}
{% endAccordion %}

## Autosize

`autosize` grows the field with its content. Set a floor with `minRows` and a cap with
`maxRows`.

{% textarea label='Notes' autosize=true minRows=2 maxRows=6 placeholder='Grows as you type, up to 6 rows' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Notes' autosize=true minRows=2 maxRows=6 placeholder='Grows as you type, up to 6 rows' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Notes', autosize=True,
          minRows=2, maxRows=6,
          placeholder='Grows as you type, up to 6 rows')
```
{% endAccordionSection %}
{% endAccordion %}

## Resize

`resize` is `none`, `both`, `horizontal`, or `vertical` — it controls the drag handle in the
field's corner.

{% textarea label='Free resize' resize='both' placeholder='Drag the corner in any direction' %}

{% textarea label='Vertical only' resize='vertical' placeholder='Drag the corner up and down' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Free resize' resize='both' placeholder='Drag the corner in any direction' %}

{% textarea label='Vertical only' resize='vertical' placeholder='Drag the corner up and down' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Free resize', resize='both',
          placeholder='Drag the corner in any direction')

component('aardvark', 'textarea', label='Vertical only', resize='vertical',
          placeholder='Drag the corner up and down')
```
{% endAccordionSection %}
{% endAccordion %}

## Required, asterisk, and disabled

`required` and `withAsterisk` add the asterisk; `disabled` greys the control out.

{% textarea label='Message' required=true placeholder='Required field' minRows=2 %}

{% textarea label='Imported note' withAsterisk=true defaultValue='From the legacy system' minRows=2 %}

{% textarea label='Locked note' disabled=true defaultValue='Read-only' minRows=2 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Message' required=true placeholder='Required field' minRows=2 %}

{% textarea label='Imported note' withAsterisk=true defaultValue='From the legacy system' minRows=2 %}

{% textarea label='Locked note' disabled=true defaultValue='Read-only' minRows=2 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Message', required=True,
          placeholder='Required field', minRows=2)

component('aardvark', 'textarea', label='Imported note', withAsterisk=True,
          defaultValue='From the legacy system', minRows=2)

component('aardvark', 'textarea', label='Locked note', disabled=True,
          defaultValue='Read-only', minRows=2)
```
{% endAccordionSection %}
{% endAccordion %}

## Error

`error` shows a validation message below the field and switches it to the error color.

{% textarea label='Bio' error='Keep it under 280 characters' minRows=2 defaultValue='A very long bio that has gone over the limit…' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Bio' error='Keep it under 280 characters' minRows=2 defaultValue='A very long bio that has gone over the limit…' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Bio',
          error='Keep it under 280 characters', minRows=2,
          defaultValue='A very long bio that has gone over the limit…')
```
{% endAccordionSection %}
{% endAccordion %}

## Variants, size, and radius

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`.

{% textarea label='Filled' variant='filled' placeholder='filled variant' minRows=2 %}

{% textarea label='Large, round' size='lg' radius='lg' placeholder='lg size, lg radius' minRows=2 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Filled' variant='filled' placeholder='filled variant' minRows=2 %}

{% textarea label='Large, round' size='lg' radius='lg' placeholder='lg size, lg radius' minRows=2 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Filled', variant='filled',
          placeholder='filled variant', minRows=2)

component('aardvark', 'textarea', label='Large, round', size='lg', radius='lg',
          placeholder='lg size, lg radius', minRows=2)
```
{% endAccordionSection %}
{% endAccordion %}

## Sections

`leftSection` and `rightSection` take text shown inside the field.

{% textarea label='Comment' leftSection='✎' placeholder='Leave a comment' minRows=2 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Comment' leftSection='✎' placeholder='Leave a comment' minRows=2 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Comment', leftSection='✎',
          placeholder='Leave a comment', minRows=2)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a textarea with a [TextInput](/components/inputs/textinput/) inside a
{% raw %}{% card %}{% endraw %} to build a feedback form.

{% card title='Send feedback' %}
{% textinput label='Subject' placeholder='What is this about?' required=true %}

{% textarea label='Details' autosize=true minRows=3 maxRows=8 placeholder='Tell us more…' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Send feedback' %}
{% textinput label='Subject' placeholder='What is this about?' required=true %}

{% textarea label='Details' autosize=true minRows=3 maxRows=8 placeholder='Tell us more…' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
subject = component('aardvark', 'textinput', label='Subject',
                    placeholder='What is this about?', required=True)
details = component('aardvark', 'textarea', label='Details', autosize=True,
                    minRows=3, maxRows=8, placeholder='Tell us more…')
component('aardvark', 'card', title='Send feedback', children=subject + details)
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
| `defaultValue` | string | Initial value of the field. |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the input. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS length | Corner radius. |
| `required` | bool (`true` / `false`) | Mark the field required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required` attribute. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `autosize` | bool (`true` / `false`) | Grow the field with its content. |
| `minRows` | integer | Minimum number of visible rows (a floor when `autosize` is on). |
| `maxRows` | integer | Maximum number of rows the field grows to (with `autosize`). |
| `resize` | `none`, `both`, `horizontal`, `vertical` | Direction the user can resize the field. |
| `leftSection` | string | Text shown inside the field, before the value. |
| `rightSection` | string | Text shown inside the field, after the value. |

## CSS Selectors

Target a `{% raw %}{% textarea %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Textarea instance on the page */
[data-aardvark-island="Textarea"] { }

/* Mantine Styles API parts */
.mantine-Textarea-root { }
.mantine-Textarea-input { }
.mantine-Textarea-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% textarea label='Bio' placeholder='Tell us about yourself' minRows=3 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textarea label='Bio' placeholder='Tell us about yourself' minRows=3 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textarea', label='Bio', placeholder='Tell us about yourself', minRows=3, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

---
title: "JsonInput"
description: "The built-in jsoninput tag — a textarea that validates JSON and can pretty-print it on blur, with autosize and a custom validation message."
---

# JsonInput

A JSON-aware textarea: it validates the content as JSON and can reformat it on blur. It
carries the same Input wrapper as [TextInput](/components/inputs/textinput/) and the
multi-line behaviour of [Textarea](/components/inputs/textarea/), plus the JSON
specifics: `formatOnBlur` (pretty-print on blur) and `validationError` (the message shown for
invalid JSON). Reach for it for config blobs, payload editors, and metadata fields.

Use it as `{% raw %}{% jsoninput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'jsoninput', …)`.

## Basic field

A label and a placeholder. With `formatOnBlur` on, valid JSON is pretty-printed when the
field loses focus; `autosize` plus `minRows` sizes the box.

{% jsoninput label='Config' placeholder='{ "key": "value" }' formatOnBlur=true autosize=true minRows=4 %}

Type some JSON and click away — valid JSON is reformatted; invalid JSON shows the validation
message.

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsoninput label='Config' placeholder='{ "key": "value" }' formatOnBlur=true autosize=true minRows=4 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsoninput', label='Config',
          placeholder='{ "key": "value" }', formatOnBlur=True,
          autosize=True, minRows=4)
```
{% endAccordionSection %}
{% endAccordion %}

## Custom validation message

`validationError` is the message shown when the content isn't valid JSON.

{% jsoninput label='Payload' validationError='That is not valid JSON' formatOnBlur=true minRows=3 defaultValue='{ broken: }' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsoninput label='Payload' validationError='That is not valid JSON' formatOnBlur=true minRows=3 defaultValue='{ broken: }' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsoninput', label='Payload',
          validationError='That is not valid JSON', formatOnBlur=True,
          minRows=3, defaultValue='{ broken: }')
```
{% endAccordionSection %}
{% endAccordion %}

## Autosize bounds

`minRows` sets the floor and `maxRows` the cap when `autosize` grows the field with its
content.

{% jsoninput label='Metadata' autosize=true minRows=2 maxRows=10 placeholder='{ }' formatOnBlur=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsoninput label='Metadata' autosize=true minRows=2 maxRows=10 placeholder='{ }' formatOnBlur=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsoninput', label='Metadata', autosize=True,
          minRows=2, maxRows=10, placeholder='{ }', formatOnBlur=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Required, error, and disabled

`required` and `withAsterisk` add the asterisk; `error` shows a wrapper-level validation
message; `disabled` greys the control out.

{% jsoninput label='Webhook body' required=true minRows=3 placeholder='{ }' %}

{% jsoninput label='Rules' error='At least one rule is required' minRows=3 defaultValue='[]' %}

{% jsoninput label='Frozen config' disabled=true minRows=3 defaultValue='{ "env": "prod" }' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsoninput label='Webhook body' required=true minRows=3 placeholder='{ }' %}

{% jsoninput label='Rules' error='At least one rule is required' minRows=3 defaultValue='[]' %}

{% jsoninput label='Frozen config' disabled=true minRows=3 defaultValue='{ "env": "prod" }' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsoninput', label='Webhook body', required=True,
          minRows=3, placeholder='{ }')

component('aardvark', 'jsoninput', label='Rules',
          error='At least one rule is required', minRows=3, defaultValue='[]')

component('aardvark', 'jsoninput', label='Frozen config', disabled=True,
          minRows=3, defaultValue='{ "env": "prod" }')
```
{% endAccordionSection %}
{% endAccordion %}

## Variants, size, and radius

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`.

{% jsoninput label='Filled' variant='filled' minRows=3 placeholder='{ }' %}

{% jsoninput label='Large, round' size='lg' radius='lg' minRows=3 placeholder='{ }' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsoninput label='Filled' variant='filled' minRows=3 placeholder='{ }' %}

{% jsoninput label='Large, round' size='lg' radius='lg' minRows=3 placeholder='{ }' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsoninput', label='Filled', variant='filled',
          minRows=3, placeholder='{ }')

component('aardvark', 'jsoninput', label='Large, round', size='lg',
          radius='lg', minRows=3, placeholder='{ }')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a name field with a JSON config editor inside a {% raw %}{% card %}{% endraw %}.

{% card title='New integration' %}
{% textinput label='Name' placeholder='My integration' required=true %}

{% jsoninput label='Settings (JSON)' formatOnBlur=true autosize=true minRows=4 placeholder='{ "enabled": true }' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='New integration' %}
{% textinput label='Name' placeholder='My integration' required=true %}

{% jsoninput label='Settings (JSON)' formatOnBlur=true autosize=true minRows=4 placeholder='{ "enabled": true }' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
name = component('aardvark', 'textinput', label='Name',
                 placeholder='My integration', required=True)
settings = component('aardvark', 'jsoninput', label='Settings (JSON)',
                     formatOnBlur=True, autosize=True, minRows=4,
                     placeholder='{ "enabled": true }')
component('aardvark', 'card', title='New integration',
          children=name + settings)
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
| `error` | string | Wrapper-level validation message; switches the field to the error color. |
| `defaultValue` | string | Initial value of the field. |
| `formatOnBlur` | bool (`true` / `false`) | Pretty-print valid JSON when the field loses focus. |
| `validationError` | string | Message shown when the content isn't valid JSON. |
| `autosize` | bool (`true` / `false`) | Grow the field with its content. |
| `minRows` | integer | Minimum number of visible rows (a floor when `autosize` is on). |
| `maxRows` | integer | Maximum number of rows the field grows to (with `autosize`). |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the input. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS length | Corner radius. |
| `required` | bool (`true` / `false`) | Mark the field required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required` attribute. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |

## CSS Selectors

Target a `{% jsoninput %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every JsonInput instance on the page */
[data-aardvark-island="JsonInput"] { }

/* Mantine Styles API parts */
.mantine-JsonInput-root { }
.mantine-JsonInput-input { }
.mantine-JsonInput-label { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% jsoninput label='Config' placeholder='{ "key": "value" }' formatOnBlur=true autosize=true minRows=4 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% jsoninput label='Config' placeholder='{ "key": "value" }' formatOnBlur=true autosize=true minRows=4 attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'jsoninput', label='Config',
          placeholder='{ "key": "value" }', formatOnBlur=True,
          autosize=True, minRows=4, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

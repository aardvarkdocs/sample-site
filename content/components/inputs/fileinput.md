---
title: "FileInput"
description: "The built-in fileinput tag — a file picker styled like the other inputs, with accept, multiple, and clearable."
---

# FileInput

A built-in tag for a file picker that matches the rest of your form. It uses the same
Input wrapper as [TextInput](/components/inputs/textinput/), so it carries a label,
description, placeholder, and error message, and adds the file-specific options `accept`,
`multiple`, and `clearable`.

Use it as `{% raw %}{% fileinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'fileinput', …)`.

## Basic file picker

A labelled picker with a placeholder shown until a file is chosen.

{% fileinput label='Resume' placeholder='Choose a file' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fileinput label='Resume' placeholder='Choose a file' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'fileinput', label='Resume', placeholder='Choose a file')
```
{% endAccordionSection %}
{% endAccordion %}

## Accept, multiple, and clearable

`accept` is the native accept-attribute string; `multiple` lets the picker take several
files; `clearable` shows a clear button once a file is chosen.

{% fileinput label='Images' accept='image/png,image/jpeg' multiple=true clearable=true placeholder='Pick one or more images' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fileinput label='Images' accept='image/png,image/jpeg' multiple=true clearable=true placeholder='Pick one or more images' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'fileinput',
    label='Images',
    accept='image/png,image/jpeg',
    multiple=True,
    clearable=True,
    placeholder='Pick one or more images',
)
```
{% endAccordionSection %}
{% endAccordion %}

## Description, required, and error

The shared wrapper fields work as on the other inputs: `description` adds help text,
`required` (or `withAsterisk`) adds the asterisk, and `error` shows a validation message
and switches the field to the error color.

{% fileinput label='Contract' description='PDF only' accept='application/pdf' required=true error='A signed contract is required' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fileinput label='Contract' description='PDF only' accept='application/pdf' required=true error='A signed contract is required' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component(
    'aardvark', 'fileinput',
    label='Contract',
    description='PDF only',
    accept='application/pdf',
    required=True,
    error='A signed contract is required',
)
```
{% endAccordionSection %}
{% endAccordion %}

## Variant, size, and radius

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`.

{% fileinput label='Filled' variant='filled' placeholder='filled variant' %}

{% fileinput label='Large + round' size='lg' radius='xl' placeholder='lg / xl radius' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fileinput label='Filled' variant='filled' placeholder='filled variant' %}

{% fileinput label='Large + round' size='lg' radius='xl' placeholder='lg / xl radius' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'fileinput', label='Filled', variant='filled', placeholder='filled variant')

component('aardvark', 'fileinput', label='Large + round', size='lg', radius='xl', placeholder='lg / xl radius')
```
{% endAccordionSection %}
{% endAccordion %}

## Sections and disabled

`leftSection` and `rightSection` put text inside the field; `disabled` renders it inert.

{% fileinput label='Attachment' leftSection='📎' placeholder='Add a file' %}

{% fileinput label='Locked' disabled=true placeholder='Upload disabled' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fileinput label='Attachment' leftSection='📎' placeholder='Add a file' %}

{% fileinput label='Locked' disabled=true placeholder='Upload disabled' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'fileinput', label='Attachment', leftSection='📎', placeholder='Add a file')

component('aardvark', 'fileinput', label='Locked', disabled=True, placeholder='Upload disabled')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Group a file picker with other fields inside a [fieldset](/components/inputs/fieldset/).

{% fieldset legend='Application' %}
{% textinput label='Full name' placeholder='Ada Lovelace' %}
{% fileinput label='Resume' accept='application/pdf' placeholder='Upload your resume' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Application' %}
{% textinput label='Full name' placeholder='Ada Lovelace' %}
{% fileinput label='Resume' accept='application/pdf' placeholder='Upload your resume' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'textinput', label='Full name', placeholder='Ada Lovelace')
    + component('aardvark', 'fileinput', label='Resume', accept='application/pdf', placeholder='Upload your resume')
)
component('aardvark', 'fieldset', legend='Application', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | string | Label shown above the field. |
| `description` | string | Help text shown under the label. |
| `placeholder` | string | Placeholder shown until a file is chosen. |
| `error` | string | Validation message shown below the field; switches it to the error color. |
| `accept` | string | Native accept-attribute string, e.g. `image/png,image/jpeg` or `application/pdf`. |
| `multiple` | `true` / `false` | Allow selecting several files. Default `false`. |
| `clearable` | `true` / `false` | Show a clear button once a file is chosen. Default `false`. |
| `variant` | `default`, `filled`, `unstyled` | Visual style. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Field size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Corner radius. |
| `required` | `true` / `false` | Mark the field required and add the asterisk. Default `false`. |
| `withAsterisk` | `true` / `false` | Add the asterisk without the `required` semantics. Default `false`. |
| `disabled` | `true` / `false` | Render the field disabled. Default `false`. |
| `leftSection` | string | Text shown inside the field on the left. |
| `rightSection` | string | Text shown inside the field on the right. |

## CSS Selectors

Target a `{% fileinput %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every FileInput instance on the page */
[data-aardvark-island="FileInput"] { }

/* Mantine Styles API parts */
.mantine-FileInput-root { }
.mantine-FileInput-input { }
.mantine-FileInput-placeholder { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element.

{% fileinput label='Resume' placeholder='Choose a file' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fileinput label='Resume' placeholder='Choose a file' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'fileinput', label='Resume', placeholder='Choose a file', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

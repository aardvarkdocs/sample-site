---
title: "TextInput"
description: "The built-in textinput tag — a single-line text field with the full Mantine Input wrapper: label, description, error, size, radius, variant, sections."
---

# TextInput

A single-line text field with the full Input wrapper: a label, helper description, error
message, and left/right sections. Reach for it for emails, names, URLs, search boxes — any
short, single-line value. Every field below takes a `label` so the control stays
accessible.

Use it as `{% raw %}{% textinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'textinput', …)`.

## Basic field

A label, a placeholder, and a description below the label.

{% textinput label='Email' placeholder='you@example.com' description='Work address' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Email' placeholder='you@example.com' description='Work address' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Email',
          placeholder='you@example.com', description='Work address')
```
{% endAccordionSection %}
{% endAccordion %}

## Required and asterisk

`required` marks the field required and adds the asterisk; `withAsterisk` adds the asterisk
without the HTML `required` attribute.

{% textinput label='Username' required=true placeholder='Pick a handle' %}

{% textinput label='Display name' withAsterisk=true placeholder='Shown publicly' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Username' required=true placeholder='Pick a handle' %}

{% textinput label='Display name' withAsterisk=true placeholder='Shown publicly' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Username', required=True,
          placeholder='Pick a handle')

component('aardvark', 'textinput', label='Display name', withAsterisk=True,
          placeholder='Shown publicly')
```
{% endAccordionSection %}
{% endAccordion %}

## Error and disabled

`error` shows a validation message below the field and switches it to the error color;
`disabled` greys the control out.

{% textinput label='Email' error='Enter a valid email address' placeholder='you@example.com' %}

{% textinput label='Account ID' disabled=true defaultValue='acct_8842' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Email' error='Enter a valid email address' placeholder='you@example.com' %}

{% textinput label='Account ID' disabled=true defaultValue='acct_8842' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Email',
          error='Enter a valid email address', placeholder='you@example.com')

component('aardvark', 'textinput', label='Account ID', disabled=True,
          defaultValue='acct_8842')
```
{% endAccordionSection %}
{% endAccordion %}

## Input type

`type` sets the HTML input type — `email`, `url`, `tel`, `search`, `password`, `number`, and
so on — which drives browser validation and the mobile keyboard.

{% textinput label='Website' type='url' placeholder='https://example.com' %}

{% textinput label='Phone' type='tel' placeholder='+1 555 0100' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Website' type='url' placeholder='https://example.com' %}

{% textinput label='Phone' type='tel' placeholder='+1 555 0100' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Website', type='url',
          placeholder='https://example.com')

component('aardvark', 'textinput', label='Phone', type='tel',
          placeholder='+1 555 0100')
```
{% endAccordionSection %}
{% endAccordion %}

## Variants

`variant` is `default`, `filled`, or `unstyled`.

{% textinput label='Default' variant='default' placeholder='default variant' %}

{% textinput label='Filled' variant='filled' placeholder='filled variant' %}

{% textinput label='Unstyled' variant='unstyled' placeholder='unstyled variant' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Default' variant='default' placeholder='default variant' %}

{% textinput label='Filled' variant='filled' placeholder='filled variant' %}

{% textinput label='Unstyled' variant='unstyled' placeholder='unstyled variant' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Default', variant='default',
          placeholder='default variant')

component('aardvark', 'textinput', label='Filled', variant='filled',
          placeholder='filled variant')

component('aardvark', 'textinput', label='Unstyled', variant='unstyled',
          placeholder='unstyled variant')
```
{% endAccordionSection %}
{% endAccordion %}

## Size and radius

`size` takes `xs`–`xl`; `radius` takes `xs`–`xl` (or any CSS length).

{% textinput label='Extra small' size='xs' placeholder='size xs' %}

{% textinput label='Large, round' size='lg' radius='xl' placeholder='lg / xl radius' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Extra small' size='xs' placeholder='size xs' %}

{% textinput label='Large, round' size='lg' radius='xl' placeholder='lg / xl radius' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Extra small', size='xs',
          placeholder='size xs')

component('aardvark', 'textinput', label='Large, round', size='lg', radius='xl',
          placeholder='lg / xl radius')
```
{% endAccordionSection %}
{% endAccordion %}

## Sections

`leftSection` and `rightSection` take text (an emoji, symbol, or short string) shown inside
the field, before and after the value.

{% textinput label='Website' leftSection='@' rightSection='.com' placeholder='your-site' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Website' leftSection='@' rightSection='.com' placeholder='your-site' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Website', leftSection='@',
          rightSection='.com', placeholder='your-site')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Drop fields into a {% raw %}{% card %}{% endraw %} to build a compact sign-in form.

{% card title='Sign in' %}
{% textinput label='Email' type='email' placeholder='you@example.com' required=true %}

{% textinput label='Workspace' leftSection='@' placeholder='acme' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Sign in' %}
{% textinput label='Email' type='email' placeholder='you@example.com' required=true %}

{% textinput label='Workspace' leftSection='@' placeholder='acme' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
email = component('aardvark', 'textinput', label='Email', type='email',
                  placeholder='you@example.com', required=True)
workspace = component('aardvark', 'textinput', label='Workspace',
                      leftSection='@', placeholder='acme')
component('aardvark', 'card', title='Sign in', children=email + workspace)
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
| `type` | `text`, `email`, `url`, `tel`, `search`, `password`, `number`, … | HTML input type — drives browser validation and the mobile keyboard. |
| `defaultValue` | string | Initial value of the field. |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the input. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS length | Corner radius. |
| `required` | bool (`true` / `false`) | Mark the field required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required` attribute. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `leftSection` | string | Text shown inside the field, before the value. |
| `rightSection` | string | Text shown inside the field, after the value. |

## CSS Selectors

Target a `{% raw %}{% textinput %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every TextInput instance on the page */
[data-aardvark-island="TextInput"] { }

/* Mantine Styles API parts */
.mantine-TextInput-root { }
.mantine-TextInput-input { }
.mantine-TextInput-label { }
.mantine-TextInput-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% textinput label='Email' placeholder='you@example.com' description='Work address' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% textinput label='Email' placeholder='you@example.com' description='Work address' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'textinput', label='Email', placeholder='you@example.com', description='Work address', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

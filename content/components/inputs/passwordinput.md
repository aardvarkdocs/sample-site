---
title: "PasswordInput"
description: "The built-in passwordinput tag — a password field with a built-in show/hide visibility toggle and the full Mantine Input wrapper."
---

# PasswordInput

A password field with a built-in show/hide visibility toggle on the right. It carries the
same Input wrapper as [TextInput](/components/inputs/textinput/) — label, description,
error, `leftSection` — plus `defaultVisible` to start the field revealed. The toggle button
occupies the right section, so only `leftSection` is exposed.

Use it as `{% raw %}{% passwordinput %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'passwordinput', …)`.

## Basic field

A label and a placeholder; click the eye icon to reveal the value.

{% passwordinput label='Password' placeholder='Your password' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% passwordinput label='Password' placeholder='Your password' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'passwordinput', label='Password',
          placeholder='Your password')
```
{% endAccordionSection %}
{% endAccordion %}

## Start revealed

`defaultVisible` opens the field with the value shown — handy for an API key or token the
reader needs to copy.

{% passwordinput label='API key' defaultVisible=true defaultValue='sk-demo-1234' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% passwordinput label='API key' defaultVisible=true defaultValue='sk-demo-1234' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'passwordinput', label='API key',
          defaultVisible=True, defaultValue='sk-demo-1234')
```
{% endAccordionSection %}
{% endAccordion %}

## Required, asterisk, and error

`required` and `withAsterisk` add the asterisk; `error` shows a validation message and
switches the field to the error color.

{% passwordinput label='New password' required=true placeholder='8+ characters' %}

{% passwordinput label='Confirm password' withAsterisk=true placeholder='Repeat it' %}

{% passwordinput label='New password' error='Too weak — add a number' placeholder='8+ characters' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% passwordinput label='New password' required=true placeholder='8+ characters' %}

{% passwordinput label='Confirm password' withAsterisk=true placeholder='Repeat it' %}

{% passwordinput label='New password' error='Too weak — add a number' placeholder='8+ characters' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'passwordinput', label='New password', required=True,
          placeholder='8+ characters')

component('aardvark', 'passwordinput', label='Confirm password',
          withAsterisk=True, placeholder='Repeat it')

component('aardvark', 'passwordinput', label='New password',
          error='Too weak — add a number', placeholder='8+ characters')
```
{% endAccordionSection %}
{% endAccordion %}

## Disabled

`disabled` greys the control out.

{% passwordinput label='Vault password' disabled=true defaultValue='locked' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% passwordinput label='Vault password' disabled=true defaultValue='locked' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'passwordinput', label='Vault password',
          disabled=True, defaultValue='locked')
```
{% endAccordionSection %}
{% endAccordion %}

## Variants, size, radius, and section

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`;
`leftSection` adds text before the value (the right side holds the toggle).

{% passwordinput label='Filled' variant='filled' placeholder='filled variant' %}

{% passwordinput label='Large, round' size='lg' radius='xl' placeholder='lg / xl radius' %}

{% passwordinput label='PIN' leftSection='🔒' placeholder='Enter PIN' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% passwordinput label='Filled' variant='filled' placeholder='filled variant' %}

{% passwordinput label='Large, round' size='lg' radius='xl' placeholder='lg / xl radius' %}

{% passwordinput label='PIN' leftSection='🔒' placeholder='Enter PIN' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'passwordinput', label='Filled', variant='filled',
          placeholder='filled variant')

component('aardvark', 'passwordinput', label='Large, round', size='lg',
          radius='xl', placeholder='lg / xl radius')

component('aardvark', 'passwordinput', label='PIN', leftSection='🔒',
          placeholder='Enter PIN')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Build a sign-in form with a [TextInput](/components/inputs/textinput/) and a password
field inside a {% raw %}{% card %}{% endraw %}.

{% card title='Sign in' %}
{% textinput label='Email' type='email' placeholder='you@example.com' required=true %}

{% passwordinput label='Password' placeholder='Your password' required=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Sign in' %}
{% textinput label='Email' type='email' placeholder='you@example.com' required=true %}

{% passwordinput label='Password' placeholder='Your password' required=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
email = component('aardvark', 'textinput', label='Email', type='email',
                  placeholder='you@example.com', required=True)
pw = component('aardvark', 'passwordinput', label='Password',
               placeholder='Your password', required=True)
component('aardvark', 'card', title='Sign in', children=email + pw)
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
| `defaultVisible` | bool (`true` / `false`) | Start with the value revealed instead of masked. |
| `variant` | `default`, `filled`, `unstyled` | Visual style of the input. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Control size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl`, or any CSS length | Corner radius. |
| `required` | bool (`true` / `false`) | Mark the field required and add the asterisk. |
| `withAsterisk` | bool (`true` / `false`) | Add the asterisk without the HTML `required` attribute. |
| `disabled` | bool (`true` / `false`) | Render the field disabled. |
| `leftSection` | string | Text shown inside the field, before the value (the right side holds the visibility toggle). |

## CSS Selectors

Target a `{% raw %}{% passwordinput %}{% endraw %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every PasswordInput instance on the page */
[data-aardvark-island="PasswordInput"] { }

/* Mantine Styles API parts */
.mantine-PasswordInput-root { }
.mantine-PasswordInput-innerInput { }
.mantine-PasswordInput-visibilityToggle { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it. For a password field that's a demonstration only — never log or transmit a real password value in production:

{% passwordinput label='Password' placeholder='Your password' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% passwordinput label='Password' placeholder='Your password' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'passwordinput', label='Password',
          placeholder='Your password', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

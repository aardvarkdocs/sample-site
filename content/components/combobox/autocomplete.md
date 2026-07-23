---
title: "Autocomplete"
description: "The built-in autocomplete tag — a free-text input with a suggestion dropdown. Usage, options, and live examples."
---

# Autocomplete

A built-in tag for a free-text input with a suggestion dropdown. Unlike
[Select](/components/combobox/select/), the typed value need not match an option — the
list is only a set of suggestions, and the reader can submit anything. It hydrates into a
fully interactive Mantine input in the browser, with no JavaScript to write.

Use it as `{% raw %}{% autocomplete %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'autocomplete', …)`.

## Basic autocomplete

A `label`, a `placeholder`, and a comma-separated `data` list of suggestions. Type freely —
the suggestions filter as you go, but any value submits:

{% autocomplete label='Email' placeholder='you@…' data='gmail.com, outlook.com, proton.me' clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% autocomplete label='Email' placeholder='you@…' data='gmail.com, outlook.com, proton.me' clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'autocomplete',
          label='Email', placeholder='you@…',
          data='gmail.com, outlook.com, proton.me',
          clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Grouped suggestions with dataJson

For grouped suggestions pass a full JSON array through `dataJson` — a list of
`{group, items}` objects. `dataJson` wins over `data` when both are set:

{% autocomplete label='Framework' dataJson='[{"group":"React","items":["Next.js","Remix"]},{"group":"Vue","items":["Nuxt"]}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% autocomplete label='Framework' dataJson='[{"group":"React","items":["Next.js","Remix"]},{"group":"Vue","items":["Nuxt"]}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'autocomplete',
          label='Framework',
          dataJson='[{"group":"React","items":["Next.js","Remix"]},'
                   '{"group":"Vue","items":["Nuxt"]}]')
```
{% endAccordionSection %}
{% endAccordion %}

## Sizes, variants, and a default value

`size` runs `xs`–`xl`; `variant` is `default`, `filled`, or `unstyled`. `defaultValue`
seeds the field with text on load:

{% autocomplete label='Host' data='localhost, 127.0.0.1, example.com' defaultValue='localhost' size='md' variant='filled' radius='md' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% autocomplete label='Host' data='localhost, 127.0.0.1, example.com' defaultValue='localhost' size='md' variant='filled' radius='md' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'autocomplete',
          label='Host', data='localhost, 127.0.0.1, example.com',
          defaultValue='localhost', size='md', variant='filled', radius='md')
```
{% endAccordionSection %}
{% endAccordion %}

## Required, with description and error

`description` adds helper text; `error` shows a validation message; `required` with
`withAsterisk` marks the field and shows the asterisk:

{% autocomplete label='Domain' data='example.com, example.org' description='Where to send mail' required=true withAsterisk=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% autocomplete label='Domain' data='example.com, example.org' description='Where to send mail' required=true withAsterisk=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'autocomplete',
          label='Domain', data='example.com, example.org',
          description='Where to send mail',
          required=True, withAsterisk=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

An autocomplete pairs well with other content inside a
[card](/components/data-display/card/) — here a
[text](/components/typography/text/) lead-in above the field:

{% card %}
{% text size='sm' c='dimmed' %}Pick or type an email provider.{% endText %}

{% autocomplete label='Provider' placeholder='you@…' data='gmail.com, outlook.com, proton.me, fastmail.com' clearable=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Pick or type an email provider.{% endText %}

{% autocomplete label='Provider' placeholder='you@…' data='gmail.com, outlook.com, proton.me, fastmail.com' clearable=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='Pick or type an email provider.', size='sm', c='dimmed') +
    component('aardvark', 'autocomplete',
              label='Provider', placeholder='you@…',
              data='gmail.com, outlook.com, proton.me, fastmail.com',
              clearable=True)
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The body is ignored —
`autocomplete` is a form control, not a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | Comma-separated list | The suggestions. These are plain strings — the typed value is free text, so there is no separate value/label. |
| `dataJson` | JSON array string | A full suggestions array, including `{group, items}` groups. Wins over `data` when both are set. |
| `label` | String | The field label. |
| `placeholder` | String | Empty-state text inside the input. |
| `description` | String | Helper text below the label. |
| `error` | String | Validation message; also styles the field red. |
| `defaultValue` | String | The text shown on load. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Input size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `clearable` | `true`, `false` (default `false`) | Show an × to clear the value. |
| `disabled` | `true`, `false` (default `false`) | Disable the input. |
| `required` | `true`, `false` (default `false`) | Mark the field required. |
| `withAsterisk` | `true`, `false` (default `false`) | Show the required asterisk on the label. |
| `withScrollArea` | `true`, `false` (default `true`) | Wrap a long suggestion list in a scroll area. |
| `maxDropdownHeight` | Integer (px) | Cap the dropdown height. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Autocomplete"]` — or through the Mantine Styles API classes (`.mantine-Autocomplete-root` and its inner parts):

{% raw %}
```css
/* Every rendered Autocomplete carries this island marker */
[data-aardvark-island="Autocomplete"] { }

/* Mantine Styles API class on the root element */
.mantine-Autocomplete-root { }
.mantine-Autocomplete-input { }
.mantine-Autocomplete-label { }
.mantine-Autocomplete-wrapper { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% autocomplete label='Email' placeholder='you@…' data='gmail.com, outlook.com, proton.me' clearable=true attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% autocomplete label='Email' placeholder='you@…' data='gmail.com, outlook.com, proton.me' clearable=true attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'autocomplete',
          label='Email', placeholder='you@…',
          data='gmail.com, outlook.com, proton.me',
          clearable=True, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

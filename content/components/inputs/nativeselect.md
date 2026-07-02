---
title: "NativeSelect"
description: "The built-in nativeselect tag — a native HTML select styled like the other inputs, built from a delimited option list."
---

# NativeSelect

A built-in tag for a native HTML `<select>` styled to match the rest of your form. It uses
the same Input wrapper as [TextInput](/components/inputs/textinput/), so it carries a
label, description, and error message, and builds its options from a `data` string. Because
it renders the browser's native control, it is the lightest, most accessible way to offer a
fixed list of choices.

Use it as `{% raw %}{% nativeselect %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'nativeselect', …)`.

## Options from data

The options come from `data` — a `|`- or comma-delimited string. Each option is trimmed.

{% nativeselect label='Framework' data='React|Vue|Svelte|Angular' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% nativeselect label='Framework' data='React|Vue|Svelte|Angular' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'nativeselect', label='Framework', data='React|Vue|Svelte|Angular')
```
{% endAccordionSection %}
{% endAccordion %}

## Delimiters

Comma-delimited works too. When you use `|`, an option label may itself contain a comma.

{% nativeselect label='Size' data='Small, Medium, Large' description='Comma-delimited' %}

{% nativeselect label='City' data='Paris, France|Rome, Italy|Tokyo, Japan' description='Pipe-delimited so labels can hold commas' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% nativeselect label='Size' data='Small, Medium, Large' description='Comma-delimited' %}

{% nativeselect label='City' data='Paris, France|Rome, Italy|Tokyo, Japan' description='Pipe-delimited so labels can hold commas' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'nativeselect', label='Size', data='Small, Medium, Large', description='Comma-delimited')

component(
    'aardvark', 'nativeselect',
    label='City',
    data='Paris, France|Rome, Italy|Tokyo, Japan',
    description='Pipe-delimited so labels can hold commas',
)
```
{% endAccordionSection %}
{% endAccordion %}

## Pre-select and state

`defaultValue` pre-selects an option; `required` (or `withAsterisk`) adds the asterisk;
`error` shows a validation message and switches the field to the error color.

{% nativeselect label='Tier' data='Free|Pro|Enterprise' defaultValue='Pro' %}

{% nativeselect label='Plan' data='Free|Pro|Enterprise' required=true error='Choose a plan to continue' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% nativeselect label='Tier' data='Free|Pro|Enterprise' defaultValue='Pro' %}

{% nativeselect label='Plan' data='Free|Pro|Enterprise' required=true error='Choose a plan to continue' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'nativeselect', label='Tier', data='Free|Pro|Enterprise', defaultValue='Pro')

component(
    'aardvark', 'nativeselect',
    label='Plan',
    data='Free|Pro|Enterprise',
    required=True,
    error='Choose a plan to continue',
)
```
{% endAccordionSection %}
{% endAccordion %}

## Variant, size, radius, and sections

`variant` is `default`, `filled`, or `unstyled`; `size` and `radius` take `xs`–`xl`;
`leftSection` and `rightSection` put text inside the field; `disabled` renders it inert.

{% nativeselect label='Filled' data='One|Two|Three' variant='filled' %}

{% nativeselect label='Currency' data='USD|EUR|GBP' leftSection='💱' size='lg' radius='md' %}

{% nativeselect label='Locked' data='Free|Pro' disabled=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% nativeselect label='Filled' data='One|Two|Three' variant='filled' %}

{% nativeselect label='Currency' data='USD|EUR|GBP' leftSection='💱' size='lg' radius='md' %}

{% nativeselect label='Locked' data='Free|Pro' disabled=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'nativeselect', label='Filled', data='One|Two|Three', variant='filled')

component('aardvark', 'nativeselect', label='Currency', data='USD|EUR|GBP', leftSection='💱', size='lg', radius='md')

component('aardvark', 'nativeselect', label='Locked', data='Free|Pro', disabled=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Group a select with other fields inside a [fieldset](/components/inputs/fieldset/).

{% fieldset legend='Preferences' %}
{% nativeselect label='Theme' data='System|Light|Dark' defaultValue='System' %}
{% nativeselect label='Language' data='English|Français|日本語' %}
{% endFieldset %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% fieldset legend='Preferences' %}
{% nativeselect label='Theme' data='System|Light|Dark' defaultValue='System' %}
{% nativeselect label='Language' data='English|Français|日本語' %}
{% endFieldset %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
inner = (
    component('aardvark', 'nativeselect', label='Theme', data='System|Light|Dark', defaultValue='System')
    + component('aardvark', 'nativeselect', label='Language', data='English|Français|日本語')
)
component('aardvark', 'fieldset', legend='Preferences', children=inner)
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | string | Options as a `\|`- or comma-delimited string. Use `\|` when an option label contains a comma. |
| `defaultValue` | string | The option pre-selected on load. |
| `label` | string | Label shown above the field. |
| `description` | string | Help text shown under the label. |
| `error` | string | Validation message shown below the field; switches it to the error color. |
| `variant` | `default`, `filled`, `unstyled` | Visual style. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Field size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` (or any CSS value) | Corner radius. |
| `required` | `true` / `false` | Mark the field required and add the asterisk. Default `false`. |
| `withAsterisk` | `true` / `false` | Add the asterisk without the `required` semantics. Default `false`. |
| `disabled` | `true` / `false` | Render the field disabled. Default `false`. |
| `leftSection` | string | Text shown inside the field on the left. |
| `rightSection` | string | Text shown inside the field on the right. |

## CSS Selectors

Target a `{% nativeselect %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every NativeSelect instance on the page */
[data-aardvark-island="NativeSelect"] { }

/* Mantine Styles API parts */
.mantine-NativeSelect-root { }
.mantine-NativeSelect-input { }
.mantine-NativeSelect-section { }
```
{% endraw %}

## Injecting Attributes

Pass `attr={…}` to forward raw HTML attributes — including inline event handlers — straight onto the rendered element. Here it is wired to `onchange`, so changing the field logs its new value to the console and alerts it:

{% nativeselect label='Framework' data='React|Vue|Svelte|Angular' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% nativeselect label='Framework' data='React|Vue|Svelte|Angular' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'nativeselect', label='Framework', data='React|Vue|Svelte|Angular', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

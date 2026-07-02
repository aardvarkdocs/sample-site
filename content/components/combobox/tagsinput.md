---
title: "TagsInput"
description: "The built-in tagsinput tag — type free-text tags that become removable pills. Usage, options, and live examples (suggestions, maxTags, splitChars)."
---

# TagsInput

A built-in tag for a free-text tags field: type a value, press Enter, and it becomes a
removable [Pill](/components/combobox/pill/). Unlike
[MultiSelect](/components/combobox/multiselect/) the tags are free text — `data` is only an
optional set of autocomplete suggestions, not a fixed option list. It hydrates into a fully
interactive Mantine input in the browser.

Use it as `{% raw %}{% tagsinput %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'tagsinput', …)`.

## Basic tags input

A `label`, a `placeholder`, and a `defaultValue` of pre-filled tags (a comma-separated
list):

{% tagsinput label='Tags' placeholder='Type and press Enter' defaultValue='docs, markdown' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tagsinput label='Tags' placeholder='Type and press Enter' defaultValue='docs, markdown' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tagsinput',
          label='Tags', placeholder='Type and press Enter',
          defaultValue='docs, markdown')
```
{% endAccordionSection %}
{% endAccordion %}

## With suggestions

`data` gives autocomplete suggestions as the reader types; they are plain strings, since the
typed value is free text. `clearable` shows an × to drop all tags:

{% tagsinput label='Skills' data='Python, JavaScript, Go, Rust' clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tagsinput label='Skills' data='Python, JavaScript, Go, Rust' clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tagsinput',
          label='Skills', data='Python, JavaScript, Go, Rust',
          clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Limiting and splitting

`maxTags` caps the count; `splitChars` adds separators that commit a tag (the default is
Enter only). Here a comma also commits, up to three tags:

{% tagsinput label='Up to 3, comma also commits' maxTags=3 splitChars=',' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tagsinput label='Up to 3, comma also commits' maxTags=3 splitChars=',' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tagsinput',
          label='Up to 3, comma also commits',
          maxTags=3, splitChars=',')
```
{% endAccordionSection %}
{% endAccordion %}

## Allowing duplicates

By default a tag can appear only once. `allowDuplicates` lets the same tag be added again;
`acceptValueOnBlur` (on by default) commits a pending tag when the field loses focus:

{% tagsinput label='Log entries' defaultValue='start' allowDuplicates=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tagsinput label='Log entries' defaultValue='start' allowDuplicates=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tagsinput',
          label='Log entries', defaultValue='start',
          allowDuplicates=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A tags input fits inside a [card](/components/data-display/card/) alongside other content —
here a [text](/components/typography/text/) lead-in above the field:

{% card %}
{% text size='sm' c='dimmed' %}Tag this article for search.{% endText %}

{% tagsinput label='Tags' placeholder='Type and press Enter' data='docs, guide, reference, tutorial' clearable=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Tag this article for search.{% endText %}

{% tagsinput label='Tags' placeholder='Type and press Enter' data='docs, guide, reference, tutorial' clearable=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='Tag this article for search.', size='sm', c='dimmed') +
    component('aardvark', 'tagsinput',
              label='Tags', placeholder='Type and press Enter',
              data='docs, guide, reference, tutorial', clearable=True)
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The body is ignored —
`tagsinput` is a form control, not a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | Comma-separated list | Optional autocomplete suggestions — plain strings, since tags are free text. |
| `dataJson` | JSON array string | A full suggestions array, including `{group, items}` groups. Wins over `data` when both are set. |
| `defaultValue` | Comma-separated list | The tags shown on load. |
| `splitChars` | Comma-separated characters | Separators that commit a tag (in addition to Enter). For example `,` or `,\| ` for several. |
| `maxTags` | Integer | Cap the number of tags. |
| `label` | String | The field label. |
| `placeholder` | String | Empty-state text inside the input. |
| `description` | String | Helper text below the label. |
| `error` | String | Validation message; also styles the field red. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Input size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `searchable` | `true`, `false` (default `false`) | Filter the suggestion list by typing. |
| `clearable` | `true`, `false` (default `false`) | Show an × to clear all tags. |
| `acceptValueOnBlur` | `true`, `false` (default `true`) | Commit the pending value when the field loses focus. |
| `allowDuplicates` | `true`, `false` (default `false`) | Allow the same tag more than once. |
| `disabled` | `true`, `false` (default `false`) | Disable the input. |
| `required` | `true`, `false` (default `false`) | Mark the field required. |
| `withAsterisk` | `true`, `false` (default `false`) | Show the required asterisk on the label. |
| `maxDropdownHeight` | Integer (px) | Cap the suggestion dropdown height. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="TagsInput"]` — or through the Mantine Styles API classes (`.mantine-TagsInput-root` and its inner parts):

{% raw %}
```css
/* Every rendered TagsInput carries this island marker */
[data-aardvark-island="TagsInput"] { }

/* Mantine Styles API class on the root element */
.mantine-TagsInput-root { }
.mantine-TagsInput-input { }
.mantine-TagsInput-pill { }
.mantine-TagsInput-label { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — here it is wired to `onchange` on the search box, so typing to filter logs the text you type to the console and alerts it — selecting items is React state and fires no DOM `change` event:

{% tagsinput label='Tags' placeholder='Type and press Enter' defaultValue='docs, markdown' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% tagsinput label='Tags' placeholder='Type and press Enter' defaultValue='docs, markdown' attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'tagsinput',
          label='Tags', placeholder='Type and press Enter',
          defaultValue='docs, markdown', attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

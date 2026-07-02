---
title: "PillsInput"
description: "The built-in pillsinput tag — the input shell that holds a row of pills plus a field. A composition primitive; use MultiSelect or TagsInput for the ready-made versions."
---

# PillsInput

`PillsInput` is the input shell that holds a row of pills plus a text field — the
composition primitive [MultiSelect](/components/combobox/multiselect/) and
[TagsInput](/components/combobox/tagsinput/) are built on top of. On its own it renders only
the bordered, labelled container; it does not manage selection, add or remove pills, or
filter options. Put [Pills](/components/combobox/pill/) in the body to fill it. For a
ready-made interactive multi-value field reach for
[MultiSelect](/components/combobox/multiselect/) or
[TagsInput](/components/combobox/tagsinput/); `PillsInput` is here for the rare case where
you want the shell's look around your own static content.

Use it as `{% raw %}{% pillsinput %}…{% endPillsinput %}{% endraw %}` in Markdown, or call
it from Python logic (loops, snippets) via `component('aardvark', 'pillsinput', …)`.

## Basic shell

Put [Pills](/components/combobox/pill/) in the body. The tag gives them a labelled, bordered
shell. `description` adds helper text below the label:

{% pillsinput label='Tags' description='A static demo shell' %}
{% pill withRemoveButton=true %}docs{% endPill %}
{% pill withRemoveButton=true %}markdown{% endPill %}
{% endPillsinput %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pillsinput label='Tags' description='A static demo shell' %}
{% pill withRemoveButton=true %}docs{% endPill %}
{% pill withRemoveButton=true %}markdown{% endPill %}
{% endPillsinput %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pillsinput',
          label='Tags', description='A static demo shell',
          children=(
              component('aardvark', 'pill', children='docs', withRemoveButton=True) +
              component('aardvark', 'pill', children='markdown', withRemoveButton=True)
          ))
```
{% endAccordionSection %}
{% endAccordion %}

## Sizes, variants, and required

`size` runs `xs`–`xl`; `variant` is `default`, `filled`, or `unstyled`; `radius` follows the
same `xs`–`xl` scale. `required` with `withAsterisk` marks the field:

{% pillsinput label='Filters' size='lg' variant='filled' radius='md' required=true withAsterisk=true %}
{% pill %}active{% endPill %}
{% endPillsinput %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pillsinput label='Filters' size='lg' variant='filled' radius='md' required=true withAsterisk=true %}
{% pill %}active{% endPill %}
{% endPillsinput %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pillsinput',
          label='Filters', size='lg', variant='filled', radius='md',
          required=True, withAsterisk=True,
          children=component('aardvark', 'pill', children='active'))
```
{% endAccordionSection %}
{% endAccordion %}

## Showing an error

`error` shows a validation message and styles the shell red:

{% pillsinput label='Tags' error='Pick at least one tag' %}
{% pill %}draft{% endPill %}
{% endPillsinput %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pillsinput label='Tags' error='Pick at least one tag' %}
{% pill %}draft{% endPill %}
{% endPillsinput %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pillsinput',
          label='Tags', error='Pick at least one tag',
          children=component('aardvark', 'pill', children='draft'))
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The shell sits inside a [card](/components/data-display/card/) alongside other content — here
a [text](/components/typography/text/) lead-in above it:

{% card %}
{% text size='sm' c='dimmed' %}Applied filters (read-only).{% endText %}

{% pillsinput label='Filters' %}
{% pill withRemoveButton=true %}status: open{% endPill %}
{% pill withRemoveButton=true %}label: bug{% endPill %}
{% endPillsinput %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Applied filters (read-only).{% endText %}

{% pillsinput label='Filters' %}
{% pill withRemoveButton=true %}status: open{% endPill %}
{% pill withRemoveButton=true %}label: bug{% endPill %}
{% endPillsinput %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='Applied filters (read-only).', size='sm', c='dimmed') +
    component('aardvark', 'pillsinput', label='Filters', children=(
        component('aardvark', 'pill', children='status: open', withRemoveButton=True) +
        component('aardvark', 'pill', children='label: bug', withRemoveButton=True)
    ))
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The block body is the
shell's content — typically a set of [Pills](/components/combobox/pill/).

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | String | The field label. |
| `description` | String | Helper text below the label. |
| `error` | String | Validation message; also styles the shell red. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Input size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `disabled` | `true`, `false` (default `false`) | Render in a disabled state. |
| `required` | `true`, `false` (default `false`) | Mark the field required. |
| `withAsterisk` | `true`, `false` (default `false`) | Show the required asterisk on the label. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="PillsInput"]` — or through the Mantine Styles API classes (`.mantine-PillsInput-root` and its inner parts):

{% raw %}
```css
/* Every rendered PillsInput carries this island marker */
[data-aardvark-island="PillsInput"] { }

/* Mantine Styles API class on the root element */
.mantine-PillsInput-root { }
.mantine-PillsInput-input { }
.mantine-PillsInput-label { }
.mantine-PillsInput-wrapper { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% pillsinput label='Tags' description='A static demo shell' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% pillsinput label='Tags' description='A static demo shell' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'pillsinput',
          label='Tags', description='A static demo shell', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

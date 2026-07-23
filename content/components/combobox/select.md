---
title: "Select"
description: "The built-in select tag — a searchable single-select dropdown. Usage, options, and live examples (searchable, clearable, groups, sizes, variants)."
---

# Select

A built-in tag for a single-select dropdown — the reader picks one option from a list.
It hydrates into a fully interactive Mantine input in the browser, with no JavaScript to
write. Give it a `label` and an options list through `data`, where the simplest form is a
comma-separated list and `value::label` pairs let a stored value carry a friendly label.

Use it as `{% raw %}{% select %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'select', …)`.

## Basic select

A `label`, a `placeholder`, and a comma-separated `data` list:

{% select label='Framework' placeholder='Pick one' data='React, Vue, Svelte, Angular' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% select label='Framework' placeholder='Pick one' data='React, Vue, Svelte, Angular' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'select',
          label='Framework', placeholder='Pick one',
          data='React, Vue, Svelte, Angular')
```
{% endAccordionSection %}
{% endAccordion %}

## value::label pairs, searchable, clearable

`value::label` pairs (a double colon) let a short stored value carry a display label.
`searchable` lets the reader filter by typing; `clearable` shows an × to reset:

{% select label='Country' data='us::United States, ca::Canada, mx::Mexico' searchable=true clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% select label='Country' data='us::United States, ca::Canada, mx::Mexico' searchable=true clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'select',
          label='Country',
          data='us::United States, ca::Canada, mx::Mexico',
          searchable=True, clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## Grouped options with dataJson

For grouped, disabled, or otherwise richer options, pass a full JSON array through
`dataJson` — a list of `{group, items}` objects. `dataJson` wins over `data` when both are
set:

{% select label='Language' searchable=true dataJson='[{"group":"Frontend","items":["JavaScript","TypeScript"]},{"group":"Backend","items":["Python","Go","Rust"]}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% select label='Language' searchable=true dataJson='[{"group":"Frontend","items":["JavaScript","TypeScript"]},{"group":"Backend","items":["Python","Go","Rust"]}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'select',
          label='Language', searchable=True,
          dataJson='[{"group":"Frontend","items":["JavaScript","TypeScript"]},'
                   '{"group":"Backend","items":["Python","Go","Rust"]}]')
```
{% endAccordionSection %}
{% endAccordion %}

## Sizes and variants

`size` runs `xs`–`xl`; `variant` is `default`, `filled`, or `unstyled`; `radius` follows
the same `xs`–`xl` scale. `defaultValue` selects an option on load:

{% select label='Small' data='S, M, L' size='xs' defaultValue='M' %}

{% select label='Filled' data='One, Two, Three' variant='filled' radius='xl' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% select label='Small' data='S, M, L' size='xs' defaultValue='M' %}
{% select label='Filled' data='One, Two, Three' variant='filled' radius='xl' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'select', label='Small', data='S, M, L', size='xs', defaultValue='M')
component('aardvark', 'select', label='Filled', data='One, Two, Three', variant='filled', radius='xl')
```
{% endAccordionSection %}
{% endAccordion %}

## Required, with description and error

`description` adds helper text below the label; `error` shows a validation message;
`required` with `withAsterisk` marks the field and shows the asterisk:

{% select label='Plan' data='Free, Pro, Enterprise' description='Choose a billing tier' required=true withAsterisk=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% select label='Plan' data='Free, Pro, Enterprise' description='Choose a billing tier' required=true withAsterisk=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'select',
          label='Plan', data='Free, Pro, Enterprise',
          description='Choose a billing tier',
          required=True, withAsterisk=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A select sits naturally inside a [card](/components/data-display/card/) alongside other
content — here a short [text](/components/typography/text/) lead-in above the field:

{% card %}
{% text size='sm' c='dimmed' %}Set your preferred deployment region.{% endText %}

{% select label='Region' data='us-east::US East, us-west::US West, eu::Europe, ap::Asia Pacific' searchable=true clearable=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Set your preferred deployment region.{% endText %}

{% select label='Region' data='us-east::US East, us-west::US West, eu::Europe, ap::Asia Pacific' searchable=true clearable=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='Set your preferred deployment region.', size='sm', c='dimmed') +
    component('aardvark', 'select',
              label='Region',
              data='us-east::US East, us-west::US West, eu::Europe, ap::Asia Pacific',
              searchable=True, clearable=True)
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The body is ignored —
`select` is a form control, not a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | Comma-separated list, or `value::label` pairs (double colon) | The options. A bare item is both value and label; `value::label` carries a separate stored value. A single `:` is left intact (so URLs and times pass through). |
| `dataJson` | JSON array string | A full options array — plain strings, `{value, label}` objects, `{group, items}` groups, and `{value, label, disabled}` flags. Wins over `data` when both are set. |
| `label` | String | The field label. |
| `placeholder` | String | Empty-state text inside the input. |
| `description` | String | Helper text below the label. |
| `error` | String | Validation message; also styles the field red. |
| `defaultValue` | A value from `data` | The option selected on load. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Input size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `searchable` | `true`, `false` (default `false`) | Let the reader filter options by typing. |
| `clearable` | `true`, `false` (default `false`) | Show an × to clear the selection. |
| `disabled` | `true`, `false` (default `false`) | Disable the input. |
| `required` | `true`, `false` (default `false`) | Mark the field required. |
| `withAsterisk` | `true`, `false` (default `false`) | Show the required asterisk on the label. |
| `allowDeselect` | `true`, `false` (default `true`) | Click the selected option again to clear it. |
| `withCheckIcon` | `true`, `false` (default `true`) | Show the check mark on the selected option. |
| `checkIconPosition` | `left`, `right` | Which side the check mark sits on. |
| `withScrollArea` | `true`, `false` (default `true`) | Wrap a long dropdown in a scroll area. |
| `nothingFoundMessage` | String | Text shown when a search matches nothing. |
| `maxDropdownHeight` | Integer (px) | Cap the dropdown height. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Select"]` — or through the Mantine Styles API classes (`.mantine-Select-root` and its inner parts):

{% raw %}
```css
/* Every rendered Select carries this island marker */
[data-aardvark-island="Select"] { }

/* Mantine Styles API class on the root element */
.mantine-Select-root { }
.mantine-Select-input { }
.mantine-Select-label { }
.mantine-Select-wrapper { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered element. A read-only combobox manages its own click and selection (React state — there's no native `change`/`click` to hook from an inline handler), so `attr` is best here for a static `data-*` hook, an `id`, or ARIA. It lands on the rendered input, where scripts, tests, or DevTools can find it:

{% select label='Framework' placeholder='Pick one' data='React, Vue, Svelte, Angular' attr={'data-testid': 'framework-select'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% select label='Framework' placeholder='Pick one' data='React, Vue, Svelte, Angular' attr={'data-testid': 'framework-select'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'select',
          label='Framework', placeholder='Pick one',
          data='React, Vue, Svelte, Angular',
          attr={'data-testid': 'framework-select'})
```
{% endAccordionSection %}
{% endAccordion %}

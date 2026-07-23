---
title: "MultiSelect"
description: "The built-in multiselect tag — pick several options, shown as removable pills. Usage, options, and live examples (searchable, maxValues, groups)."
---

# MultiSelect

A built-in tag for picking several options at once. Each chosen value shows as a removable
[Pill](/components/combobox/pill/) inside the input, and the value is a list. Options come
through `data` (the same convention as [Select](/components/combobox/select/) — a
comma-separated list or `value::label` pairs). It hydrates into a fully interactive Mantine
input in the browser.

Use it as `{% raw %}{% multiselect %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'multiselect', …)`.

## Basic multiselect

A `label`, a `placeholder`, and a comma-separated `data` list. `searchable` lets the reader
filter; `clearable` shows an × to drop all selections:

{% multiselect label='Stack' placeholder='Pick a few' data='React, Vue, Svelte, Angular, Solid' searchable=true clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% multiselect label='Stack' placeholder='Pick a few' data='React, Vue, Svelte, Angular, Solid' searchable=true clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'multiselect',
          label='Stack', placeholder='Pick a few',
          data='React, Vue, Svelte, Angular, Solid',
          searchable=True, clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## value::label pairs with a default value

`value::label` pairs (a double colon) give each option a stored value and a display label.
`defaultValue` is a comma-separated list of values pre-selected on load:

{% multiselect label='Languages' data='js::JavaScript, ts::TypeScript, py::Python, go::Go' defaultValue='ts, py' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% multiselect label='Languages' data='js::JavaScript, ts::TypeScript, py::Python, go::Go' defaultValue='ts, py' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'multiselect',
          label='Languages',
          data='js::JavaScript, ts::TypeScript, py::Python, go::Go',
          defaultValue='ts, py')
```
{% endAccordionSection %}
{% endAccordion %}

## Grouped options with dataJson

For grouped, disabled, or richer options pass a full JSON array through `dataJson` — a list
of `{group, items}` objects. `dataJson` wins over `data`:

{% multiselect label='Tooling' searchable=true dataJson='[{"group":"Build","items":["Vite","esbuild","Webpack"]},{"group":"Test","items":["Vitest","Jest","Playwright"]}]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% multiselect label='Tooling' searchable=true dataJson='[{"group":"Build","items":["Vite","esbuild","Webpack"]},{"group":"Test","items":["Vitest","Jest","Playwright"]}]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'multiselect',
          label='Tooling', searchable=True,
          dataJson='[{"group":"Build","items":["Vite","esbuild","Webpack"]},'
                   '{"group":"Test","items":["Vitest","Jest","Playwright"]}]')
```
{% endAccordionSection %}
{% endAccordion %}

## Limiting and hiding picked options

`maxValues` caps how many can be chosen — once full, the rest are disabled.
`hidePickedOptions` drops an option from the dropdown once it's selected:

{% multiselect label='Pick up to 2' data='Red, Green, Blue, Yellow' maxValues=2 %}

{% multiselect label='Toppings' data='Cheese, Mushroom, Olive, Onion' hidePickedOptions=true clearable=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% multiselect label='Pick up to 2' data='Red, Green, Blue, Yellow' maxValues=2 %}
{% multiselect label='Toppings' data='Cheese, Mushroom, Olive, Onion' hidePickedOptions=true clearable=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'multiselect', label='Pick up to 2', data='Red, Green, Blue, Yellow', maxValues=2)
component('aardvark', 'multiselect', label='Toppings', data='Cheese, Mushroom, Olive, Onion',
          hidePickedOptions=True, clearable=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

A multiselect fits inside a [card](/components/data-display/card/) alongside other content —
here a [text](/components/typography/text/) lead-in above the field:

{% card %}
{% text size='sm' c='dimmed' %}Select the frameworks your project uses.{% endText %}

{% multiselect label='Frameworks' placeholder='Add a few' data='React, Vue, Svelte, Angular, Solid' searchable=true clearable=true %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Select the frameworks your project uses.{% endText %}

{% multiselect label='Frameworks' placeholder='Add a few' data='React, Vue, Svelte, Angular, Solid' searchable=true clearable=true %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='Select the frameworks your project uses.', size='sm', c='dimmed') +
    component('aardvark', 'multiselect',
              label='Frameworks', placeholder='Add a few',
              data='React, Vue, Svelte, Angular, Solid',
              searchable=True, clearable=True)
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The body is ignored —
`multiselect` is a form control, not a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | Comma-separated list, or `value::label` pairs (double colon) | The options. A bare item is both value and label; `value::label` carries a separate stored value. A single `:` is left intact. |
| `dataJson` | JSON array string | A full options array — plain strings, `{value, label}` objects, `{group, items}` groups, and disabled flags. Wins over `data` when both are set. |
| `defaultValue` | Comma-separated list of values from `data` | The options selected on load. |
| `maxValues` | Integer | Cap the number of selections; further options are disabled once full. |
| `label` | String | The field label. |
| `placeholder` | String | Empty-state text inside the input. |
| `description` | String | Helper text below the label. |
| `error` | String | Validation message; also styles the field red. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Input size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `searchable` | `true`, `false` (default `false`) | Let the reader filter options by typing. |
| `clearable` | `true`, `false` (default `false`) | Show an × to clear all selections. |
| `hidePickedOptions` | `true`, `false` (default `false`) | Remove an option from the dropdown once it's picked. |
| `disabled` | `true`, `false` (default `false`) | Disable the input. |
| `required` | `true`, `false` (default `false`) | Mark the field required. |
| `withAsterisk` | `true`, `false` (default `false`) | Show the required asterisk on the label. |
| `withCheckIcon` | `true`, `false` (default `true`) | Show the check mark on a selected option. |
| `checkIconPosition` | `left`, `right` | Which side the check mark sits on. |
| `withScrollArea` | `true`, `false` (default `true`) | Wrap a long dropdown in a scroll area. |
| `nothingFoundMessage` | String | Text shown when a search matches nothing. |
| `maxDropdownHeight` | Integer (px) | Cap the dropdown height. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="MultiSelect"]` — or through the Mantine Styles API classes (`.mantine-MultiSelect-root` and its inner parts):

{% raw %}
```css
/* Every rendered MultiSelect carries this island marker */
[data-aardvark-island="MultiSelect"] { }

/* Mantine Styles API class on the root element */
.mantine-MultiSelect-root { }
.mantine-MultiSelect-input { }
.mantine-MultiSelect-pill { }
.mantine-MultiSelect-label { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — here it is wired to `onchange` on the search box, so typing to filter logs the text you type to the console and alerts it — selecting items is React state and fires no DOM `change` event:

{% multiselect label='Stack' placeholder='Pick a few' data='React, Vue, Svelte, Angular, Solid' searchable=true clearable=true attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% multiselect label='Stack' placeholder='Pick a few' data='React, Vue, Svelte, Angular, Solid' searchable=true clearable=true attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'multiselect',
          label='Stack', placeholder='Pick a few',
          data='React, Vue, Svelte, Angular, Solid',
          searchable=True, clearable=True, attr={'onchange': '''
const value = this.value;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

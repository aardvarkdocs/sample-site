---
title: "Combobox"
description: "The built-in combobox tag — the low-level primitive the whole select family is built on. A composition primitive; use Select or MultiSelect for the ready-made versions."
---

# Combobox

`Combobox` is the low-level composition primitive the entire select family is built on —
[Select](/components/combobox/select/),
[Autocomplete](/components/combobox/autocomplete/),
[MultiSelect](/components/combobox/multiselect/), and
[TagsInput](/components/combobox/tagsinput/) are all assembled from it. A real `Combobox` is
wired up with the `useCombobox()` React hook — state a build-time Markdown tag can't supply —
so this tag renders a small, self-contained working example of the primitive (a
button-trigger single-select) so you can see it in action. For a configurable field reach
for [Select](/components/combobox/select/) or one of the others; to build a fully custom
dropdown, compose the primitive in a snippet (see
[Building your own](#building-your-own) below).

Use it as `{% raw %}{% combobox %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'combobox', …)`.

## Working example

Give the example its options through `data` — a comma-separated list, or `value::label`
pairs (a double colon, so a stored value carries a display label). `placeholder` is the
empty-state label on the trigger:

{% combobox data='React, Vue, Svelte, Angular' placeholder='Pick a framework' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% combobox data='React, Vue, Svelte, Angular' placeholder='Pick a framework' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'combobox',
          data='React, Vue, Svelte, Angular',
          placeholder='Pick a framework')
```
{% endAccordionSection %}
{% endAccordion %}

## value::label pairs and dataJson

`value::label` pairs give each option a stored value and a display label. For richer
options pass a full JSON array through `dataJson`, which wins over `data`:

{% combobox data='us::United States, ca::Canada, mx::Mexico' placeholder='Pick a country' %}

{% combobox dataJson='["Small","Medium","Large"]' placeholder='Pick a size' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% combobox data='us::United States, ca::Canada, mx::Mexico' placeholder='Pick a country' %}
{% combobox dataJson='["Small","Medium","Large"]' placeholder='Pick a size' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'combobox', data='us::United States, ca::Canada, mx::Mexico', placeholder='Pick a country')
component('aardvark', 'combobox', dataJson='["Small","Medium","Large"]', placeholder='Pick a size')
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

The example trigger sits inside a [card](/components/data-display/card/) alongside other
content — here a [text](/components/typography/text/) lead-in above it:

{% card %}
{% text size='sm' c='dimmed' %}A single-select built from the raw Combobox primitives.{% endText %}

{% combobox data='React, Vue, Svelte, Angular' placeholder='Pick a framework' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}A single-select built from the raw Combobox primitives.{% endText %}

{% combobox data='React, Vue, Svelte, Angular' placeholder='Pick a framework' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='A single-select built from the raw Combobox primitives.', size='sm', c='dimmed') +
    component('aardvark', 'combobox', data='React, Vue, Svelte, Angular', placeholder='Pick a framework')
))
```
{% endAccordionSection %}
{% endAccordion %}

## Building your own

The `combobox` tag is a demonstration of the primitive, not a configurable field. When you
need a genuinely custom dropdown — custom option rendering, custom filtering, a multi-value
layout — drop a React component in `snippets/` and compose Mantine's `Combobox`,
`Combobox.Target`, `Combobox.Options`, and `Combobox.Option` there, then call it from
Markdown like any [custom component](/authoring/components-and-snippets/). For anything
short of that, the four ready-made inputs — [Select](/components/combobox/select/),
[Autocomplete](/components/combobox/autocomplete/),
[MultiSelect](/components/combobox/multiselect/), and
[TagsInput](/components/combobox/tagsinput/) — already cover it.

## Attributes

The tag renders a fixed demonstration trigger, so it takes only the option list and a
placeholder. The body is ignored.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | Comma-separated list, or `value::label` pairs (double colon) | Options for the demo. A bare item is both value and label; `value::label` carries a separate stored value. A single `:` is left intact. |
| `dataJson` | JSON array string | A full options array — plain strings or `{value, label}` objects. Wins over `data` when both are set. |
| `placeholder` | String | The empty-state label on the trigger. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="Combobox"]`. The `Combobox` primitive is a context provider with no DOM root of its own, so style its trigger through the `Input` parts and its popup through the Combobox Styles API parts:

{% raw %}
```css
/* Every rendered Combobox carries this island marker */
[data-aardvark-island="Combobox"] { }

/* The trigger is rendered through Mantine's Input */
.mantine-InputBase-input { }

/* Mantine Styles API parts on the dropdown popup */
.mantine-Combobox-dropdown { }
.mantine-Combobox-option { }
.mantine-Combobox-options { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — including event handlers — straight onto the rendered element, so you can wire DOM behavior the tag does not expose. The handler can be a full multi-line script, not just one expression — this one logs the value to the console and shows it in an alert:

{% combobox data='React, Vue, Svelte, Angular' placeholder='Pick a framework' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% combobox data='React, Vue, Svelte, Angular' placeholder='Pick a framework' attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'combobox',
          data='React, Vue, Svelte, Angular',
          placeholder='Pick a framework', attr={'onclick': '''
const value = this.innerText;
console.log('attr demo value:', value);
alert(value);
'''})
```
{% endAccordionSection %}
{% endAccordion %}

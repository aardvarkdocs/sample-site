---
title: "TreeSelect"
description: "The built-in treeselect tag — pick a leaf from a collapsible hierarchy. Usage, the nested JSON data shape, and a live example."
---

# TreeSelect

A built-in tag for selecting one value from a hierarchy — a dropdown whose options are a
collapsible tree. Click a folder to expand it; click a leaf to select it. Set `searchable`
to filter the tree as you type. It hydrates into a fully interactive island just like the
other select tags.

Use it as `{% raw %}{% treeselect %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'treeselect', …)`.

## Basic tree select

The hierarchy comes through `data` — a JSON array of nested nodes, each an object with a
`value`, a `label`, and an optional `children` array of the same shape. Only leaf nodes
(those without `children`) resolve to a selection; clicking a branch just expands or
collapses it. `clearable` shows an × to reset:

{% treeselect label='Pick a file' placeholder='Browse…' clearable=true data='[
  {"value":"src","label":"src","children":[
    {"value":"src/app.py","label":"app.py"},
    {"value":"src/utils","label":"utils","children":[
      {"value":"src/utils/text.py","label":"text.py"}
    ]}
  ]},
  {"value":"README.md","label":"README.md"}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% treeselect label='Pick a file' placeholder='Browse…' clearable=true data='[
  {"value":"src","label":"src","children":[
    {"value":"src/app.py","label":"app.py"},
    {"value":"src/utils","label":"utils","children":[
      {"value":"src/utils/text.py","label":"text.py"}
    ]}
  ]},
  {"value":"README.md","label":"README.md"}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'treeselect',
          label='Pick a file', placeholder='Browse…', clearable=True,
          data='''[
  {"value":"src","label":"src","children":[
    {"value":"src/app.py","label":"app.py"},
    {"value":"src/utils","label":"utils","children":[
      {"value":"src/utils/text.py","label":"text.py"}
    ]}
  ]},
  {"value":"README.md","label":"README.md"}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## Sizes, variants, description, and search

`size` runs `xs`–`xl`; `variant` is `default`, `filled`, or `unstyled`. `description` adds
helper text below the label, and `error` shows a validation message. `searchable` adds a
search field that filters the tree as you type:

{% treeselect label='Category' description='Pick the deepest matching node' size='md' variant='filled' radius='md' searchable=true data='[
  {"value":"hardware","label":"Hardware","children":[
    {"value":"hardware/laptops","label":"Laptops"},
    {"value":"hardware/phones","label":"Phones"}
  ]},
  {"value":"software","label":"Software","children":[
    {"value":"software/os","label":"Operating systems"}
  ]}
]' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% treeselect label='Category' description='Pick the deepest matching node' size='md' variant='filled' radius='md' searchable=true data='[
  {"value":"hardware","label":"Hardware","children":[
    {"value":"hardware/laptops","label":"Laptops"},
    {"value":"hardware/phones","label":"Phones"}
  ]},
  {"value":"software","label":"Software","children":[
    {"value":"software/os","label":"Operating systems"}
  ]}
]' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'treeselect',
          label='Category', description='Pick the deepest matching node',
          size='md', variant='filled', radius='md', searchable=True,
          data='''[
  {"value":"hardware","label":"Hardware","children":[
    {"value":"hardware/laptops","label":"Laptops"},
    {"value":"hardware/phones","label":"Phones"}
  ]},
  {"value":"software","label":"Software","children":[
    {"value":"software/os","label":"Operating systems"}
  ]}
]''')
```
{% endAccordionSection %}
{% endAccordion %}

## Data shape

Each node is an object:

```json
{
  "value": "unique-id",
  "label": "Display text",
  "children": [ /* more nodes, optional */ ]
}
```

`value` must be unique across the whole tree — it's what gets selected; `label` is what the
reader sees. A node with no `children` is a selectable leaf. Unlike the flat select family,
`treeselect` takes only this nested JSON tree, not a comma-separated `data` list.

## With other components

A tree select fits inside a [card](/components/data-display/card/) alongside other content —
here a [text](/components/typography/text/) lead-in above the field:

{% card %}
{% text size='sm' c='dimmed' %}Choose where this document lives.{% endText %}

{% treeselect label='Location' placeholder='Browse…' clearable=true data='[
  {"value":"docs","label":"docs","children":[
    {"value":"docs/guide","label":"guide"},
    {"value":"docs/reference","label":"reference"}
  ]},
  {"value":"blog","label":"blog"}
]' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card %}
{% text size='sm' c='dimmed' %}Choose where this document lives.{% endText %}

{% treeselect label='Location' placeholder='Browse…' clearable=true data='[
  {"value":"docs","label":"docs","children":[
    {"value":"docs/guide","label":"guide"},
    {"value":"docs/reference","label":"reference"}
  ]},
  {"value":"blog","label":"blog"}
]' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
tree = '''[
  {"value":"docs","label":"docs","children":[
    {"value":"docs/guide","label":"guide"},
    {"value":"docs/reference","label":"reference"}
  ]},
  {"value":"blog","label":"blog"}
]'''
component('aardvark', 'card', children=(
    component('aardvark', 'text', children='Choose where this document lives.', size='sm', c='dimmed') +
    component('aardvark', 'treeselect',
              label='Location', placeholder='Browse…', clearable=True, data=tree)
))
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Every attribute is optional; omit one to take its Mantine default. The body is ignored —
`treeselect` is a form control, not a container.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `data` | JSON array string | The hierarchy — a JSON array of nested `{value, label, children}` nodes. A node without `children` is a selectable leaf. |
| `label` | String | The field label. |
| `placeholder` | String | Empty-state text on the trigger. |
| `description` | String | Helper text below the label. |
| `error` | String | Validation message; also styles the field red. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Input size. |
| `radius` | `xs`, `sm`, `md`, `lg`, `xl` | Corner radius. |
| `variant` | `default`, `filled`, `unstyled` | Input style. |
| `clearable` | `true`, `false` (default `false`) | Show an × to clear the selection. |
| `searchable` | `true`, `false` (default `false`) | Add a search field that filters the tree as you type. |
| `disabled` | `true`, `false` (default `false`) | Disable the input. |
## CSS Selectors

Target the rendered element through its island marker — `[data-aardvark-island="TreeSelect"]` — or through the Mantine Styles API classes (`.mantine-TreeSelect-root` and its inner parts):

{% raw %}
```css
/* Every rendered TreeSelect carries this island marker */
[data-aardvark-island="TreeSelect"] { }

/* Mantine Styles API class on the root element */
.mantine-TreeSelect-root { }
.mantine-TreeSelect-input { }
.mantine-TreeSelect-label { }
.mantine-TreeSelect-wrapper { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered element. A read-only combobox manages its own click and selection (React state — there's no native `change`/`click` to hook from an inline handler), so `attr` is best here for a static `data-*` hook, an `id`, or ARIA. It lands on the rendered input, where scripts, tests, or DevTools can find it:

{% treeselect label='Pick a file' placeholder='Browse…' clearable=true data='[
  {"value":"src","label":"src","children":[
    {"value":"src/app.py","label":"app.py"}
  ]},
  {"value":"README.md","label":"README.md"}
]' attr={'data-testid': 'file-treeselect'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% treeselect label='Pick a file' placeholder='Browse…' clearable=true data='[
  {"value":"src","label":"src","children":[
    {"value":"src/app.py","label":"app.py"}
  ]},
  {"value":"README.md","label":"README.md"}
]' attr={'data-testid': 'file-treeselect'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'treeselect',
          label='Pick a file', placeholder='Browse…', clearable=True,
          data='''[
  {"value":"src","label":"src","children":[
    {"value":"src/app.py","label":"app.py"}
  ]},
  {"value":"README.md","label":"README.md"}
]''',
          attr={'data-testid': 'file-treeselect'})
```
{% endAccordionSection %}
{% endAccordion %}

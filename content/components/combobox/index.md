---
menu: components
title: Combobox
icon: select
weight: 40
description: "Built-in Combobox tags — Select, Autocomplete, MultiSelect, TagsInput, Pill, PillsInput, TreeSelect, and the low-level Combobox primitive, each a single Markdown tag."
---

# Combobox

The **Combobox** family is Mantine's set of dropdown / select / autocomplete inputs.
Aardvark wraps each one as a first-class `{% raw %}{% tag %}{% endraw %}` so you can drop
a searchable select or a tags field into a page with no JavaScript. They hydrate into
fully interactive islands in the browser.

- [Select](/components/combobox/select/) — a searchable single-select dropdown.
- [Autocomplete](/components/combobox/autocomplete/) — a free-text input with a suggestion list.
- [MultiSelect](/components/combobox/multiselect/) — pick several options, shown as removable pills.
- [TagsInput](/components/combobox/tagsinput/) — type free-text tags, with optional suggestions.
- [TreeSelect](/components/combobox/treeselect/) — pick a leaf from a collapsible hierarchy.
- [Pill](/components/combobox/pill/) — the small rounded chip the multi-value inputs render.
- [PillsInput](/components/combobox/pillsinput/) — the input shell that holds pills plus a field.
- [Combobox](/components/combobox/combobox/) — the low-level primitive everything else is built on.

## Options data

Every select-style tag takes its options through `data`. The simplest form is a
comma-separated list of strings, and `value::label` pairs let a short stored value carry a
friendly label:

{% raw %}
```aardvark
{% select data='React, Vue, Svelte' %}
{% select data='us::United States, ca::Canada, mx::Mexico' %}
```
{% endraw %}

For grouped, disabled, or otherwise richer options, pass a full JSON array through
`dataJson` instead (it wins over `data`):

{% raw %}
```aardvark
{% select dataJson='[{"group":"Frontend","items":["React","Vue"]},{"group":"Backend","items":["Django","Rails"]}]' %}
```
{% endraw %}

`Select`, `Autocomplete`, `MultiSelect`, and `TagsInput` all share this convention;
`TreeSelect` takes a nested JSON tree instead (see its page).

## High-level vs. primitives

Most of the time you want the ready-made inputs — `Select`, `MultiSelect`,
`Autocomplete`, `TagsInput`, `TreeSelect`. The remaining two,
[Combobox](/components/combobox/combobox/) and
[PillsInput](/components/combobox/pillsinput/), are the **composition primitives** the
others are built from; their pages explain when (rarely) you'd reach for them directly.

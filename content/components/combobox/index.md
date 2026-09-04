---
menu: components
title: Combobox
icon: select
weight: 40
description: "Built-in Combobox tags — Select, Autocomplete, MultiSelect, TagsInput, Pill, PillsInput, TreeSelect, and the low-level Combobox primitive, each a single Markdown tag."
---

# Combobox

The **Combobox** family is the set of dropdown, select, and autocomplete inputs. Each is a
single `{% raw %}{% tag %}{% endraw %}` you write in Markdown, so a searchable select or a
tags field goes into a page with no JavaScript to write. They arrive as static markup and
become fully interactive once the page loads.

- [Select](/components/combobox/select/) — a single-select dropdown, searchable on request.
- [Autocomplete](/components/combobox/autocomplete/) — a free-text input with a suggestion list.
- [MultiSelect](/components/combobox/multiselect/) — pick several options, shown as removable pills.
- [TagsInput](/components/combobox/tagsinput/) — type free-text tags, with optional suggestions.
- [TreeSelect](/components/combobox/treeselect/) — pick a leaf from a collapsible hierarchy.
- [Pill](/components/combobox/pill/) — the small rounded chip the multi-value inputs render.
- [PillsInput](/components/combobox/pillsinput/) — the input shell that holds pills plus a field.
- [Combobox](/components/combobox/combobox/) — the low-level primitive everything else is built on.

## Options data

Every select-style tag takes its options through `data`, and the simplest form is a
comma-separated list of strings. [Select](/components/combobox/select/) and
[MultiSelect](/components/combobox/multiselect/) additionally read `value::label` pairs (a
double colon), so a short stored value can carry a friendly label:

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

[Autocomplete](/components/combobox/autocomplete/) and
[TagsInput](/components/combobox/tagsinput/) share the comma-separated `data` and the
`dataJson` escape hatch, but not the `value::label` form: their entries are free text, so
each item is taken as a plain string and a `::` inside one stays part of the string.
[TreeSelect](/components/combobox/treeselect/) takes a nested JSON tree instead (see its
page).

## High-level vs. primitives

Most of the time you want the ready-made inputs — `Select`, `MultiSelect`,
`Autocomplete`, `TagsInput`, `TreeSelect`. The remaining two,
[Combobox](/components/combobox/combobox/) and
[PillsInput](/components/combobox/pillsinput/), are the **composition primitives** the
others are built from; their pages explain when (rarely) you'd reach for them directly.

---
title: "Accordion"
description: "The built-in accordion tag — collapsible sections whose bodies are full Markdown. Usage, options, and a live example with source."
---

# Accordion

A **built-in** tag built from several Mantine pieces (`Accordion`,
`Accordion.Item`, `Accordion.Control`, `Accordion.Panel`) behind one tag pair.
Each section's body is ordinary **Markdown** — headings, lists, code, links, even
nested `component(...)` calls — and renders as such.

## Usage

Wrap the whole thing in `{% raw %}{% accordion %} … {% endAccordion %}{% endraw %}`,
and give each panel its own `{% raw %}{% accordionSection title="…" %} …
{% endAccordionSection %}{% endraw %}`:

{% raw %}
```aardvark
{% accordion %}
{% accordionSection title="Section One" %}
**Markdown content**

_This builds great!_
{% endAccordionSection %}
{% accordionSection title="Section Two" %}
**More Markdown content**

- This bulleted list actually renders!
- See?
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}

renders, live:

{% accordion %}
{% accordionSection title="Section One" %}
**Markdown content**

_This builds great!_
{% endAccordionSection %}
{% accordionSection title="Section Two" %}
**More Markdown content**

- This bulleted list actually renders!
- See?
{% endAccordionSection %}
{% endAccordion %}

The `title` is the clickable control; everything between the section tags is its
panel body.

## Options

Attributes on the open tag pass straight through as Mantine props. A bare
attribute (no `=`) is a boolean flag — `multiple` means `multiple={true}`.

### `{% raw %}{% accordion %}{% endraw %}`

| Attribute | Effect |
| --- | --- |
| `multiple` | Allow several panels open at once. |
| `defaultValue="…"` | Panel(s) open on load. With `multiple`, a comma-separated list. |

### `{% raw %}{% accordionSection %}{% endraw %}`

| Attribute | Effect |
| --- | --- |
| `title="…"` | The control label. |
| `value="…"` | Stable id for the panel (defaults to a slug of the title). |

## Multiple open panels

By default one panel is open at a time — opening another closes it. Add
`multiple` to let several stay open. In `multiple` mode, `defaultValue` takes a
comma-separated list of section `value`s to open on load:

{% raw %}
```aardvark
{% accordion multiple defaultValue="install" %}
{% accordionSection title="Install" value="install" %}
Run `npm install`.
{% endAccordionSection %}
{% accordionSection title="Build" %}
Run `vark build`.
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}

{% accordion multiple defaultValue="install" %}
{% accordionSection title="Install" value="install" %}
Run `npm install`.
{% endAccordionSection %}
{% accordionSection title="Build" %}
Run `vark build`.
{% endAccordionSection %}
{% endAccordion %}

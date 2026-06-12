---
description: Wrap Markdown in a custom tag pair to build compound Mantine components
  whose panel bodies render as full Markdown.
icon: fa-solid fa-cubes
menu: docs
title: Block components
weight: 22
---

# Block components

`component('Name', …)` drops a single component inline, and its `children` is a
plain string — Markdown inside it is **not** rendered. **Block components** solve
the other case: a compound built from several Mantine components, given its own
tag pair, wrapping a region of **Markdown that renders normally**.

The first one is the **accordion**:

{% raw %}
```aardvark
{% accordion %}
{% accordionSection title="Section One" %}
## Markdown content

**This builds great!**
{% endAccordionSection %}
{% endAccordion %}
```
{% endraw %}

renders, live:

{% accordion %}
{% accordionSection title="Section One" %}
## Markdown content

**This builds great!**
{% endAccordionSection %}
{% accordionSection title="Section Two" %}
## More Markdown content

- This bulleted list actually renders!
- See?
{% endAccordionSection %}
{% endAccordion %}

Each section's `title` is the clickable control, and everything between the tags
is its body — full Markdown (headings, lists, code, links), plus any
`component(...)` call or even a nested block.

## How it works

At build time the `{% raw %}{% %}{% endraw %}` engine expands the block into nested
Mantine islands (`Accordion` › `Accordion.Item` › `Accordion.Control` +
`Accordion.Panel`) and lets the page's single Markdown pass render each panel
body. In the browser the island mounts like any other component.

## Built-in block components

Each has its own reference page under **Built-in Components**:

- [Accordion](/components/accordion/) — collapsible sections with Markdown bodies.
- [Card](/components/card/) — content cards with icons, cover/background images, gradient/glass/stat variants, and whole-card links, arranged in a responsive grid (`{% raw %}{% card %}{% endraw %}` / `{% raw %}{% cardGrid %}{% endraw %}`).
- [Carousel](/components/carousel/) — flip through captioned images, each clickable into a navigable lightbox.
- [Include](/components/include/) — splice a shared Markdown partial into a page, varied by the page's front matter.
- [Map](/components/map/) — an embedded OpenFreeMap / MapLibre map with a pin per location, placed by address (geocoded at build time) or by coordinates.
- [Tree](/components/tree/) — a nested file/folder explorer (`{% raw %}{% tree %}{% endraw %}` / `{% raw %}{% folder %}{% endraw %}` / `{% raw %}{% file %}{% endraw %}`); click a file to open its source in a modal.

Defining a new one (Tabs, Steps, …) is a small addition to the build tool — see
`AGENTS.md`.

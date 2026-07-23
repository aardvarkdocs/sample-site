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

- [Accordion](/components/data-display/accordion/) — collapsible sections with Markdown bodies.
- [Article card](/components/data-display/articlecard/) — blog-style article cards with a byline, avatar (or initials fallback), date, badge, and cover image, in five layout variants (`{% raw %}{% articleCard %}{% endraw %}`).
- [API fields](/components/extras/api-fields/) — hand-authored parameter and response-field rows for an API reference that isn't driven by an OpenAPI spec: a field's name, type, required/deprecated badges, an optional default and request-location, beside a Markdown description (`{% raw %}{% field %}{% endraw %}`).
- [Card](/components/data-display/card/) — content cards with icons, cover/background images, gradient/glass/stat variants, and whole-card links, arranged in a responsive grid (`{% raw %}{% card %}{% endraw %}` / `{% raw %}{% cardGrid %}{% endraw %}`).
- [Code groups](/components/extras/codegroup/) — several fenced code blocks shown as language/file tabs, each with its own copy button (`{% raw %}{% codeGroup %}{% endraw %}`).
- [Examples](/components/extras/examples/) — side-by-side request/response panels for API docs: titled, syntax-highlighted code with per-block copy/download and a tab strip (`{% raw %}{% requestExample %}{% endraw %}` / `{% raw %}{% responseExample %}{% endraw %}`).
- [Include](/components/extras/include/) — splice a shared Markdown partial into a page, varied by the page's front matter.
- [Map](/components/extras/map/) — an embedded OpenFreeMap / MapLibre map with a pin per location, placed by address (geocoded at build time) or by coordinates.
- [Panel](/components/extras/panel/) — a supplementary side panel that floats beside the content on a wide viewport and stacks below it on a narrow one (`{% raw %}{% panel %}{% endraw %}`).
- [Prompt](/components/extras/prompt/) — a copyable AI-prompt block with verbatim prompt text plus copy and “Open in ChatGPT / Claude / Cursor” actions (`{% raw %}{% prompt %}{% endraw %}`).
- [Tabs](/components/navigation/tabs/) — tabbed panels with full Markdown bodies (`{% raw %}{% tabs %}{% endraw %}` / `{% raw %}{% tab %}{% endraw %}`).
- [Tree](/components/navigation/tree/) — a nested file/folder explorer (`{% raw %}{% tree %}{% endraw %}` / `{% raw %}{% folder %}{% endraw %}` / `{% raw %}{% file %}{% endraw %}`); click a file to open its source in a modal.
- [Update](/components/extras/update/) — an inline release-note entry on a timeline rail: a version/date label beside its Markdown body (`{% raw %}{% update %}{% endraw %}`).
- [Visibility](/components/extras/visibility/) — show or hide a block depending on whether a human is reading the HTML page or an AI agent is reading its Markdown twin (`{% raw %}{% visibility %}{% endraw %}`).

Defining a new block component is a small addition to the build tool — see
`AGENTS.md`.

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

The body of a block is rendered **through the same engine and the same page
namespace** before the block sees it, so a variable you set earlier on the page is
visible inside, `component(...)` calls and `{% raw %}{% %}{% endraw %}` expressions
work, and blocks nest — a `{% raw %}{% tabs %}{% endraw %}` inside an accordion
section is fine. Same-named blocks pair up by depth, so an accordion inside an
accordion closes correctly.

Five blocks are the exception, because their bodies are **source, not Markdown**:
`{% raw %}{% file %}{% endraw %}`, `{% raw %}{% map %}{% endraw %}`,
`{% raw %}{% requestExample %}{% endraw %}`, `{% raw %}{% responseExample %}{% endraw %}`
and `{% raw %}{% codeGroup %}{% endraw %}` take their body **verbatim** — code, code
fences, or `pin` lines, left exactly as typed. Their attributes are parsed normally, but
nothing inside the body runs: a `component(...)` call or a `{% raw %}{% %}{% endraw %}`
expression written there is emitted as literal text rather than evaluated. Build the
value outside the block and pass it as an attribute instead.

## Attributes

An open tag takes attributes in the same shape as every other tag:

- `key="quoted"` or `key='quoted'` stays a string. A double-quoted value understands
  `\"` and `\\`; a single-quoted one is taken literally.
- A bare `key` is `true`; an unquoted `key=3`, `key=0.5`, `key=true` / `key=false` or
  `key=null` is read as that number, boolean, or `None`.
- `attr={...}` is special: a Python dict of raw HTML attributes forwarded to the block's
  outer element, exactly like [`attr` on a component](/authoring/components-and-snippets/#attaching-html-attributes-attr).

Every block can also be called from Python — `component('aardvark', 'accordion',
children=…)` renders exactly what the tag does — so you can build one inside a
`for` loop; see [Templating & data](/authoring/templating/#whats-in-scope).

## Built-in block components

These are the tag pairs Aardvark ships. Each has its own reference page under
**Built-in Components**:

- [Accordion](/components/data-display/accordion/) — collapsible sections with Markdown bodies (`{% raw %}{% accordion %}{% endraw %}` / `{% raw %}{% accordionSection %}{% endraw %}`).
- [Article card](/components/data-display/articlecard/) — blog-style article cards with a byline, avatar (or initials fallback), date, badge, and cover image, in five layout variants (`{% raw %}{% articleCard %}{% endraw %}`).
- [Card](/components/data-display/card/) — content cards with icons, cover/background images, gradient/glass/stat variants, and whole-card links, arranged in a responsive grid (`{% raw %}{% cardGrid %}{% endraw %}` / `{% raw %}{% card %}{% endraw %}`).
- [Code groups](/components/extras/codegroup/) — several fenced code blocks shown as language/file tabs, each with its own copy button (`{% raw %}{% codeGroup %}{% endraw %}`).
- [Examples](/components/extras/examples/) — side-by-side request/response panels for API docs: titled, syntax-highlighted code with per-block copy/download and a tab strip (`{% raw %}{% requestExample %}{% endraw %}` / `{% raw %}{% responseExample %}{% endraw %}`).
- [Gitfolder](/components/extras/gitfolder/) — an embedded file browser for a folder of a public GitHub or GitLab repo, fetched once at build time and cached (`{% raw %}{% gitfolder %}{% endraw %}`).
- [Map](/components/extras/map/) — an embedded OpenFreeMap / MapLibre map with a pin per location, placed by address (geocoded at build time) or by coordinates (`{% raw %}{% map %}{% endraw %}`; its `pin` lines live inside the block).
- [Panel](/components/extras/panel/) — a supplementary side panel that floats beside the content on a wide viewport and stacks below it on a narrow one (`{% raw %}{% panel %}{% endraw %}`).
- [Tabs](/components/navigation/tabs/) — tabbed panels with full Markdown bodies (`{% raw %}{% tabs %}{% endraw %}` / `{% raw %}{% tab %}{% endraw %}`).
- [Target](/components/extras/target/) — names a region of a page so Content Reach reports on it as its own section; it renders no chrome of its own (`{% raw %}{% target %}{% endraw %}`).
- [Tree](/components/navigation/tree/) — a nested file/folder explorer (`{% raw %}{% tree %}{% endraw %}` / `{% raw %}{% folder %}{% endraw %}` / `{% raw %}{% file %}{% endraw %}`); click a file to open its source in a modal.
- [Update](/components/extras/update/) — an inline release-note entry on a timeline rail: a version/date label beside its Markdown body (`{% raw %}{% update %}{% endraw %}`).
- [Visibility](/components/extras/visibility/) — show or hide a block depending on whether a human is reading the HTML page or an AI agent is reading its Markdown twin (`{% raw %}{% visibility %}{% endraw %}`).

Not every paired tag is a block component. [Callout](/components/feedback/callout/),
[API fields](/components/extras/api-fields/) (`{% raw %}{% field %}{% endraw %}`),
[Prompt](/components/extras/prompt/), [Button](/components/buttons/button/) and the rest
of the tag library are built-in macro components — `.md` definitions Aardvark ships that
take a body as `children`, built the same way as the
[custom components](/authoring/custom-components/) you write yourself — and
[Include](/components/extras/include/) is a directive of the template engine. From the
page they read the same; the difference is what you can build yourself. A block component
is registered inside Aardvark, so a project can't add one — but a `components/*.md`
definition that pads its `children` with blank lines gets the same "Markdown body"
behavior for your own compounds; see
[Custom components](/authoring/custom-components/#use-it-inline-or-block).

## Good to know

- **A block must be closed.** A built-in block tag with no matching close fails the build
  (`Unclosed {% raw %}{% accordion %}{% endraw %}`) — unlike a custom component, which may be
  self-closing. A stray close tag with no open is dropped silently.
- **Open-tag names are reserved.** `accordion`, `tabs`, `card`, `map`, … are always the
  block: you can't name a custom component after one, and a Python expression in a
  `{% raw %}{% %}{% endraw %}` block can't start with one of those words.
- **`{% raw %}{% raw %}{% endraw %}` is respected when pairing tags.** A close tag shown
  inside a raw region — the way this page shows `{% raw %}{% endAccordion %}{% endraw %}` in
  its code sample — doesn't terminate the surrounding block.

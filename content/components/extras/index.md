---
menu: components
title: Aardvark Extras
icon: sparkles
weight: 5
---

# Aardvark Extras

Most built-in tags wrap a Mantine component one-to-one. The tags on this page are
different: they are **aardvark-native** components with no direct Mantine
equivalent — purpose-built widgets for documentation sites, each a single tag you
drop straight into Markdown.

- [API Fields](/components/extras/api-fields/) — hand-authored API parameter and response-field rows (`{% raw %}{% field %}{% endraw %}`) for references not driven by an OpenAPI spec.
- [Banner](/components/extras/banner/) — a full-width announcement row across the top of the page, in your site's primary color.
- [Changelog](/components/extras/changelog/) — a timeline of changes read from a YAML data file, filterable by tag, with an RSS feed.
- [CodeGroup](/components/extras/codegroup/) — several fenced code blocks shown as language / file tabs, each with its own copy button; the chosen language syncs across every code group on the page.
- [Component libraries](/components/extras/component-libraries/) — pull extra React libraries into your theme and address them with `{% raw %}{% component('library', 'Name') %}{% endraw %}`.
- [Examples](/components/extras/examples/) — side-by-side request/response panels for API docs: titled, syntax-highlighted code blocks with per-block copy/download, and a tab strip for multiple languages or status codes.
- [Gitfolder](/components/extras/gitfolder/) — embed a public GitHub repo folder: file tree, highlighted source, inline images, a Markdown/SVG preview toggle, and a Download .zip button.
- [Include](/components/extras/include/) — splice a shared Markdown partial into a page, varied by the including page's front matter.
- [Map](/components/extras/map/) — an embedded OpenFreeMap / MapLibre map with one pin per location, placed by address or coordinates.
- [OpenAPI](/components/extras/openapi/) — splice a single endpoint from an OpenAPI spec inline next to your prose, or render a whole spec as a full reference.
- [Panel](/components/extras/panel/) — a supplementary side panel that floats beside the main content on a wide viewport and stacks below it on a narrow one.
- [Prompt](/components/extras/prompt/) — a copyable AI-prompt block: the prompt text with a copy button plus "Open in ChatGPT / Claude / Cursor" deep-link buttons that pre-fill the prompt.
- [Taxonomy](/components/extras/taxonomy/) — render tagged member pages as a changelog timeline, a knowledge base, or a blog-style article list, with tag filtering and an RSS feed for changelog and article listings.
- [Update](/components/extras/update/) — an inline release-note / changelog entry on a timeline rail: a version or date label on the left, the Markdown body beside it.
- [Visibility](/components/extras/visibility/) — show or hide a block of Markdown depending on whether a human is reading the HTML page or an AI agent is reading its Markdown twin.

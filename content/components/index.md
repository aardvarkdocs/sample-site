---
menu: components
title: Built-in Components
---

# Built-in Components

Aardvark ships a full component library you can use straight from Markdown — no setup, no JavaScript to write. [Raw Components](/components/raw/) covers all of Mantine; on top of that, a few **native tags** wrap common patterns into a single tag:

- [Badge](/components/badge/) — labels, statuses, versions, and counts.
- [Banner](/components/banner/) — a full-width announcement row in your site's primary color.
- [Icon](/components/icon/) — a Font Awesome glyph or SVG file inline in text or a heading, sized to match.
- [Image](/components/image/) — Mantine images with no-upscale sizing and a click-to-zoom lightbox.
- [Carousel](/components/carousel/) — flip through captioned images, each clickable into a navigable lightbox.
- [Card](/components/card/) — flashy content cards with icons, images, gradient/glass/stat variants, links, and a responsive grid.
- [Callout](/components/callout/) — titled admonitions in four severities.
- [Aside](/components/aside/) — a static callout with a custom accent color.
- [Divider](/components/divider/) — a labelled or plain horizontal/vertical rule.
- [Accordion](/components/accordion/) — collapsible sections whose bodies are Markdown.
- [Tree](/components/tree/) — a nested file/folder explorer; click a file to open its source in a modal.
- [Gitfolder](/components/gitfolder/) — embed a public GitHub repo folder: file tree, highlighted source, inline images, a Markdown/SVG preview toggle, and a Download .zip button.
- [Include](/components/include/) — splice a shared Markdown partial into a page.
- [Changelog](/components/changelog/) — a timeline of changes from a YAML data file, filterable by tag.

The header's top-bar buttons use the same idea via the `{% raw %}{% button %}{% endraw %}` tag.

## Build your own

When the built-ins don't cover it, define your **own** component in your project — that's a [custom component](/authoring/custom-components/), and it's where the real flexibility is. Drop a React component in `snippets/` and call it from Markdown exactly like a built-in:

{% component('ProductCard', product='aardvark', tagline='Markdown in, static site out.', badge='v1.0', href='/getting-started/quickstart/') %}

`snippets/ProductCard.jsx` freely blends **plain HTML** (`<div>`, `<h3>`, `<p>`) with Mantine components (`Card`, `Group`, `Badge`, `Button`) — inside a snippet it's just React, so any blend of HTML and Mantine you choose works. See [Components & snippets](/authoring/components-and-snippets/) for the full authoring guide.

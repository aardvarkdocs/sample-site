---
aliases:
  - /resources/
description: aardvark is a Mantine-powered static site generator — author in Markdown,
  build to fast static HTML with interactive React islands.
heading: Getting Started
heading-icon: fa-solid fa-flag
icon: fa-solid fa-house
menu: docs
title: Introduction
weight: 10
---

# aardvark

**aardvark** is a documentation-focused static site generator. You author in
Markdown and build to static HTML. Interactive UI is delivered as **islands**:
aardvark emits the HTML, and Mantine + your own React components render in the
browser from a single bundled runtime.

This very site is built with aardvark.

{% card variant="gradient" gradient="indigo,grape,135" icon="rocket" title="Build your first site in a minute" cta="Start the quickstart" href="/getting-started/quickstart/" %}
Markdown in, fast static HTML out — with interactive Mantine islands. No build config to write.
{% endCard %}

## Why aardvark

- **Markdown in, HTML out** — pretty URLs, a TOC, and a clean default theme.
- **Real Python templating** — logic lives in `{% raw %}{% %}{% endraw %}` tags and is actual
  Python, with your structured data exposed as `data.<file>.<prop>`.
- **Every Mantine component** — embed any of the Mantine UI components (and
  your own React snippets) directly from Markdown; they render as islands.
- **Batteries included** — built-in ⌘K search, a kapa.ai assistant, Google
  Analytics with page-rating events, OpenAPI "try it now" reference pages, and
  auto-generated `sitemap.xml` + `llms.txt`.
- **Optional build-time AI** — when enabled, generate frontmatter, example API
  responses, and a skill-creation plan from your docs.
- **Ships as one binary** — compile the tool to a single executable with
  Nuitka. Node is only needed at build time to bundle the islands.

## How it fits together

1. You write Markdown in `content/`, structured data in `data/`, and optionally
   custom React components in `snippets/`.
2. `vark build` runs the `{% raw %}{% %}{% endraw %}` Python templating, renders Markdown to HTML,
   collects every `{% raw %}{% component(...) %}{% endraw %}` call into island mount points, and
   bundles the referenced Mantine/snippet components with esbuild.
3. The output in `build/` is plain static HTML + one JS/CSS bundle, ready to
   host anywhere.

## Next steps

{% cardGrid cols=3 %}
{% card title="Installation" icon="download" accent="grape" href="/getting-started/installation/" cta="Get the tool" %}
Install the CLI and you're ready to build.
{% endCard %}
{% card title="Quickstart" icon="rocket" accent="grape" href="/getting-started/quickstart/" cta="Build a site" %}
Go from zero to a built site in a minute.
{% endCard %}
{% card title="Component gallery" icon="components" accent="grape" href="/components/raw/" cta="Browse" %}
Live examples of every Mantine component, callable straight from Markdown.
{% endCard %}
{% endCardGrid %}

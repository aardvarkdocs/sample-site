---
aliases:
  - /resources/
  - from: /getting-started/quickstart/
    to: "#quickstart"
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

{% card variant="gradient" gradient="indigo,grape,135" icon="rocket" title="Build your first site in a minute" cta="Start the quickstart" href="/docs/#quickstart" %}
Markdown in, fast static HTML out — with interactive Mantine islands. No build config to write.
{% endCard %}

## Why aardvark

- **Markdown in, HTML out** — pretty URLs, a TOC, and a clean default theme.
- **Real Python templating** — logic lives in `{% raw %}{% %}{% endraw %}` tags and is actual
  Python, with your structured data exposed as `data.<file>.<prop>`.
- **Every Mantine component** — embed any of the Mantine UI components (and
  your own React snippets) directly from Markdown; they render as islands.
- **Batteries included** — built-in ⌘K search, a built-in "Ask AI" assistant,
  Google Analytics with page-rating events, OpenAPI "try it now" reference pages,
  and auto-generated `sitemap.xml` + `llms.txt`.
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

## Explore the docs

{% cardGrid cols=3 %}
{% card title="Installation" icon="download" accent="grape" href="/getting-started/installation/" cta="Get the tool" %}
Install the CLI and you're ready to build.
{% endCard %}
{% card title="Quickstart" icon="rocket" accent="grape" href="/docs/#quickstart" cta="Build a site" %}
Scaffold and build your first site in a minute.
{% endCard %}
{% card title="Component gallery" icon="components" accent="grape" href="/components/" cta="Browse" %}
Live examples of every Mantine component, callable straight from Markdown.
{% endCard %}
{% endCardGrid %}

## Quickstart {#quickstart}

Once you've [installed aardvark](/getting-started/installation/), you can scaffold,
preview, and build your first site in a few commands.

### 1. Scaffold a site

```bash
vark new my-docs
cd my-docs
```

This creates a project with a starter page, a data file, the editable default
theme, an example snippet, and a `package.json` for the islands.

### 2. Install the islands dependencies

```bash
npm install
```

This installs React, Mantine, and esbuild, which aardvark uses to bundle the
components you embed.

### 3. Develop with live reload

```bash
vark dev --port 8000
```

`vark dev` builds the site, serves it on `http://127.0.0.1:8000`, opens that URL
in your browser, watches your source files, and reloads the browser on every
change. Pass `--no-open` if you'd rather open the tab yourself.

### 4. Build for production

```bash
vark build      # outputs static HTML to ./build
```

### Create your first page

An aardvark page is Markdown with optional YAML frontmatter. Logic is real
Python inside `{% raw %}{% %}{% endraw %}` tags:

{% raw %}
```aardvark
---
title: Hello
---

# Hello

This site has {% len(components) %} Mantine components available.

{% component('Button', children='Click me', color='blue') %}
```
{% endraw %}

That's it. Continue with [Project structure](/getting-started/project-structure/)
or jump to [Templating & data](/authoring/templating/).

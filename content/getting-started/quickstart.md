---
description: Scaffold, build, and preview a new aardvark site in under a minute.
icon: fa-solid fa-bolt
menu: docs
title: Quickstart
weight: 12
---

# Quickstart

## 1. Scaffold a site

```bash
uv run vark new my-docs
cd my-docs
```

This creates a project with a starter page, a data file, the editable default
theme, an example snippet, and a `package.json` for the islands.

## 2. Install islands dependencies

```bash
npm install
```

This installs React, Mantine, and esbuild — used to bundle the components you
embed.

## 3. Develop with live reload

```bash
uv run vark dev --port 8000
```

`vark dev` builds the site, serves it on `http://127.0.0.1:8000`, opens that URL
in your browser, watches your source files, and reloads the browser on every
change. Pass `--no-open` if you'd rather open the tab yourself.

## 4. Build for production

```bash
uv run vark build      # outputs static HTML to ./build
```

## Your first page

A page is Markdown with optional YAML frontmatter. Logic is real Python inside
`{% raw %}{% %}{% endraw %}` tags:

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

That's it. Continue with [Project structure](/getting-started/project-structure/) or jump to
[Templating & data](/authoring/templating/).

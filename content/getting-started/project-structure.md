---
description: The directories and files that make up an aardvark project, and what each
  one does.
icon: /icons/folder.svg
menu: docs
title: Project structure
weight: 13
---

# Project structure

A scaffolded aardvark project looks like this:

```bash
my-docs/
  aardvark.config.yaml      # site metadata, tabs, integrations, AI flags
  content/             # *.md pages  ->  pretty URLs
  data/                # *.json *.yaml *.csv  ->  data.<file>.<prop>
  templates/           # the docs theme (full, editable HTML source)
  snippets/            # your custom *.jsx / *.tsx React components
  openapi/             # OpenAPI specs (optional)
  *.css *.js           # dropped in the project root -> copied into the build
  static/  public/     # copied verbatim into the build (optional)
  package.json         # islands deps (react, @mantine/*, esbuild)
  build/               # generated output
```

## What each directory does

- **`content/`** — One `.md` file per page. `content/index.md` → `/`,
  `content/guide/intro.md` → `/guide/intro/`. See [Templating & data](/authoring/templating/).
- **`data/`** — JSON, YAML, and CSV files. Each file becomes
  `data.<filename>` in your pages; a CSV becomes a list of row objects.
- **`templates/`** — The theme. `base.html` is the page layout, rendered by the
  same `{% raw %}{% %}{% endraw %}` engine. Edit it freely. See [Theme & customization](/theming/).
- **`snippets/`** — Your own React components, usable from Markdown by filename.
  See [Components & snippets](/authoring/components-and-snippets/).
- **`openapi/`** — Specs referenced from `aardvark.config.yaml` to generate API
  reference pages. See [OpenAPI pages](/openapi/).
- **Root `*.css` / `*.js`** and **`static/` / `public/`** — copied into the
  build. See [Custom CSS & JS](/authoring/assets/).

## Output

`vark build` writes everything to `build/`: one HTML file per page (as
`<url>/index.html`), the bundled islands JS/CSS under `_aardvark/`, your static
assets, plus [generated files](/llms-and-sitemap/) (`sitemap.xml`, `llms.txt`,
`llms-full.txt`).

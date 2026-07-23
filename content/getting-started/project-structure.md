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
  themes/vark/         # the docs theme (full, editable HTML source you own)
  templates/           # optional: override a single theme file (else omit)
  snippets/            # your custom *.jsx / *.tsx React components
  openapi/             # OpenAPI specs (optional)
  *.css *.js           # project-root assets -> copied, fingerprinted, linked
  static/  public/     # public assets -> copied and fingerprinted (optional)
  package.json         # islands deps (react, @mantine/*, esbuild)
  build/               # generated output
```

## What each directory does

- **`content/`** — One `.md` file per page. `content/index.md` → `/`,
  `content/guide/intro.md` → `/guide/intro/`. See [Templating & data](/authoring/templating/).
- **`data/`** — JSON, YAML, and CSV files. Each file becomes
  `data.<filename>` in your pages; a CSV becomes a list of row objects.
- **`themes/vark/`** — Your editable copy of the active theme. `default.html` is the
  page layout, rendered by the same `{% raw %}{% %}{% endraw %}` engine; a project-local
  `themes/<name>/` wins over the bundled theme. Add more layouts (e.g. `landing.html`) and
  select them per page with `pagetype:`. See [Theme & customization](/theming/).
- **`templates/`** — Optional. Drop one file here to override just that file of the
  active theme (a lightweight alternative to forking the whole `themes/vark/`).
- **`snippets/`** — Your own React components, usable from Markdown by filename.
  See [Components & snippets](/authoring/components-and-snippets/).
- **`openapi/`** — OpenAPI specs you render inline with the
  `{% raw %}{% openapi %}{% endraw %}` directive — a whole spec, or a single-endpoint
  slice — on an ordinary Markdown page. See [OpenAPI](/components/extras/openapi/).
- **Root `*.css` / `*.js`** and **`static/` / `public/`** — copied into the
  build with per-build filenames such as `/img/logo-<sha>.svg`; keep authoring
  links as `/img/logo.svg`. See [Custom CSS & JS](/authoring/assets/).

## Output

`vark build` writes everything to `build/`: one HTML file per page (as
`<url>/index.html`), the bundled islands JS/CSS under `_aardvark/`, your
fingerprinted static assets, plus [generated files](/llms-and-sitemap/)
(`sitemap.xml`, `llms.txt`, `llms-full.txt`).

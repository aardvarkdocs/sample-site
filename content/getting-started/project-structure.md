---
description: The directories and files that make up an Aardvark project, and what each
  one does.
icon: /icons/folder.svg
menu: docs
title: Project structure
weight: 13
---

# Project structure

`vark new my-docs` creates this:

```bash
my-docs/
  aardvark.config.yaml   # site metadata, tabs, theme, integrations, AI flags
  content/               # *.md pages  ->  pretty URLs
  data/                  # *.json *.yaml *.csv  ->  data.<file>.<prop>
  themes/vark/           # the docs theme (full, editable HTML + SCSS source you own)
  snippets/              # your custom *.jsx / *.tsx React components
  custom.css             # any project-root *.css / *.js -> copied, fingerprinted, linked
  package.json           # islands deps (react, @mantine/*, esbuild)
  .gitignore             # build/, node_modules/, .aardvark-cache/, .env
```

Add these as you need them — none is required:

```bash
  templates/             # override a single file of the active theme
  generators/            # build-time Python that emits pages and downloadable files
  static/  public/       # public assets -> copied and fingerprinted
  openapi/               # OpenAPI specs (any path works; this is the convention)
  versions/              # frozen doc snapshots cut by `vark version cut`
  .env                   # secrets such as AARDVARK_SECRET_KEY, auto-loaded by build/dev
```

And these are produced by builds — keep them out of version control (the
scaffolded `.gitignore` already does):

```bash
  build/                 # the generated site
  .aardvark-cache/       # the staged islands toolchain plus build caches
  node_modules/          # only if you run npm install yourself
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
- **`generators/`** — Optional. Python scripts that run at the start of every build
  and write pages or any other file (CSV, JSON, binaries) into the site. See
  [Build-time Python](/generators/).
- **`versions/`** — Optional. Frozen snapshots of your versioned subtrees, created
  by `vark version cut`; the latest docs stay in `content/`. See
  [Versioning](/versioning/).
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
`<url>/index.html`) with a Markdown twin beside it, the bundled islands JS/CSS
under `_aardvark/`, your fingerprinted static assets, plus [generated files](/llms-and-sitemap/)
(`sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, the search index, and
`_headers` / `_redirects` for hosts that read them). Every build replaces the
directory wholesale, so never keep anything of your own in it.

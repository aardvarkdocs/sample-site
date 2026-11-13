---
description: The directories and files that make up an aardvark project, and what each
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
  themes/vark/           # the docs theme's layout and styles (editable HTML + SCSS you own)
  snippets/              # your custom *.jsx / *.tsx React components
  custom.css             # any project-root *.css / *.js -> copied, fingerprinted, linked
  package.json           # islands deps (react, @mantine/*, esbuild)
  .gitignore             # build/, node_modules/, .aardvark-cache/, .env
```

Add these as you need them — none is required:

```bash
  templates/             # override a single file of the active theme
  components/            # your own {% raw %}{% MyTag %}{% endraw %} components, authored in Markdown
  generators/            # build-time Python that emits pages and downloadable files
  static/                # public assets -> copied and fingerprinted
  public/                # public assets -> copied and fingerprinted
  openapi/               # OpenAPI specs (any path works; this is the convention)
  versions/              # frozen doc snapshots cut by `vark version cut`
  i18n/                  # ui-strings.yaml: translated theme chrome and nav labels
  skills/                # agent skills, one skills/<name>/SKILL.md each
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
  `content/guide/intro.md` → `/guide/intro/`. A file whose name starts with a dot is never a
  page, which keeps an editor's lock files out of the site; a dot folder such as `.well-known/`
  publishes like any other. A page that is a link to a file that doesn't exist stops the build
  and names the link. See [Templating & data](/authoring/templating/).
- **`data/`** — JSON, YAML, and CSV files. Each file becomes
  `data.<filename>` in your pages; a CSV becomes a list of row objects.
- **`themes/vark/`** — Your editable copy of the active theme's layout, styles and
  scripts. `default.html` is the page layout, rendered by the same
  `{% raw %}{% %}{% endraw %}` engine; a project-local `themes/<name>/` wins over the
  bundled theme. Add more layouts (e.g. `landing.html`) and select them per page with
  `pagetype:`. The theme's component library isn't copied: it stays packaged with aardvark,
  and a `components/` or `snippets/` file of your own replaces one of its components. See
  [Theme & customization](/theming/#the-themes-component-library).
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
- **`components/`** — Optional. One `.md` file per reusable
  `{% raw %}{% MyTag %}{% endraw %}` component: a named tag with typed params whose body
  holds your `component(...)` calls. A build-time macro, no JS. See
  [Custom components](/authoring/custom-components/).
- **`i18n/`** — Optional. `i18n/ui-strings.yaml` is the committed UI-string catalog:
  per-language translations of the theme chrome ("On this page", "Was this page
  helpful?") and of your nav and tab labels. `vark build --translate` regenerates it,
  and `languages.uiStrings` can point somewhere else.
- **`skills/`** — Optional. Agent skills, one `skills/<name>/SKILL.md` each, which the
  build publishes with an index at `/.well-known/agent-skills/index.json`. `vark ai-enrich`
  can write them from your pages. See [Build-time AI](/ai-features/).
- **`openapi/`** — OpenAPI specs you render inline with the
  `{% raw %}{% openapi %}{% endraw %}` directive — a whole spec, or a single-endpoint
  slice — on an ordinary Markdown page. See [OpenAPI](/components/extras/openapi/).
- **Root `*.css` / `*.js`** and **`static/` / `public/`** — copied into the
  build with per-build filenames such as `/img/logo-<sha>.svg`; keep authoring
  links as `/img/logo.svg`. See [Custom CSS & JS](/authoring/assets/).

## Output

`vark build` writes everything to `build/`, or to the folder `outDir` names in
`aardvark.config.yaml`: one HTML file per page (as
`<url>/index.html`) with a Markdown twin beside it, the bundled islands JS/CSS
under `_aardvark/` with the theme's files and the third-party license notices for all of them
(`_aardvark/THIRD_PARTY_NOTICES.txt`), your fingerprinted static assets, plus
[generated files](/llms-and-sitemap/)
(`sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, the search index, and
`_headers` / `_redirects` for hosts that read them). Every build replaces the
directory wholesale, so never keep anything of your own in it.

That makes `outDir` a folder of its own, inside the project or outside it: `dist`, `out/site`
and `../site-out` all work. Before it touches anything, a build stops with an error if a file
rather than a folder is already at `outDir`, or if `outDir` is or holds the project folder, or
is, holds or sits inside a source folder. Those are the folders in the first two lists above
(`themes/` as a whole), a released version's `source:` and each language's source folder
wherever the config puts them, a theme kept outside `themes/` (except any of these that is or
holds the project folder), and `.git/`. `<outDir>.old`, where a build sets the previous output
aside and then deletes it, is held to the same rules. A page, component definition, glossary
file or config file the build reads from either, through a link or not, stops it too, before it
renders a page.

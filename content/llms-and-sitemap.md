---
description: Every build also writes sitemap.xml, llms.txt, llms-full.txt, per-page
  Markdown, and a full-text search index.
icon: fa-solid fa-file-export
menu: docs
title: Generated files
weight: 61
---

# Generated files

Every `vark build` writes these automatically:

## `sitemap.xml`

A standard sitemap of every page, using `baseUrl` from `aardvark.config.yaml`.

## `llms.txt` and `llms-full.txt`

Per the [llmstxt.org](https://llmstxt.org/) convention, to make your docs easy
for LLMs to consume:

- **`llms.txt`** — an index: your site name, summary, and a linked list of every
  page with its description. Each entry links to the page's raw `.md` (below) so
  an assistant gets clean Markdown, not rendered HTML — or to the HTML page when
  per-page Markdown is turned off.
- **`llms-full.txt`** — the full content of every page concatenated, with island
  markup stripped to clean text.

`site.summary` (or `site.description`) in your config becomes the `llms.txt`
summary; each page's `description` is used in the index list.

## `search-index.json`

A full-text index — one record per page (URL, title, breadcrumb, description,
keywords, headings, inbound link text, and body text) — that powers the
[built-in search](/search/). Always written unless you set `search: false`.

These need no configuration beyond `baseUrl` and your page frontmatter.

## Per-page Markdown and the "View in Markdown" button

Every page is also written as raw Markdown beside its HTML, so readers — and
LLMs — can grab the source. A page at `/guide/intro/` is served at
`/guide/intro.md`; the home page is `/index.md`. It's the same processed
Markdown that feeds `llms-full.txt`, with island markup stripped to clean text.

To surface it, each page shows a **View in Markdown** button at the top-right of
the content. Clicking the label opens the page's `.md`; the chevron beside it
opens the rest:

- **Copy page** — copy the Markdown to the clipboard.
- **Open in ChatGPT** / **Open in Claude** — start a chat pre-filled with a
  prompt that points the assistant at the page's `.md` URL.

The two assistant links need an absolute URL to hand off, so they appear only
when `baseUrl` is set. aardvark also writes a `_headers` rule so hosts that read
it (Cloudflare, Netlify) serve the `.md` as `text/plain` — shown inline rather
than the default `text/markdown`, which browsers download — and the generated
`.txt` files (`llms.txt`, `llms-full.txt`, `robots.txt`) as `text/plain;
charset=utf-8`, so characters like em-dashes render correctly instead of as
mojibake. Hosts that ignore `_headers` (Vercel, GitHub Pages, …) still serve the
files; add your own header rule there if you want inline display and UTF-8.

### Tuning

On by default. A bare `markdownMenu: false` turns off **both** the `.md` files
and the button; otherwise toggle individual actions or set the button label and
the assistant prompt:

```yaml
markdownMenu:
  enabled: true               # gates the .md files AND the button
  viewMarkdown: true          # the four actions (all default true)
  copyMarkdown: true
  chatgpt: true
  claude: true
  label: View in Markdown     # the primary button's label
  prompt: "Read {url} so I can ask questions about {title}."  # {url} = absolute .md URL, {title} = page title
```

`{url}` is what hands the page to the assistant, so keep it in a custom `prompt` —
it's substituted, not appended automatically.

## `_redirects` and alias stubs

Keep old URLs working after you move or rename a page. Two mechanisms feed the
build — use either or both.

### Per-page `aliases:` (front matter)

List a page's historical paths and each one forwards to the page:

```yaml
---
title: CLI reference
aliases:
  - /old-cli/          # forwards to /cli/
  - /legacy/cli.html   # an explicit file works too
---
```

For every alias, aardvark writes a tiny HTML stub at the old path with a
`rel="canonical"` to the real page, `robots: noindex`, and an instant
`<meta http-equiv="refresh">` (plus a JS redirect and a visible link). Google
treats an instant refresh as a permanent move, and the canonical consolidates the
old URL's ranking onto the new one — so search engines update themselves. Stubs
work on **every** host and in `vark dev`, and each alias also gets a true
`301` line in the `_redirects` file below.

### Site-wide `redirects:` (config)

For rules that aren't tied to one page — including `*` wildcards and `:slug` /
`:splat` placeholders — add a `redirects:` list to `aardvark.config.yaml`:

```yaml
redirects:
  - /blog/* /news/:splat 301        # a raw _redirects line, passed through as-is
  - from: /docs/:slug               # or the mapping form
    to:   /guide/:slug
    status: 301
```

Each list item is one rule on a single line (a multi-line value is truncated at the
first newline). They're written verbatim to `_redirects`. A static generator can't
expand a wildcard into files, so — unlike concrete `aliases:` — they produce **no stubs**
and only take effect on a host that reads `_redirects` (Cloudflare Pages, Netlify,
Vercel). On other hosts they're inert.

### Tuning

```yaml
aliases:
  htmlStubs: true       # write the per-alias HTML stubs (default true)
  redirectsFile: true   # also emit a _redirects file (default true)
  force: false          # append `!` to alias 301s — Netlify force flag (default false)
```

A bare `aliases: false` turns off stub generation entirely. One caveat for true
`301`s: on Cloudflare Pages and Netlify a static file *shadows* a `_redirects`
rule for the same path, so an alias's own stub wins over its `301` there. If you
deploy only to those hosts and want header-level `301`s, set `aliases: { htmlStubs:
false }` so the `_redirects` rule is unshadowed.

---
description: Every build also writes sitemap.xml, robots.txt, llms.txt, llms-full.txt,
  per-page Markdown, a full-text search index, agent-discovery files, and redirect stubs —
  and what noindex removes from each of them.
icon: fa-solid fa-file-export
menu: docs
title: Generated files
weight: 63
---

# Generated files

Every `vark build` writes these automatically. Most of them are **discovery surfaces**
— lists of what your site contains — and they all agree on what's left out:

- A page with `noindex: true` in its front matter, every page when the site sets
  `seo.noindex` (a staging build), and every [password-protected](/protected-pages/)
  page is **de-listed**: dropped from the sitemap (both as an entry and as another
  page's hreflang alternate), `llms.txt`, `llms-full.txt`, the search index,
  `metadata.json`, and hover cards. De-listed isn't unpublished — the HTML is still
  built and served, and so is its `.md` sibling (protected pages excepted).
- A page with `searchable: false` stays in the sitemap but leaves the content corpora —
  `llms.txt`, `llms-full.txt`, the search index — see [Search](/search/).
- The `404` page is never listed anywhere.

## `sitemap.xml`

A standard sitemap of every page. Each entry's `<loc>` is absolute when `baseUrl` is set
in `aardvark.config.yaml` (site-relative otherwise), carries a `<lastmod>` taken from a
`dateModified` (or `lastmod` / `updated` / `modified`) key in the page's front matter and,
failing that, from the file's last git commit — a `date:` key is the *published* date and
never becomes `<lastmod>` — and, on a multi-language site with a `baseUrl`, one `hreflang`
alternate per translation plus `x-default`, so search engines pair the language variants.

## `robots.txt`

Allows all crawlers, points them at the sitemap (the `Sitemap:` line needs an absolute
URL, so it's only written when `baseUrl` is set), and declares **Content Signals**
— a machine-readable statement of how automated systems may use your content,
per [contentsignals.org](https://contentsignals.org/) and its
[IETF draft](https://datatracker.ietf.org/doc/draft-romm-aipref-contentsignals/).
A short comment block explains the policy, and one `Content-Signal:` line carries it:

```text
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /
```

The three signals are:

- **`search`** — building a search index and showing links and short excerpts in
  results (not AI-generated summaries).
- **`ai-input`** — using the content in AI models in real time (retrieval-augmented
  generation, grounding, generative search answers).
- **`ai-train`** — training or fine-tuning AI models.

Each is `yes` or `no`. By default Aardvark grants all three. To change that, add a
top-level `robots:` block — distinct from `seo.robots`, which is the per-page
`<meta name="robots">` directive:

```yaml
robots:
  contentSignals:
    search: yes      # listed signals override; unlisted ones stay at the yes default
    ai-input: yes
    ai-train: no     # reserve training rights while still allowing search + AI answers
```

Listed signals override the default; an unlisted signal stays `yes`. Set one to `no`
to deny that use, or to `null` to drop it from the line (declaring no preference —
neither granting nor restricting it). A misspelled signal name (`ai-trian`) is
reported as a build warning rather than silently ignored — a silent drop would leave
that use granted, the opposite of what you meant.

To omit Content Signals entirely, set `robots: false` (or `robots: { contentSignals:
false }`) — only an explicit `false` (or `no`/`off`/`0`) disables. A bare or empty
`contentSignals:` is read as "not configured" and falls back to the all-yes default,
so a placeholder key never silently strips the signals. Either way the rest of the
`robots.txt` is still written.

As with every artifact here, a hand-written `static/robots.txt` (or `public/robots.txt`)
is copied verbatim and **always wins** — Aardvark won't overwrite it. If you ship one
*and* configure `robots.contentSignals`, the build warns that the config has no effect:
put the `Content-Signal:` line in your own file instead.

{% callout severity='info' title='noindex does not add a Disallow' %}
A `noindex` page (or a site-wide `seo.noindex`) is de-listed everywhere above, but
`robots.txt` deliberately keeps `Allow: /`. A crawler has to be able to fetch a page to
see its `noindex` meta tag; blocking it in `robots.txt` would leave it indexable through
external links. To hard-block crawling of a staging build, ship a `static/robots.txt`
with `Disallow: /` — accepting that `Disallow` alone doesn't guarantee de-indexing.
{% endCallout %}

## `llms.txt` and `llms-full.txt`

Per the [llmstxt.org](https://llmstxt.org/) convention, to make your docs easy
for LLMs to consume:

- **`llms.txt`** — an index: your site name, summary, and a linked list of every
  page with its description. Each entry links to the page's raw `.md` (below) so
  an assistant gets clean Markdown, not rendered HTML — or to the HTML page when
  per-page Markdown is turned off.
- **`llms-full.txt`** — the full content of every page concatenated, each under its
  title and a `Source:` line naming the page URL, with island markup stripped to clean
  text.

`site.summary` (or `site.description`) in your config becomes the `llms.txt`
summary; each page's `description` is used in the index list. Both files skip the
de-listed pages described at the top.

## `search-index.json`

A full-text index — one record per page (URL, title, breadcrumb, description,
keywords, headings, inbound link text, and body text) — that powers the
[built-in search](/search/). A gzipped `search-index.json.gz` is written beside it
(the search box loads that one; `search: {compress: false}` skips it). Written unless
you set `search: false` — except on a site with [`mcp`](/agent-readiness/) enabled,
where it's always written because the MCP server's search tool ranks over it.

These need no configuration beyond `baseUrl` and your page frontmatter.

## Web Bot Auth directory

When you enable [`webBotAuth`](/web-bot-auth/), the build also publishes a key directory
(a JWKS) at `/.well-known/http-message-signatures-directory`, so your site can identify
itself when an agent sends signed requests on its behalf. Listing a public key under
`webBotAuth.keys` turns it on; a bare `webBotAuth: true` with no keys publishes an
empty directory and the build warns about it. See [Web Bot Auth](/web-bot-auth/).

## `.well-known/agent-skills/index.json`

If your project has a `skills/` directory, every `skills/<name>/SKILL.md` is
published as an **Agent Skills Discovery** index at
`/.well-known/agent-skills/index.json`, per the
[Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc)
(v0.2.0). Agents that support the convention can then discover the skills your site
offers — the way `llms.txt` and `sitemap.xml` advertise your content.

The index lists each skill with its name, `type`, description, URL, and a SHA-256
content digest:

```json
{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": [
    {
      "name": "deploy-a-docs-site",
      "type": "skill-md",
      "description": "Build an Aardvark documentation site and deploy it to a static host.",
      "url": "/.well-known/agent-skills/deploy-a-docs-site/SKILL.md",
      "digest": "sha256:…"
    }
  ]
}
```

Each `SKILL.md` is copied verbatim to `/.well-known/agent-skills/<name>/SKILL.md`
(the `<name>` is its source directory), and its `digest` is the SHA-256 of that
file's bytes, so a client can verify what it fetched. The `description` comes from
the file's front matter, capped at the RFC's 1024 characters (a longer one is
truncated with a build warning; a missing one publishes as empty, also with a
warning). The skills come from your `skills/` directory — generated by
[`vark ai-enrich`](/ai-features/) or hand-authored; either way `vark build` just
publishes whatever is on disk, with no AI configuration required. The build also
synthesizes a "how to use this site" agent-help skill, named `<site slug>-docs`
(`aardvark-docs` on this site — the same `SKILL.md` the menu's Install Skill and
Install Plugin items download), so the index is published on every build whenever the
Markdown menu is on (the default) — even with no `skills/` directory. It is omitted
only when there are no skills at all (no `skills/` directory *and* `markdownMenu`
off). A hand-authored `skills/<name>/` with the same name as the generated skill wins,
and the build says so.

As with every artifact here, a hand-written
`static/.well-known/agent-skills/index.json` always **wins** — Aardvark then leaves
the whole `.well-known/agent-skills/` tree untouched.

## Agent discovery — `Link` headers

So an AI agent landing on your site can find the machine-readable files above,
every build sets an [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) `Link`
response header on the home page (`/`). It's written into the same `_headers` file,
so it works on hosts that read it (Cloudflare Pages, Netlify) and under
[`vark serve`](/self-hosting/), and points at each resource with a registered
relation type and a `type` hint — all on one comma-separated header:

- `</llms.txt>` and `</llms-full.txt>` — `rel="service-desc"`
- `</sitemap.xml>` — `rel="describedby"`
- `</.well-known/mcp/server-card.json>` — `rel="service-desc"`, when the [MCP server
  card](/agent-readiness/) is published (`mcp: true` plus a `baseUrl`, or a card you ship
  in `static/`)
- `</.well-known/oauth-protected-resource>` — `rel="service-desc"`, always (the
  [OAuth discovery metadata](/agent-discovery/) is written on every build)
- `</metadata.json>` — `rel="service-desc"`, when the AI assistant or MCP is on and
  [`markdownMenu`](#per-page-markdown-and-the-view-in-markdown-button) is enabled (the
  build only writes `metadata.json` when per-page Markdown is published)
- `</.well-known/api-catalog.json>` — `rel="api-catalog"`, when the site has an
  OpenAPI reference (below)
- `</.well-known/agent-skills/index.json>` — `rel="service-desc"`, whenever the
  agent-skills index is published (with the Markdown menu on, that's every build — above)

No configuration. To override it, declare a `/` block in your own
`static/_headers`. A site-wide `seo.noindex` (a staging build) suppresses it,
matching how `noindex` keeps a build out of every other discovery surface.

### `api-catalog` for OpenAPI sites

If any page embeds an [`{% raw %}{% openapi %}{% endraw %}`](/components/extras/openapi/) reference, the build also writes
an [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) catalog at
`/.well-known/api-catalog.json` — an `application/linkset+json` document listing
each API with a machine-readable `service-desc` link to the spec (republished as
JSON under `/_aardvark/openapi/`) and a `service-doc` link to its docs page. A
request to the canonical extensionless `/.well-known/api-catalog` redirects there (a
`_redirects` rule, so it works on hosts that read that file and under `vark serve`).
Nothing to configure — it appears only when you actually have a spec, and only specs on
listed pages count: a `noindex` page's reference stays out of the catalog.

## Per-page Markdown and the "View in Markdown" button

Every page is also written as raw Markdown beside its HTML, so readers — and
LLMs — can grab the source. A page at `/guide/intro/` is served at
`/guide/intro.md`; the home page is `/index.md`. It's the same processed
Markdown that feeds `llms-full.txt`, with island markup stripped to clean text.
Password-protected pages get no `.md` (their content ships encrypted), and a file you
put in `static/` at the same path wins — the page's own `.md` is skipped with a warning
naming the collision.

To surface it, each page shows a **View in Markdown** button at the top-right of
the content. Clicking the label opens the page's `.md`; the chevron beside it
opens the rest:

- **Copy page** — copy the Markdown to the clipboard.
- **Download PDF** — download the whole site as a single PDF. Shown only when
  `pdf: true` is set (see below).

The dropdown also carries the **agent hand-off** items — Copy MCP Server, Install
Skill, Install Plugin, and Install Assistant — covered on the [Agent
readiness](/agent-readiness/) page. Aardvark also writes a `_headers` rule so hosts that read
it (Cloudflare, Netlify) serve the `.md` as `text/plain` — shown inline rather
than the default `text/markdown`, which browsers download — and the generated
`.txt` files (`llms.txt`, `llms-full.txt`, `robots.txt`) as `text/plain;
charset=utf-8`, so characters like em-dashes render correctly instead of as
mojibake. Hosts that ignore `_headers` (Vercel, GitHub Pages, …) still serve the
files; add your own header rule there if you want inline display and UTF-8.

### Tuning

On by default. A bare `markdownMenu: false` turns off **both** the `.md` files
and the button; otherwise toggle individual actions or set the button label:

```yaml
markdownMenu:
  enabled: true               # gates the .md files AND the button
  viewMarkdown: true          # per-item toggles (all default true)
  copyMarkdown: true
  downloadPdf: true
  label: View in Markdown     # the primary button's label
```

The agent hand-off items have their own toggles (`copyMcp`, `installSkill`,
`installPlugin`, `installAssistant`) — see [Agent readiness](/agent-readiness/).

{% callout severity='warning' title='markdownMenu: false also switches off metadata.json' %}
The [AI assistant](/ai-assistant/) and the [MCP server](/agent-readiness/) both retrieve
page content by reading `metadata.json` and the per-page `.md` files. Turning
`markdownMenu` off on a site that has either enabled leaves them with nothing to
fetch — the build warns, and every content lookup fails at runtime. Keep the menu on
(hide individual items if you must) whenever `ai.assistant` or `mcp` is on.
{% endCallout %}

### PDF output

Set a top-level `pdf: true` to render the **whole site to one downloadable PDF** —
a cover page, a clickable table of contents, then every page in nav reading order
with a bookmark per page — named after your site (`Aardvark` → `aardvark.pdf`) and,
like every other asset, published under a cache-busting name (`/aardvark-<build
token>.pdf`; the plain `/aardvark.pdf` slot stays reserved so nothing else can claim
it). A **Download PDF** item is added to the dropdown on every page, linking to the
current file. It's laid out as a clean, printable handbook with syntax-highlighted code
(long lines wrap) and tables. **Built-in components are re-rendered for print** —
an `{% raw %}{% openapi %}{% endraw %}` reference becomes operation/parameter tables, a card or callout a
titled block, and so on — so interactive widgets aren't blank on paper; a live map
gets a "view online" note, and a component from a React library you import is left to
its plain content. Links between your own pages become in-document jumps (so the PDF
reads on its own), while links to other sites stay clickable. The cover shows your
theme logo (or the site name when there's no logo), the site description, base URL and
a build timestamp. Password-protected pages are never included (their content ships
encrypted). It's off by default: on a site of any size the render is the slowest phase
of the whole build, which is what the reuse window below exists for (`vark dev` skips it,
so the menu link only resolves once you've run `vark build`).

```yaml
pdf: true
```

To keep generating the PDF but hide the menu link, set
`markdownMenu: { downloadPdf: false }` — the build then reminds you that nothing
links to the PDF, so link it yourself. The cover carries a small "Built by Aardvark"
credit; like the on-page [Powered-by footer](/theming/#powered-by-aardvark), it's
removable with `poweredBy: false` on sites that use Aardvark's AI features.

#### Reuse the PDF instead of re-rendering every build

The whole-site PDF is the slowest part of a build, so you can let a build **reuse the copy
already published** rather than rendering a fresh one every time. Give `pdf` as an object with
`reuseForDays`:

```yaml
pdf:
  reuseForDays: 7
```

On each build Aardvark fetches a tiny stable sidecar at
`<baseUrl>/_aardvark/pdf-reuse.json` to find the last deployed fingerprinted PDF URL (falling back
to the legacy `<baseUrl>/<slug>.pdf`, where the slug is derived from your `site.name`, e.g.
"My Docs" → `/my-docs.pdf`). It then reads the build date embedded in that PDF itself (its
`/CreationDate`). While that's **younger** than `reuseForDays`, the live PDF is republished as-is and
the slow render is skipped; once it ages **past** the window, the next build renders a fresh one —
whose new creation date restarts the clock. Because reuse republishes the exact bytes, the embedded
date rides along unchanged, so republishing never resets the window — only a real render does. This
needs a `baseUrl` to fetch from; anything missing or unreadable safely falls back to rendering, so a
build never ends up without a PDF. Pass `--no-pdf-reuse`, or use a bare `pdf: true`, to always render.
`reuseForDays` wants a positive whole number: a boolean, a non-numeric string, or a value of `0` or
less means "always render", while a float is truncated toward zero (`1.5` is a one-day window). The
object form keeps the PDF on unless you add `enabled: false`.

The reuse fetch is locked to the `baseUrl` host (an SSRF guard — it won't follow a redirect to a
different origin). So if your live PDF is served off-host (e.g. a redirect to an R2/CDN origin),
reuse won't engage and the build just renders fresh; keep the PDF on the `baseUrl` host to benefit
from reuse.

**Password-protected pages:** a fresh render drops protected pages from the PDF (their content would
otherwise ship in the clear), but reuse republishes the live PDF as-is and can't re-apply that
exclusion. So if you newly protect a page that was previously public, deploy once with
`--no-pdf-reuse` (or `pdf: true`) — otherwise that page's content lingers in the public PDF until the
next fresh render (up to `reuseForDays` later). When the build reuses a PDF on a site that has
protected pages, it notes this on the "Render PDFs" line (it isn't a warning — on a stable-protection
site that would fire every build).

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
  - from: /old-start/  # override the destination when moving a section
    to: "#quickstart"  # fragment-only values resolve against this page
---
```

String aliases forward to the page that owns them. Use the `from`/`to` mapping
when an old URL should forward to a specific section or another URL; `to` accepts
a root-relative URL, an absolute HTTP(S) URL, or a fragment such as `#quickstart`
resolved against the owning page.

For every alias, Aardvark writes a tiny HTML stub at the old path with a
`rel="canonical"` to the real page, `robots: noindex`, and an instant
`<meta http-equiv="refresh">` (plus a JS redirect and a visible link). Google
treats an instant refresh as a permanent move, and the canonical consolidates the
old URL's ranking onto the new one — so search engines update themselves. Stubs
work on **every** host and in `vark dev`, and each alias also gets a true
`301` line in the `_redirects` file below.

An alias has to be a concrete path the build can write a file at. One that isn't —
an external URL, a `*` wildcard or `:slug` placeholder, a path with a `?` query, `#`
fragment, or a space — is skipped with a build warning that points you at the config
`redirects:` below. The same warning covers an alias that collides with a real page or
asset (the page always wins), one two pages both claim (the first page in discovery
order keeps it), and a chain of aliases that redirects back to itself.

### Site-wide `redirects:` (config)

For rules that aren't tied to one page — including `*` wildcards and `:slug` /
`:splat` placeholders — add a `redirects:` list to `aardvark.config.yaml`:

```yaml
redirects:
  - /blog/* /news/:splat 301        # a raw _redirects line, passed through as-is
  - from: /docs/:slug               # or the mapping form
    to:   /guide/:slug
    status: 301                     # default 301; add `force: true` for Netlify's `!`
```

Each list item is one rule on a single line (a multi-line value is truncated at the
first newline). They're written verbatim to `_redirects` — Aardvark doesn't validate
the host grammar, except that a mapping missing `from`/`to`, or with a `status` that
isn't an HTTP code (`permanent`, `0`), is skipped with a warning. A static generator
can't expand a wildcard into files, so — unlike concrete `aliases:` — they produce
**no stubs** and only take effect where `_redirects` is read: Cloudflare Pages,
Netlify, and [`vark serve`](/self-hosting/), which honors the file's 3xx rules (a
`200` rewrite or a rule with CDN-only conditions is skipped). On other hosts they're
inert.

### Tuning

```yaml
aliases:
  htmlStubs: true       # write the per-alias HTML stubs (default true)
  redirectsFile: true   # also emit a _redirects file (default true)
  force: false          # append `!` to alias 301s — Netlify force flag (default false)
```

A bare `aliases: false` turns off per-page aliases entirely — no stubs and no alias
`301` lines — while the config `redirects:` above are still written. `force: true`
appends Netlify's `!` flag to those alias `301`s; Cloudflare Pages ignores it. Which of
a stub and its `301` actually wins on a given host is a deployment question — see
[Redirects](/deployment/#redirects).

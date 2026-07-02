---
description: aardvark ships a built-in ⌘K search — a full-text index generated at
  build time and scored in the browser, with no external service.
heading: Features
heading-icon: fa-solid fa-puzzle-piece
icon: fa-solid fa-magnifying-glass
menu: docs
title: Search
weight: 50
---

# Search

aardvark has **built-in search** — no Algolia, no crawler, no API keys. The build
writes a full-text index of your site and a Mantine search box scores it in the
browser as you type.

## Using it

Press <kbd>⌘K</kbd> (or <kbd>/</kbd>) anywhere, or click the search box in the
header. Then:

- type to see ranked results update live, with the matching text highlighted so
  you can tell *why* each result surfaced;
- after results appear, use the path filter to narrow the list to one or more
  sections of the site;
- use <kbd>↑</kbd>/<kbd>↓</kbd> to move through results and <kbd>↵</kbd> to open
  the highlighted one;
- press <kbd>Esc</kbd> to close.

### Narrowing a search

Two operators help when a plain keyword search returns too much:

- **Exact phrase** — wrap words in double quotes to match them as one literal,
  consecutive phrase: `"getting started"` finds only pages with that exact wording
  (punctuation counts), not pages that merely mention *getting* and *started* apart.
- **Exclude a word** — prefix a term with a minus sign to drop every page that
  contains it: `theme -dark` finds theme pages that don't mention *dark*. You can
  exclude a phrase too — `-"under construction"`. Exclusions look at page content,
  not the URL or breadcrumb, so `-dark` won't hide a page that just happens to live
  under `/dark-mode/`.

Mix them freely: `"api key" -deprecated` requires the exact phrase *api key* and
drops anything mentioning *deprecated*.

### Filtering by path

After a query has results, the search dialog also shows a **path filter**. It is
built automatically from the URLs in the current result set: if the results include
`/components/inputs/textinput/`, the filter can offer `/components/` and
`/components/inputs/`. Root (`/`) is skipped so the menu stays focused on useful
site sections.

Pick one or more folders to keep only results under those paths. For example,
`/components/inputs/` keeps input component pages, while `/components/` keeps the
whole components section. Multiple selected paths are combined as an OR filter:
choosing `/components/buttons/` and `/authoring/` shows results from either area.

Path filters do **not** rerank results. The search scorer still runs once for the
query, then the selected paths narrow the visible list while preserving that
ranking order. Matching is path-boundary aware, so `/components/` matches
`/components/button/` but not `/components-extra/`.

Filters stay selected while you refine the query, as long as the new result set
still contains those paths. If a selected path disappears, aardvark drops that
selection so a stale filter cannot make a valid search look empty. Closing the
search dialog clears both the query and selected paths.

## What the build does

Every build writes `search-index.json` to your site root — one record per page:

| field | what it holds |
|---|---|
| `url`, `title`, `breadcrumb` | where the page lives and what it's called |
| `description`, `keywords` | from the page's front matter |
| `headings` | every `h1`–`h6` on the page |
| `inboundLinks` | a `{text: count}` map of the link text other pages use to link here — deduped, with how many times each is used |
| `text` | the full, user-visible body text (markup stripped) |

The client scores matches by where they hit: a hit in the **title**, **URL**, or
**breadcrumb** is worth 10; in the **headings**, **keywords**, or **description**, 5;
and anywhere in the **body**, 1. A match in the **inbound link text** is worth 5 too,
scaled up (dampened, by `log2` of the count) when many pages link here with that text —
so a widely-referenced page ranks a little higher for the words others use to point at
it, without letting nav links dominate. A multi-word query that appears **verbatim** in
the title, a heading, or the description earns an extra bonus on top, so exact phrase
matches in those summary fields rank above incidental word hits — and a `"quoted phrase"`
(see [above](#narrowing-a-search)) is *required*, matched literally anywhere on the page,
not merely boosted. Results sort by total
score, strongest first; when two pages score the same, the one with more headings wins
(a fully documented page beats a one-line stub), then the more-linked page, then title.

Every one of these weights is configurable — see [Tuning the ranking](#tuning-the-ranking).

### Tuning the ranking

Set any of the weights under `search.ranking` in your config. Anything you leave out
keeps its default, so you only list what you want to change. These are the defaults:

```yaml
search:
  ranking:
    title: 10        # match in the page title
    url: 10          # match in the URL path
    breadcrumb: 10   # match in the breadcrumb trail
    headings: 5      # match in any h1-h6 heading
    keywords: 5      # match in the front-matter keywords
    description: 5   # match in the front-matter description
    text: 1          # match anywhere in the body text
    inboundLink: 5   # match in other pages' link text (then scaled up by how many link here)
    phrase: 10       # bonus for a verbatim multi-word phrase in the title, a heading, or the description
```

Set a weight to `0` to switch a field off entirely. You only list the weights you want
to change — everything else keeps its default. A few common adjustments:

**Rank on titles and structure, not prose.** Good when bodies are long and repetitive
(API references, generated docs) and the title already says what a page is:

```yaml
search:
  ranking:
    text: 0       # ignore body-text matches
    headings: 8   # lean harder on section headings
```

**Reward exact wording.** Boosts pages where the query appears verbatim in a title,
heading, or description — handy for a glossary or a precise term index:

```yaml
search:
  ranking:
    phrase: 25    # a verbatim multi-word match is a strong signal
```

**Trust your own titles over how other pages link.** Lower the inbound-link weight when
a few heavily-linked hub pages crowd out more relevant results:

```yaml
search:
  ranking:
    inboundLink: 1
```

**Validation.** Weights must be numbers `>= 0`. An unknown key, a non-numeric value, or a
negative one is ignored with a build warning and falls back to its default — so a typo
can't silently skew ranking. The tie-breaking order used when two pages score equally
(more headings, then more inbound links, then title) isn't configurable.

## Analytics

When the Google Analytics integration is configured (`integrations.analytics`),
search activity is reported automatically — no extra setup:

- a **`search`** event (with `search_term` and the number of `results`) each time a
  query settles. This feeds GA4's built-in *Site search* report, and the
  `results: 0` events show what people look for but don't find — your content gaps.
- a **`search_select`** event (`search_term`, `url`, `position`) when a result is
  opened, so you can see which queries lead where.

With analytics off, nothing is sent.

## Index size

The index is gzipped at build time — `search-index.json.gz` is written next to the
plain file, and the search box gunzips it in the browser (via `DecompressionStream`),
so it downloads small on **any** host, not only ones that apply `Content-Encoding`
themselves (typically a 3–4× saving). Browsers without `DecompressionStream` fall back
to the plain `search-index.json` automatically.

The JSON itself is minified (it's read by code, not people), so the plain file stays
as small as possible before gzip even kicks in.

To skip the gzipped copy and rely on your server's own compression instead:

```yaml
search:
  compress: false
```

## Caching

The index is served from a stable path (`search-index.json` / `.gz`), so make sure
your host serves it with **revalidation** — an `ETag`/`Last-Modified` (most static
hosts and CDNs do this by default) or `Cache-Control: no-cache` — so readers pick up
fresh results right after a redeploy instead of a stale cached copy. It only needs
attention if your host sets long, non-revalidating cache lifetimes on JSON.

> **Serve from the domain root.** The search box fetches `/search-index.json` by an
> absolute, root-relative path — as the theme does for all its generated assets (the
> islands bundle, `theme-<sha>.css`, hover-card data, …). Deploying under a URL sub-path
> (e.g. `https://example.com/docs/`) isn't supported: those assets would 404. Host
> the site at the origin root (or a subdomain), which is the default for the
> supported targets (Cloudflare, Netlify, GitHub Pages project sites via a subdomain).

## Turning it off

Search is on by default. To disable both the header box and the index file, set:

```yaml
search: false
```

> The search box is a Mantine island, so it appears on builds that bundle islands
> (Node + esbuild — the default). `search-index.json` is written either way, so a
> `--no-bundle` build can still be searched once rebuilt with the bundle.

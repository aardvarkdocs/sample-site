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
- leave **Exact matches** off for small spelling slips, or turn it on
  when you want only exact typed terms;
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

The search box also corrects small typos for unquoted terms by looking at
high-signal labels: titles, headings, and keywords. That helps a
misspelling still reach the right page, but it can be too generous for short
product/component names. Check **Exact matches** in the search dialog to
require typed terms exactly. Quoted phrases and exclusions are always
literal.

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

Matching is **accent-insensitive**: the query and the index are folded the same way
(diacritics stripped, case ignored), so searching `cafe` finds *Café* and `münchen`
finds *Munchen* — either spelling matches either. This is always on and needs no config.

Every one of these weights is configurable — see [Tuning the ranking](#tuning-the-ranking).

### Per-page control

Two front-matter keys tune how an individual page behaves in search:

- **`searchable: false`** removes the page from the search box and every AI/agent corpus the build
  emits — the assistant / MCP index, `llms.txt`, and page cards — while leaving it **fully public and
  crawlable**: it stays in the sitemap, keeps its normal `robots` meta, and still serves, so search
  engines index it as usual. Use it to declutter results with pages readers shouldn't stumble into via
  search (a legal boilerplate page, a redirect stub). This is distinct from `noindex`, which goes
  further and hides the page from the *outside* world too — dropping it from the sitemap and emitting a
  `noindex` robots directive so search engines skip it.
- **`boost: <number>`** scales a page's match score (default `1`). It's *multiplicative*, so it
  reranks pages the query already matches rather than forcing an unrelated page to the top —
  `boost: 2` roughly doubles a page's rank strength, `boost: 0.5` halves it, and `boost: 0`
  soft-hides a page (it stays indexed but can never rank). Handy to float a canonical "Getting
  started" above near-duplicates, or sink a deprecated page.

```yaml
---
title: Deprecated API
boost: 0.2          # still findable, but ranks below the current docs
---
```

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
    synonym: 0.5     # a synonym match scores 50% (0.5×) of the same word matched exactly; see Synonyms
    typo: 0.5        # a typo-corrected match scores 50% (0.5×) of an exact match; see Typo tolerance
```

The last two — `synonym` and `typo` — are **multipliers**, not field weights. A synonym-
or typo-matched term earns its normal per-field score, then that score is **multiplied by
this factor**. So the default `0.5` means such a match is worth **half** of the same word
matched exactly: if an exact title match is worth `10`, the same word reached through a
synonym or a typo-correction is worth `5`. That's why [synonyms](#synonyms) and
[typo-corrected](#typo-tolerance) matches rank below an exact match.

Set it to `0.25` to count them at a quarter, `1` to count them the **same** as an exact
match (no penalty), or `0` to keep the expansion for recall but give it no ranking weight
at all. Keeping the factor **below `1`** preserves the rule that an exact match always
wins; a value **above `1`** would let a synonym or fuzzy match *outrank* a literal one.

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

**Lean on synonyms and typo-correction.** If your synonym map is curated and your terms
are easy to misspell, let those matches compete closer to exact ones (still below, so an
exact match wins):

```yaml
search:
  ranking:
    synonym: 0.9   # a synonym match counts almost as much as an exact one
    typo: 0.7      # forgive misspellings more generously
```

**Validation.** Weights and factors must be numbers `>= 0`. An unknown key, a non-numeric
value, or a negative one is ignored with a build warning and falls back to its default — so a
typo can't silently skew ranking. The tie-breaking order used when two pages score equally
(more headings, then more inbound links, then title) isn't configurable.

### Typo tolerance

Search forgives misspellings out of the box: a query term that matches nothing is compared
against the words in your titles, headings, and keywords, and the closest ones (within one edit
for short words, two for longer) are searched too — so `instalation` still finds *Installation*.
Corrected matches rank **below** exact ones, so a real match is never buried — and you control *how
far* below with the `search.ranking.typo` factor (see [Tuning the ranking](#tuning-the-ranking)). It's
**on by default**; tune or disable it under `search.typoTolerance`:

```yaml
search:
  typoTolerance: false        # turn it off entirely
```

…or tune it:

```yaml
search:
  typoTolerance:
    maxDistance: 1            # max edits to consider (0–2; default 2)
    minLength: 5             # don't fuzz terms shorter than this (default 4)
```

Short terms and API symbols are left alone (`minLength`) so they aren't fuzzed into unrelated words.

### Synonyms

Map the words readers type to the words your docs use — so a search for one finds pages that only
mention the other. Each entry is **multi-way**: every word in a group matches every other.

```yaml
search:
  synonyms:
    otp: [one-time password, 2fa code]
    login: [sign in, signin, log in]
    k8s: [kubernetes]
```

With this, `otp` also finds pages that say *one-time password* — and searching *one-time password* finds
pages that only say `otp`. Matching is by whole query word: a single-word synonym (like `k8s`/`kubernetes`)
works in **both** directions, and a multi-word value matches when the reader types its words in order, so it
too expands back to the rest of its group. Synonyms expand the
reader's query only — they rank below an exact match (tune how far below with the `search.ranking.synonym`
factor — see [Tuning the ranking](#tuning-the-ranking)), and a `"quoted phrase"` or `-exclusion` is never
expanded (those are explicit literal signals). Checking **Exact matches** also skips synonym expansion
for that search. Malformed entries are dropped with a build warning.

### Section & API-symbol results

Turn this on to let a result jump straight to the **heading** it matched, instead of the top of the
page — and to make **API operations searchable by symbol**:

```yaml
search:
  sections: true          # → default heading band h2–h3
```

…or choose the band:

```yaml
search:
  sections:
    minLevel: 2
    maxLevel: 4
```

With `search.sections` on:

- a match in a section heading deep-links to that heading (`/guide/auth/#tokens`), with the heading
  shown in the result's trail;
- every `{% raw %}{% openapi %}{% endraw %}` operation becomes findable by its **operationId**, its **`METHOD /path`**, or
  its tag — so a search for `createPet` or `POST /pets` lands right on that operation. (Operations are
  rendered by the API-reference island, so they're invisible to the normal page-text indexer without
  this.)

It's **off by default** because section records grow the index; a match in body prose still surfaces
the page even when it's off. This composes with the [path filter](#narrowing-a-search) — faceting still
narrows by site area, while sections locate the spot within a page.

### Multilingual sites

On a site with more than one language, each result is tagged with its page's language, and the search
box gently **prefers results in the language you're currently reading** — a translated page ranks above
its foreign-language twin, while an untranslated page stays findable. No configuration required.
Matching is also accent-insensitive (see above), which helps across languages that share a script.

### 404 suggestions

When search is on, the generated **404 page** helps a lost reader recover: it reads the URL that
missed, searches the index for the closest pages, and lists them as "were you looking for…" links
(deep-linked to a heading when [sections](#section-api-symbol-results) are on). Because it reuses the
search scorer, [typo tolerance](#typo-tolerance) quietly fixes a fat-fingered URL too — `/instalation/`
suggests *Installation*. It's automatic; just write a helpful [`404.md`](/deployment/#custom-404-page), which stays the fallback
when a visitor has JavaScript disabled. The header ⌘K search is available on the 404 page as well.

The built-in theme wires this in for you. If you ship a **fully custom theme**, add the
`{% raw %}{% not_found_html %}{% endraw %}` slot to your `default.html` (the built-in places it just before
`{% raw %}{% content %}{% endraw %}`) to get the suggestions island — see
[Theming → what the layout receives](/theming/#what-the-layout-receives). Without it the 404 page still renders your static
`404.md`; you just don't get the "were you looking for…" island.

## Analytics

When the Google Analytics integration is configured (`integrations.analytics`),
search activity is reported automatically — no extra setup:

- a **`search`** event (with `search_term` and the number of `results`) each time a
  query settles. This feeds GA4's built-in *Site search* report, and the
  `results: 0` events show what people look for but don't find — your content gaps.
- a **`search_select`** event (`search_term`, `url`, `position`) when a result is
  opened, so you can see which queries lead where.

With analytics off, nothing is sent.

### Search Analytics dashboard (AI-enabled sites)

If your site uses the built-in AI assistant (a metered "aardvark cloud" key), the search box also
reports activity to your dashboard's **Search Analytics** tab — a superset of what Fern, ReadMe, and
Mintlify show:

- **top searches** and **zero-result queries** (your content gaps), with a volume trend;
- **click-through rate**, **average result position**, and **no-click sessions** (searches that went
  nowhere);
- **Ask-AI escalation rate** — how often a search turned into an assistant question;
- **top clicked results**, a **language** breakdown, and **search latency**;
- **CSV export** of the top terms.

Query text is stored by default (bounded; the raw rows are swept after a retention window — **90 days
by default**, configurable via the gateway's `SEARCH_EVENT_RETENTION_DAYS`, after which only the
aggregate trends remain) so you get the term-level drill-down. Set `search.analytics.store_terms: false`
to log only the anonymous funnel (counts, rates,
positions, latency — no raw text), or `search.analytics: false` to turn the dashboard capture off
entirely. Readers with **Do-Not-Track** or **Save-Data** set are never logged by the shipped search
widget — it sends no beacon (a client-side check, like `store_terms` above). (This is independent of the
GA events above — you can run either, both, or neither.)

`store_terms: false` is a **client-side, best-effort** control: your site's search widget omits the query
text before sending, so with the shipped widget a reader's query text isn't transmitted. The gateway does
**not** re-check the flag — it stores whatever `term` a caller sends — so it isn't an absolute guarantee:
a custom or scripted client that ignored the setting could still write term text. On the server, the ingest
endpoint's **origin allowlist** is the primary safeguard: it only accepts beacons whose `Origin` is your own docs site, so the
world-readable `aardvark_live_` key in `ai-config.json` can't be used from another site's browser to write
into your analytics — that allowlist, not the per-account rate cap, is what keeps a leaked public key
low-risk. It isn't an absolute gate (a determined caller scripting requests outside a browser can forge the
`Origin` header), but even then they can only inject their *own* text (bounded and rate-capped), never a
reader's query. In short: the widget + `store_terms` protect readers' text client-side, and the origin
allowlist is the server-side backstop that keeps other sites out.

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

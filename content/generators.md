---
description: Build-time Python in Aardvark — inline blocks that compute part of a page
  (fetch an API, loop over data) and generation scripts that emit whole page sets.
icon: fa-solid fa-code
menu: docs
title: Build-time Python
weight: 20.8
---

# Build-time Python

Aardvark runs *your* Python at build time in two places:

- **Inline `{% raw %}{% … %}{% endraw %}` blocks** inside any page — to compute *part* of
  a page: fetch an API, loop over your `data/`, assemble a table.
- **Generation scripts** in a `generators/` directory — to produce whole *files*:
  emit **pages** (one Markdown file per row of data, a stub per API operation) with
  `generate()`, or emit **any other file** — a downloadable CSV, JSON, or YAML export, an
  image, a zip, any bytes — with `emit()`.

Reach for an inline block when you want a fragment of an otherwise hand-written page;
reach for a generation script when the output is a whole file (or a set of them). The live
[AI model rates](/pricing/models/) page is a real generation script that writes a page; the
[downloadable exports](#a-live-example) at the bottom of this page are a real generation
script that writes files. This page you're reading uses an inline block (the live demo
below).

Because a generation script can write **any** file the build serves — not just Markdown
pages, and not just the formats Aardvark templates into (HTML, `sitemap.xml`, `llms.txt`) —
build-time Python is Aardvark's escape hatch for producing whatever a static host can serve:
a machine-readable data feed, a `robots`-style text file, a generated diagram, a binary
download. If you can compute it in Python, you can publish it.

## Inline `{% raw %}{% … %}{% endraw %}` blocks

A `{% raw %}{% … %}{% endraw %}` block runs Python as the page builds. A single
**expression** is rendered in place:

{% raw %}
```aardvark
This site documents {% len(data.get("products", {}).get("items", [])) %} products.
```
{% endraw %}

Anything beyond a single expression is **statements** — use the injected `print()` to emit
into the page:

{% raw %}
```aardvark
{%
for item in data["products"]["items"]:
    print(f"- **{item['name']}** — {item['blurb']}\n")
%}
```
{% endraw %}

`print()` writes its argument **verbatim, with no trailing newline** — so a bare expression
never injects stray whitespace. When you emit Markdown line by line (a table, a list), add
the `\n` yourself, as above. An expression that evaluates to `None` renders nothing, so a
block that just calls a function with no return value leaves no trace in the page.

Everything in the page's template scope is available inside a block:

| Name | What it is |
| --- | --- |
| `data` | your parsed `data/` files (the same object templates see) |
| `site`, `config`, `page` | the site config, the build config, and this page's front matter |
| `component(...)`, `snippet(...)` | emit any built-in component or project snippet |

And because it's just Python, a block can `import` anything and call out to the network.

{% callout severity='warning' title='Use at your own risk' %}
Inline blocks and generation scripts are ordinary, **unsandboxed** Python that runs as part
of your build. Only run code you trust. Keep build-time network calls defensive — a timeout
and a `try`/`except` fallback — and remember that a block which always hits the network makes
**every** build depend on that endpoint being up. `data`, `site`, and `config` are shared by
reference across every block and script (and the rest of the build), so **read them, don't
mutate them** — a mutation in one leaks into everything that runs after it.
{% endCallout %}

### Live demo: this page fetches its own metadata

The viewer below isn't checked in — it's built when this page is. The block fetches
[`metadata.json`](https://aardvarkdocs.com/metadata.json) (the agent-discovery artifact
Aardvark publishes for *this very site*) and renders it with the built-in
[`{% raw %}{% jsontree %}{% endraw %}`](/components/community/jsontree/) viewer — the same
interactive JSON tree the API reference uses for OpenAPI response examples:

{%
import json, urllib.request

_url = "https://aardvarkdocs.com/metadata.json"
try:
    _req = urllib.request.Request(_url, headers={"User-Agent": "aardvark-docs"})
    with urllib.request.urlopen(_req, timeout=6) as _resp:
        _meta = _resp.read(4 * 1024 * 1024).decode("utf-8")
    json.loads(_meta)  # validate it parses before handing it to the viewer
    print(component("aardvark", "jsontree", data=_meta, rootName="metadata.json",
                    maxDepth=1, withSearch=True, withExpandAll=True,
                    showItemsCount=True, withKeyCountBadge=True, withBorder=True))
except Exception:
    print("*(The live `metadata.json` couldn't be fetched for this build — this fallback "
          "line is the `except` branch doing its job, so the build never fails on it.)*")
%}

That whole viewer is this block — defensive fetch and all:

{% raw %}
```aardvark
{%
import json, urllib.request

_url = "https://aardvarkdocs.com/metadata.json"
try:
    _req = urllib.request.Request(_url, headers={"User-Agent": "aardvark-docs"})
    with urllib.request.urlopen(_req, timeout=6) as _resp:
        _meta = _resp.read(4 * 1024 * 1024).decode("utf-8")
    json.loads(_meta)  # validate it parses before handing it to the viewer
    print(component("aardvark", "jsontree", data=_meta, rootName="metadata.json",
                    maxDepth=1, withSearch=True, withExpandAll=True,
                    showItemsCount=True, withKeyCountBadge=True, withBorder=True))
except Exception:
    print("*(The live `metadata.json` couldn't be fetched for this build.)*")
%}
```
{% endraw %}

Note the shape of a careful build-time fetch: a **timeout**, a **capped read**, a
**parse check**, and an `except` that prints a fallback instead of raising. A page block that
raises fails the build (by design — a broken page should), so a network call that you don't
want to be load-bearing must catch its own failures.

## Generation scripts

When the output is a whole file — a page, a page *set*, or a downloadable data file — move the
Python into a `generators/` directory at your project root. A generation script is just
build-time Python — the **whole file runs**, top to bottom; there's no entry function to
define. Each script gets two writers: `generate()` for **pages** and `emit()` for **any other
file**. For pages, on every build Aardvark:

1. **runs** each `generators/*.py` (in alphabetical order) and collects every page it emits;
2. **reconciles** that against `content/`: changed pages are rewritten, pages no longer
   emitted are deleted, and unchanged pages are left untouched;
3. **discovers and renders** everything in `content/` — generated and hand-authored alike.

So your content tree is always reproducible from `generators/` plus its inputs (stale
generated pages can't linger), and a re-run with unchanged inputs writes nothing — which is
why `vark dev` can re-run generators on every rebuild without looping on its own output.
Reconciliation only happens once **every** script has succeeded: a script that raises fails
the build with a message naming the script, and `content/` is left exactly as it was.
Files whose name starts with `_` (e.g. `_helpers.py`) are **not** run — they're importable
helper modules your scripts can `import` (the `generators/` directory is put first on the
import path for the run, so `import _helpers` always finds *your* helper, recompiled from
source every build).

Generators run by default in `vark build`, `vark dev`, and `vark link-check` — link-check
included, so a generated page with a dead link is caught too. Each takes
`--no-generators` to skip them and use whatever generated pages are already in `content/`:
the offline dev loop when a generator's network call is slow, or a fully read-only
link-check that writes nothing (handy in CI when the generated pages are committed).

Two small things that bite once:

- A generator runs as a script, so `__name__ == "__main__"` is true — a file that guards its
  work behind that idiom still runs (rather than silently emitting nothing and having its
  previous pages reconciled away).
- Calling `sys.exit()` from a generator fails the build; a generation script has to run to
  completion. Raise an exception (or just let one propagate) to signal a real failure.

### Writing pages

A generator gets the same ambient names a page's `{% raw %}{% … %}{% endraw %}` blocks get —
`data`, `site`, `config` — plus one writer, `generate(path, frontmatter, content)`:

```python
import re

# `data` is injected, like in a page. One page per product:
for item in data["products"]["items"]:
    slug = re.sub(r"[^a-z0-9]+", "-", item["name"].lower()).strip("-")
    generate(
        f"catalog/{slug}.md",                                   # path, relative to content/
        {"title": item["name"], "description": item["blurb"]},  # frontmatter
        f"{item['blurb']}\n\n**Price:** ${item['price']}\n",    # Markdown body
    )
```

What's in scope:

| Name | What it is |
| --- | --- |
| `generate(path, frontmatter, content)` | Write one `.md` page under `content/` — the guarded writer for pages; returns the file's absolute path. |
| `data` | Your parsed `data/` files (the same object templates see). |
| `site`, `config` | The site config and build config; `config.root` / `config.content_dir` give you project paths (e.g. for a cache dir). |

`generate` is deliberately strict — it's the one supported, guarded way to write a page:

- the `path` must be **relative** and end in **`.md`**; a path with a `..` segment, or one
  that escapes `content/` (through a symlink, say), is rejected;
- `frontmatter` must be a mapping (or omitted) and `content` a string;
- it **won't overwrite a hand-authored page** — generators only create pages;
- two scripts writing the **same path** in one build is an error, not a silent last-writer-wins.

### The `generated` marker

Every page `generate` emits gets two injected front-matter keys:

```yaml
generated: true
generated_by: generators/pricing.py
```

These keys are **reserved**. If your `frontmatter` sets either one yourself, the build
**fails** and tells you which key collided — the marker is what lets Aardvark find and wipe
generated pages, so a script can't forge or override it.

Because the marker is how Aardvark tells generated pages from hand-authored ones, a file
that carries both keys is treated as generator output: on the next build it's overwritten
if a generator re-emits it, or deleted if none does. So if you ever want to **keep a
generated page permanently as hand-authored** (commit it and edit it by hand), remove both
`generated` and `generated_by` from its front matter first — otherwise the next build
reclaims it.

### Emitting files (CSV, JSON, anything)

`generate()` writes Markdown *pages*. When you want to publish something that **isn't** a
page — a downloadable CSV, a JSON or YAML feed, an SVG, a zip, any bytes — use the other
injected writer, `emit()`:

```python
import csv, io, json

# One page per row is `generate`; a single downloadable export is `emit`.
# `data` values are read-only DotDicts — project the fields you want into plain
# dicts first, so csv/json/yaml can serialize them.
records = [{"name": r["name"], "price": r["price"]} for r in data["products"]["items"]]

buf = io.StringIO()
w = csv.DictWriter(buf, fieldnames=["name", "price"])
w.writeheader()
w.writerows(records)
emit("downloads/products.csv", buf.getvalue())                  # -> /downloads/products.csv

emit("downloads/products.json", json.dumps(records, indent=2))  # -> /downloads/products.json
```

`emit(path, content)` writes `content` to `path` in the **build output** and returns the
site-absolute URL it will be served at (handy for linking to it from a page you also
generate). That's the whole API:

| Name | What it is |
| --- | --- |
| `emit(path, content)` | Write one arbitrary file to the build output; returns its URL (e.g. `/downloads/products.csv`). |

The rules are few and strict:

- **`content` is written verbatim.** A `str` is encoded UTF-8; pass **`bytes`** (or a
  `bytearray`) for a binary format (an image, a PDF, a Parquet file) and the bytes land
  untouched — Aardvark never parses, renders, or rewrites an emitted file, so what you emit is
  exactly what's served.
- **`path` is a clean relative path** under the site root — an absolute path or one
  containing `..` is rejected. `emit("data/x.json", …)` is served at `/data/x.json`.
- **The name has to be URL-safe as written.** A path containing a space, `%`, `?`, `#`,
  `:`, a backslash, or a NUL byte is rejected, because the file wouldn't be reachable at the
  URL `emit()` returns (`/data?v=1.csv` is the path `/data`; `%2f` decodes differently on
  different hosts). Use `annual-report.pdf`, not `annual report.pdf`.
- **It won't clobber anything else the build writes** — a page, a `static/` file, or a
  built-in artifact. Emit to a path nothing else owns, and never under a root Aardvark
  reserves for its own output: `_aardvark/`, `.well-known/`, `_assistant/`, `sitemap.xml`,
  `robots.txt`, `llms.txt`, `llms-full.txt`, `search-index.json` (and `.gz`),
  `search-index-agent.json`, `metadata.json`, `page-cards.json`, `_headers`, `_redirects`,
  `404.html`, `index.md`, `auth.md`, or the whole-site PDF's `<slug>.pdf` when `pdf` is on.
  Two scripts emitting the same path is an error, like `generate()`.
- **An emitted file is not a page.** It's never discovered, rendered, or listed in the nav,
  search, or sitemap — it's just a file at a URL. (Link to it with a normal `[download](…)`;
  link-check skips file links, so a `.csv`/`.json` href is never flagged.)
- **Prefer a file extension.** An extension (`/reports/data.csv`) gives the file its correct
  content-type everywhere. A suffix-less path (`/reports/data`) is still served — `vark serve` /
  `vark dev` (and a static host) fall back to the raw file — but with a generic
  `application/octet-stream` type, so reach for the natural extension when the type matters.

The key difference from `generate()`: a generated **page** is *source* — it's written into
`content/`, then discovered and rendered like hand-authored Markdown, and reconciled there
(stale pages are deleted). An emitted **file** is *output* — it goes straight into the build
directory, written at the very end of the build after every page and artifact, which is
both why it can refuse to clobber one and why it's never fingerprinted or rewritten: the
bytes are served exactly as emitted. Because the whole output tree is rebuilt every build,
there's no stale-file bookkeeping: a file you stop emitting simply stops appearing.

{% callout severity='info' title='No new formats to learn' %}
This is why Aardvark doesn't need Hugo-style "output formats" or per-page alternate
templates. Anything a static host can serve, a generator can write with a few lines of
ordinary Python — `csv`, `json`, `yaml`, `PIL`, whatever's on PyPI — reading from the same
`data/` your pages use.
{% endCallout %}

## A live example

This very site's **[AI model rates](/pricing/models/)** page is built by one generation script:
[`generators/pricing.py`](https://github.com/aardvarkdocs/sample-site/blob/main/generators/pricing.py)
calls **OpenRouter's API** at build time and writes `pricing/models.md` — a real-world generator that
fetches live data (with a cached fallback under `config.root / ".aardvark-cache"`) rather than
reading a local file. It never fails the build: a fetch that goes wrong falls back to the last
cached snapshot and says so, and with no snapshot at all the page ships a "prices unavailable"
notice instead of the table. The generated page is deliberately not committed — it's rebuilt on
every build, so it lives in `.gitignore` like any other generated file.

The result is an ordinary page: it appears in the nav, in search, in the sitemap, and is
**link-checked** like everything else — a generated page with a dead link fails the build,
exactly as a hand-authored one would.

And the `emit()` side is live too:
[`generators/downloads.py`](https://github.com/aardvarkdocs/sample-site/blob/main/generators/downloads.py)
reads the same `data/products.yaml` this site's shop demo uses and publishes the catalog as
three real downloads — built fresh on every build, byte-for-byte from the data:

- [products.csv](/downloads/products.csv)
- [products.json](/downloads/products.json)
- [products.yaml](/downloads/products.yaml)

None of those are pages — they're files at a URL, produced by ~20 lines of ordinary Python.

## Security & anti-patterns

Build-time Python is **trusted-author code, not a sandbox**. A generator or an inline
block runs with your build's full privileges — filesystem,
environment variables, network — the same as a `Makefile`, a Sphinx `conf.py`, or an npm
`postinstall` script. There's no in-process restriction, and there can't be a meaningful one
(hiding `os` wouldn't stop a determined script and would break legitimate uses like
authenticated fetches). So the rules below are about *who* runs *what*, not about locking the
language down.

{% callout severity='warning' title='This matters most for public repos' %}
On a **private** repo — or any repo where only people you trust can push and open pull
requests — build-time Python only ever runs *your own* code: review it like any other code and
you're covered.
{% endCallout %}

**Avoid:**

- **Running generators or inline blocks you don't trust.** They can read your environment
  variables, read and write files, and reach the network. Treat a change that adds or edits a
  generator (or a build-time block) as a code change with that power, and review it as one.
- **Letting untrusted code run with secrets in the environment.** The defense is configuration
  you click through in your repo's GitHub settings:
    - **Settings → Actions → General → "Fork pull request workflows from outside collaborators"**
      → **"Require approval for all outside collaborators."** A stranger's PR then runs no
      workflow until you press **Approve**, so their code never runs unreviewed.
    - **Settings → Environments** → keep deploy secrets in an environment whose **Deployment
      branches** are limited to your release branch (not in loose repository secrets). Only the
      post-merge deploy can read them — a PR build can't.
    - **Settings → Actions → Runners** → don't attach self-hosted runners to a public repo; a
      fork PR's code would run on your machine.
    - One gotcha no toggle covers: a workflow with **`on: pull_request_target`** runs with your
      secrets *even for fork PRs* — if you have one, make sure it never checks out and runs the
      PR's code. Plain `on: pull_request` is the safe default (fork PRs get no secrets).
- **Building genuinely untrusted content in your normal build environment.** If you must build
  content you don't trust, isolate the whole build in an ephemeral container with **no secrets
  in its environment** — the settings above keep *your* secrets out of an outside PR's reach,
  but only isolation contains code you can't review at all.
- **Hardcoding secrets in a generator.** Read them from the environment (`os.environ`) — fine
  for *your own* build — and never commit the value.
- **Unguarded build-time network calls.** A bare `urlopen` makes *every* build depend on a
  third party being up. Wrap it in a timeout + `try`/`except` with a fallback, and cache when
  you can — as [`generators/pricing.py`](https://github.com/aardvarkdocs/sample-site/blob/main/generators/pricing.py)
  does.
- **Mutating `data`, `site`, or `config`.** They're shared by reference across every block and
  script in the build — read them, don't mutate them, or you'll poison whatever runs next.

---
description: Every aardvark command — new, build, dev, link-check, and ai-enrich — and the options each takes.
aliases:
  - /old-cli/
icon: fa-solid fa-terminal
menu: docs
title: CLI reference
weight: 62
---

<!-- Generated from `vark --help` by scripts/gen-cli-docs.py, which all
     build scripts (build-binary.sh, build-release.sh, cf-pages-build.sh) run.
     Do not edit by hand — edit the command help in src/aardvark/cli.py and
     re-run a build script. -->

# CLI reference

Aardvark — a Mantine-powered static site generator.

Author your content in Markdown and build it into a fast, fully static site: Mantine-powered interactive components, built-in client-side search, automatic Open Graph cards, and optional build-time AI enrichment. Scaffold a project with `vark new`, preview it live with `vark dev`, and produce the deployable site with `vark build`.

On interactive terminals, vark quietly checks for newer releases in the background while real subcommands run, and prints an upgrade reminder only when an update is available. Run `vark update` any time for an explicit check.

Run with no command to open the interactive TUI (agentic authoring + launchers).

Run `vark <command>` (or `aardvark <command>`) from your project root.

Examples:

```bash
vark new my-docs        # scaffold a new site in ./my-docs
cd my-docs && npm install   # install the islands toolchain (needs Node)
vark dev                # preview at http://localhost:8000, live-reload
vark build              # build the static site into ./build
```

## Commands

| Command | Description |
| --- | --- |
| `vark new` | Scaffold a new site in PATH. |
| `vark build` | Build the site to the output directory. |
| `vark dev` | Serve the site locally and rebuild on change. |
| `vark link-check` | Check internal links, anchors, and images across the site (a build smoke test). |
| `vark convert` | Import a docs site built for another platform into an aardvark site. |
| `vark ai-enrich` | Run opt-in build-time enrichment (frontmatter, examples, skills). |
| `vark author` | Run agentic authoring tasks on your docs — interactively or headless. |
| `vark serve` | Serve a built site (and a live MCP server) for production. |
| `vark update` | Check whether a newer version of aardvark is available. |
| `vark version` | Manage documentation versions (snapshot-in-tree docs versioning). |
| `vark web-bot-auth-keygen` | Generate an Ed25519 keypair for Web Bot Auth. |

## `vark new PATH`

Scaffold a new site in PATH.

Creates PATH and fills it with starter content, a sample data file, the editable default theme under `themes/vark/`, an example snippet, and a `package.json` for the Mantine islands toolchain. Next: `cd` into PATH and run `vark dev` — when Node is available the first build sets up the islands toolchain with npm (or run `npm install` yourself up front); without Node it builds without the islands bundle.

Examples:

```bash
vark new my-docs   # scaffold ./my-docs, then `cd my-docs`
```

## `vark build`

Build the site to the output directory.

Every build prints a per-phase timing summary — how many pages and components were produced, and how long each phase (discovery, render, island bundling, …) took. The summary goes to stdout and the live `--verbose` progress to stderr, so `vark build > summary.txt` keeps the digest while progress still streams to the terminal. Conditional phases (translation, AI, OpenAPI, island bundling) appear only when they actually run.

A link to a missing page or a missing local image — in any language — always fails the build (the same check `vark link-check` runs without producing output). A link to a missing `#anchor` on a page that DOES exist is warn-only by default (it still lands on the right page); set `links: {strictAnchors: true}` in config to make those fail too. Unknown component references never fail the build: each renders as an HTML comment and is reported as a warning on stderr — usually a typo, a missing `npm install`, or a snippet you haven't created yet.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--bundle / --no-bundle` | `--bundle` | Build the islands JS bundle. |
| `--pdf / --no-pdf` | `--pdf` | Render the whole-site PDF when enabled in config (off in `vark dev`). |
| `--pdf-reuse / --no-pdf-reuse` | `--pdf-reuse` | Reuse the live PDF within `pdf.reuseForDays` instead of re-rendering. --no-pdf-reuse forces a fresh render. |
| `--model TEXT` | — | Override the model for AI features (a gateway model slug). |
| `--translate / --no-translate` | `--no-translate` | Refresh missing + changed translations with Claude (requires AARDVARK_SECRET_KEY). |
| `--retranslate-all` | off | Re-translate every page, overwriting existing translations (implies --translate). |
| `--generators / --no-generators` | `--generators` | Run generation scripts in generators/ (write Markdown pages before the build). |
| `-v, --verbose` | off | Stream per-phase progress as the build runs. |
| `--plain / --no-plain` | auto | Force plain (or rich) output. Auto-detected off a TTY, or under CI / NO_COLOR. |

Examples:

```bash
vark build               # build ./ into ./build
vark build --no-bundle   # skip the islands JS bundle (no Node needed)
vark build -v            # stream per-phase progress to stderr
```

## `vark dev`

Serve the site locally and rebuild on change.

Builds once, serves the result, watches your sources, and live-reloads the browser on every change. Your browser opens to the site automatically when the server starts (pass `--no-open` to skip that). The per-phase timing summary prints on the first build and on every rebuild, so you can see exactly what each change cost. Generation scripts run on every rebuild; pass `--no-generators` for a fully offline loop when a generator's network call is slow or its cache is cold.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--port INTEGER` | `8000` | Port to serve the site on. |
| `--open / --no-open` | `--open` | Open the site in your browser when the server starts. |
| `--generators / --no-generators` | `--generators` | Run generation scripts on each rebuild. Pass --no-generators for a faster, fully offline dev loop when a generator makes a slow/uncached network call. |
| `-v, --verbose` | off | Stream per-phase progress on every rebuild. |
| `--plain` | off | Disable the live dashboard; use plain line-by-line output (also implied off a TTY or under CI / NO_COLOR). |

Examples:

```bash
vark dev               # serve ./ at http://localhost:8000, live-reload
vark dev --port 3000   # serve on a different port
vark dev --no-open     # don't open a browser when the server starts
```

## `vark link-check`

Check internal links, anchors, and images across the site (a build smoke test).

Renders every page in memory and verifies that internal links, `#anchors`, and local images resolve, without writing HTML output — the same check `vark build` runs. Use it for a fast pass/fail in CI or a pre-commit hook. A link to a missing page or a missing local image is printed to stderr and fails (exit non-zero). A link to a missing `#anchor` on a page that DOES exist is a warning by default (still exits 0) — set `links: {strictAnchors: true}` in config to make those fail too. Generation scripts run first so generated pages are checked too; pass `--no-generators` to skip them (e.g. an offline check of a site whose generators call the network).

Image checking covers Markdown images, raw `<img>` / `srcset` / `<video poster>` references, CSS background images, and built-in image-bearing islands. It validates only local files the site would publish from `static/`, `public/`, and theme assets; external and data-URI images are skipped.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--generators / --no-generators` | `--generators` | Run generation scripts before checking (so generated pages are link-checked too). --no-generators is a fully read-only check that writes nothing to content/ — use it in CI when generated pages are already committed/cached, or for an offline check. |
| `--plain / --no-plain` | auto | Force plain (or rich) output. Auto-detected off a TTY, or under CI / NO_COLOR. |

Examples:

```bash
vark link-check   # verify internal links and images without writing output
```

## `vark convert PLATFORM INPUT_PATH OUTPUT_PATH`

Import a docs site built for another platform into an aardvark site.

Reads the source docs at INPUT_PATH (a project built for PLATFORM), translates its navigation, pages, components, and assets into aardvark's format, and writes a buildable site to OUTPUT_PATH — an `aardvark.config.yaml`, `content/*.md`, and `static/` you can immediately `vark build` or `vark dev`. Conversion is best-effort: the summary reports how many pages and assets were converted and flags any construct that didn't map cleanly, so you know exactly what to review by hand.

The supported PLATFORM values are named in the epilog below (and running with an unknown one lists them). OUTPUT_PATH must be empty unless `--force` is given.

| Argument | Possible values |
| --- | --- |
| `PLATFORM` | `docusaurus`, `fern`, `gitbook`, `hugo`, `mintlify`, `mkdocs`, `readme` |
| `INPUT_PATH` | — |
| `OUTPUT_PATH` | — |

| Option | Default | Effect |
| --- | --- | --- |
| `--force` | off | Write into OUTPUT_PATH even if it already exists and is non-empty. The top-level entries this conversion generates (aardvark.config.yaml, content/, static/, and any converter dirs such as openapi/) are replaced wholesale — files left inside content/ or static/ by a previous run do NOT survive, so stale pages/assets can't linger. Other top-level entries the conversion doesn't produce are left untouched. Use an empty directory if you want output to match the source exactly. |
| `-v, --verbose` | off | List each unconverted construct in the summary, not just the count. |

Supported platforms: docusaurus, fern, gitbook, hugo, mintlify, mkdocs, readme.

Examples:

```bash
vark convert mkdocs ./my-mkdocs-site ./my-docs   # import a MkDocs site
vark convert mkdocs ./mkdocs.yml ./my-docs        # point at the config directly
vark convert gitbook ./my-gitbook-repo ./my-docs # import a GitBook repo
vark convert mkdocs ./src ./out --force -v        # overwrite a non-empty ./out
```

## `vark ai-enrich`

Run opt-in build-time enrichment (frontmatter, examples, skills).

Writes generated `description`/`keywords` back into your Markdown frontmatter and, when `ai.skills` is enabled, (re)generates a `SKILL.md` for each planned skill under `skills/` in your project root. This is the only command that touches skills — `vark build` leaves them alone. Runs through Aardvark's metered gateway: the only thing you need to set is your `AARDVARK_SECRET_KEY`.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--model TEXT` | — | Override the model for AI features (a gateway model slug). |
| `--plain / --no-plain` | auto | Force plain (or rich) output. Auto-detected off a TTY, or under CI / NO_COLOR. |

Examples:

```bash
vark ai-enrich   # enrich frontmatter and (re)generate planned skills
```

## `vark author`

Run agentic authoring tasks on your docs — interactively or headless.

With no `--action`, opens a menu of AI-assisted actions — regenerate keywords, refresh a page's description, check and replace dead outbound links, apply a style-guide pass, or chat with a writing agent — that edit your Markdown in place (each change previewed as a diff you confirm before it's written). The same menu is reachable by running bare `vark`.

With `--action <id>` it runs ONE action non-interactively (for CI / automation): `--all` over every page or `--page` for one, previewing diffs unless `--yes` is given to write. This is the mode the gateway's GitHub integration drives on a runner. The styleguide action additionally REQUIRES `--rulesets` — the style ruleset ids to apply, comma-separated in precedence order (list order, first wins conflicts); no other action accepts the flag.

Running an action (or the interactive menu) requires your aardvark **secret** key in `AARDVARK_SECRET_KEY` — the possession-based CLI credential; every call goes through Aardvark's metered gateway, never a model provider directly. (`--list-actions` only prints the headless action ids and needs no key.)

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--model TEXT` | — | Override the model for the agent (a gateway model slug). |
| `--page TEXT` | — | Pre-select a page by content-relative path (e.g. guide/intro.md) or URL, skipping the picker. |
| `--action TEXT` | — | Run ONE authoring action non-interactively across pages (headless / CI). See --list-actions for the available ids. |
| `--all` | off | With --action, run on every page (otherwise pass --page for one). |
| `-y, --yes` | off | With --action, WRITE the changes to disk. Without it, diffs are previewed only. |
| `--rulesets TEXT` | — | With --action styleguide: comma-separated style ruleset ids to apply, highest precedence first (microsoft, google, alex, writegood, proselint, readability). |
| `--list-actions` | off | List the authoring actions that can run headless via --action, then exit. |
| `--plain / --no-plain` | auto | Force plain (or rich) output. Auto-detected off a TTY, or under CI / NO_COLOR. |

Examples:

```bash
vark author                              # open the agentic authoring menu
vark author --page guide/intro.md        # act on one page directly
vark author --list-actions               # list actions runnable headless
vark author --action styleguide --all --rulesets microsoft,google
                                         # preview a style pass on every page
vark author --action keywords --all --yes  # apply, non-interactively (CI)
```

## `vark serve`

Serve a built site (and a live MCP server) for production.

The hardened, headless counterpart to `vark dev`: a single uvicorn/Starlette process that serves the already-built `./build` — honoring the build's own `_headers` / `_redirects` so content types, redirects, and the `ai-config.json` no-store rule match a CDN host — and, unless `--no-mcp`, exposes a stateless MCP server at `/mcp` that wraps the site's docs as read-only tools (search, fetch, list, full corpus).

It does NOT build, watch, or live-reload — run `vark build` first. Designed to sit behind a CDN, which terminates TLS and absorbs the static volume; the per-IP `/mcp` rate limit is a single-process backstop, not a DDoS shield. For full-text MCP search on a site without the on-page search box, set `mcp: true` in `aardvark.config.yaml` before building.

The serve stack (starlette/uvicorn/mcp) ships with every aardvark install — pip, the standalone binary, and the Docker image — so there is nothing extra to install.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--host TEXT` | `0.0.0.0` | Interface to bind (default: all interfaces). |
| `--port INTEGER` | `8080` | Port to serve on. |
| `--workers INTEGER` | `1` | uvicorn worker processes (default 1). |
| `--mcp / --no-mcp` | `--mcp` | Expose the live MCP server at /mcp. |
| `--trusted-proxy CIDR` | — | CIDR(s) of a CDN/load balancer to trust for X-Forwarded-For / CF-Connecting-IP (repeatable). Default: loopback only — so behind a CDN, set this or all clients share one rate-limit bucket. Pass `--trusted-proxy none` to trust no proxy at all (not even loopback; forwarded headers are then never honored). |
| `--mcp-rate-limit INTEGER` | `60` | Per-IP requests/minute for /mcp (default 60), PER WORKER — with --workers N the effective per-IP cap is N x this (no shared store across workers). An invalid value falls back to 60. |

Examples:

```bash
vark serve                       # serve ./build on 0.0.0.0:8080, with /mcp
vark serve --port 80 --no-mcp    # static only, no MCP endpoint
vark serve --trusted-proxy 173.245.48.0/20  # trust a CDN's forwarded IPs
```

## `vark update`

Check whether a newer version of aardvark is available.

Queries the public Homebrew tap for the latest published release. If you're behind, it prints how to upgrade — `brew upgrade aardvark`, or a direct binary download for your Mac (for people who don't use Homebrew). It only checks and reports; it never touches your installation, and degrades gracefully when offline.

Examples:

```bash
vark update   # check for a newer release and how to upgrade
```

## `vark version COMMAND [ARGS]...`

Manage documentation versions (snapshot-in-tree docs versioning).

Declare which subtrees are versioned in your config first (`versions.paths`, e.g. `[/guide]`), then `vark version cut <id>` freezes a copy of those subtrees under `versions/<id>/` and serves it under `/<id>/`. The latest docs stay in `content/` and are served at the site root. See the versioning guide.

Examples:

```bash
vark version cut v1        # freeze the current docs as version v1
vark version list          # show configured versions
vark version remove v1     # delete the v1 snapshot + config entry
```

## `vark web-bot-auth-keygen`

Generate an Ed25519 keypair for Web Bot Auth.

Prints the public key to add under `webBotAuth.keys` in `aardvark.config.yaml` (so `vark build` publishes it at `/.well-known/http-message-signatures-directory`) and the private key to store as a secret for whatever agent signs requests on your site's behalf. aardvark only ever publishes the public directory — it never stores the private key, so save it now; it is not recoverable.

| Option | Default | Effect |
| --- | --- | --- |
| `--json` | off | Emit the keypair as JSON instead of text. |

Examples:

```bash
vark web-bot-auth-keygen          # print a keypair + a paste-ready config snippet
vark web-bot-auth-keygen --json   # machine-readable {privateKey, x, kid}
```

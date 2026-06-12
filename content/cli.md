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

Run vark from your project root. Invoke it as `uv run vark <command>` from a source checkout, or `vark <command>` from the compiled single-file binary.

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
| `vark link-check` | Check internal links and anchors across the site (a build smoke test). |
| `vark ai-enrich` | Run opt-in OpenRouter build-time enrichment (frontmatter, examples, skills). |
| `vark update` | Check whether a newer version of aardvark is available. |

## `vark new PATH`

Scaffold a new site in PATH.

Creates PATH and fills it with starter content, a sample data file, the editable default theme under `templates/`, an example snippet, and a `package.json` for the Mantine islands toolchain. Next: `cd` into PATH, run `npm install`, then `vark dev`.

Examples:

```bash
vark new my-docs   # scaffold ./my-docs, then `cd my-docs`
```

## `vark build`

Build the site to the output directory.

Every build prints a per-phase timing summary — how many pages and components were produced, and how long each phase (discovery, render, island bundling, …) took. The summary goes to stdout and the live `--verbose` progress to stderr, so `vark build > summary.txt` keeps the digest while progress still streams to the terminal. Conditional phases (translation, AI, OpenAPI, island bundling) appear only when they actually run.

Broken internal links — in any language — always fail the build (the same check `vark link-check` runs without producing output). Unknown component references never fail the build: each renders as an HTML comment and is reported as a warning on stderr — usually a typo, a missing `npm install`, or a snippet you haven't created yet.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--bundle / --no-bundle` | `--bundle` | Build the islands JS bundle. |
| `--model TEXT` | — | Override the model for AI features (OpenRouter slug). |
| `--translate / --no-translate` | `--no-translate` | Refresh missing + changed translations with Claude (requires OPENROUTER_API_KEY). |
| `--retranslate-all` | off | Re-translate every page, overwriting existing translations (implies --translate). |
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

Builds once, serves the result, watches your sources, and live-reloads the browser on every change. Your browser opens to the site automatically when the server starts (pass `--no-open` to skip that). The per-phase timing summary prints on the first build and on every rebuild, so you can see exactly what each change cost.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--port INTEGER` | `8000` | Port to serve the site on. |
| `--open / --no-open` | `--open` | Open the site in your browser when the server starts. |
| `-v, --verbose` | off | Stream per-phase progress on every rebuild. |
| `--plain` | off | Disable the live dashboard; use plain line-by-line output (also implied off a TTY or under CI / NO_COLOR). |

Examples:

```bash
vark dev               # serve ./ at http://localhost:8000, live-reload
vark dev --port 3000   # serve on a different port
vark dev --no-open     # don't open a browser when the server starts
```

## `vark link-check`

Check internal links and anchors across the site (a build smoke test).

Renders every page in memory and verifies that internal links and `#anchors` resolve, without writing any output — the same check `vark build` runs. Use it for a fast pass/fail in CI or a pre-commit hook: broken links are printed to stderr and the command exits non-zero.

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--plain / --no-plain` | auto | Force plain (or rich) output. Auto-detected off a TTY, or under CI / NO_COLOR. |

Examples:

```bash
vark link-check   # verify internal links without writing output
```

## `vark ai-enrich`

Run opt-in OpenRouter build-time enrichment (frontmatter, examples, skills).

Writes generated `description`/`keywords` back into your Markdown frontmatter and, when `ai.skills` is enabled, (re)generates a `SKILL.md` for each planned skill under `skills/` in your project root. This is the only command that touches skills — `vark build` leaves them alone. Requires `OPENROUTER_API_KEY` and the `ai` extra (`pip install aardvark[ai]`).

| Option | Default | Effect |
| --- | --- | --- |
| `--root DIRECTORY` | `.` | Project directory (defaults to the current directory). |
| `--model TEXT` | — | Override the model for AI features (OpenRouter slug). |
| `--plain / --no-plain` | auto | Force plain (or rich) output. Auto-detected off a TTY, or under CI / NO_COLOR. |

Examples:

```bash
vark ai-enrich   # enrich frontmatter and (re)generate planned skills
```

## `vark update`

Check whether a newer version of aardvark is available.

Queries the public Homebrew tap for the latest published release. If you're behind, it prints how to upgrade — `brew upgrade aardvark`, or a direct binary download for your Mac (for people who don't use Homebrew). It only checks and reports; it never touches your installation, and degrades gracefully when offline.

Examples:

```bash
vark update   # check for a newer release and how to upgrade
```

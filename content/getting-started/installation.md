---
description: Install aardvark with uv, or build a standalone binary. Node is required at
  build time to bundle the Mantine islands.
icon: fa-solid fa-download
menu: docs
title: Installation
weight: 11
---

# Installation

## Prerequisites

| Tool | Version | Why |
| --- | --- | --- |
| [uv](https://docs.astral.sh/uv/) | ≥ 0.11 | Python environment + runner (installs Python 3.12 for you) |
| Node.js + npm | Node ≥ 18 | Bundles the Mantine/React islands at build time |

Node is only needed to build the islands JS. You can skip it with
`vark build --no-bundle` (components then render as inert placeholders).

## Install with Homebrew (macOS)

The quickest way on a Mac — installs a self-contained binary, no Python or uv required:

```bash
brew tap aardvarkdocs/tap
brew install aardvark
vark --version
```

The Homebrew package is named `aardvark` (after the project), but it installs the CLI as
**`vark`** — shorter to type. (`aardvark` is also installed as an alias, so either name
works.) The one-time `brew tap` registers the formula repository; after that
`brew install aardvark` / `brew upgrade aardvark` work like any Homebrew package.
If you'd rather not tap, the single-command equivalent is
`brew install aardvarkdocs/tap/aardvark`.

Upgrade later with `brew update && brew upgrade aardvark`. Interactive Mantine islands
still need Node at build time (`brew install node`); without it, build with
`vark build --no-bundle`.

## From source (any platform)

```bash
git clone <your fork of this repo> aardvark
cd aardvark
uv sync
```

The CLI is then available as `uv run vark`:

```bash
uv run vark --help
```

## As a standalone binary

Compile the tool to a single executable with Nuitka:

```bash
scripts/build-release.sh dist    # -> dist/vark (single file)
./dist/vark --version
```

For fast local iteration, `scripts/build-binary.sh` builds much quicker (no
`--onefile`/LTO) but produces a folder: `dist/aardvark.dist/vark-dev`.

The binary bundles the default theme and the islands runtime. Node is still
required on the build machine to bundle islands. See [Deployment](/deployment/)
for details.

## Optional: build-time AI

The OpenRouter-powered features are an optional extra — pick any model:

```bash
uv sync --extra ai
export OPENROUTER_API_KEY=sk-or-...
```

See [Build-time AI](/ai-features/).

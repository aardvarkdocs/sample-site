---
description: Install Aardvark via Homebrew or a prebuilt release binary. Node is required at
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
| Node.js | Node ≥ 20.19 | Runs esbuild and the island prerenderer at build time |

The `vark` binary is self-contained — it ships its own Python runtime **and the
islands JS toolchain** (React, Mantine, esbuild, and everything else its built-in
components bundle with), so there's nothing else to install and nothing to
download: a project with no `node_modules` of its own gets the shipped toolchain
staged automatically on its first build. Node is the one prerequisite, used to run
that toolchain. You can skip it with `vark build --no-bundle` (components then
render as inert placeholders). npm is only involved if your `package.json` asks
for packages or versions Aardvark doesn't ship — then the first build runs
`npm ci`/`npm install` for you (opt out with `AARDVARK_NO_AUTO_NPM`), and a
`node_modules` you install yourself always takes over from the shipped toolchain.

## Install with Homebrew (macOS)

The quickest way on a Mac — installs a self-contained binary, no Python required:

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

## Windows

Download the prebuilt Windows binary from the
[latest release](https://github.com/aardvarkdocs/homebrew-tap/releases/latest):

1. Grab `aardvark-<version>-windows-x86_64.zip`.
2. Unzip it and move `vark.exe` somewhere on your `PATH` (e.g. a folder you've added under
   **Settings → System → About → Advanced system settings → Environment Variables**).
3. Open a new terminal and run `vark --version`.

The binary is **unsigned**, so the first launch may show a SmartScreen warning ("Windows
protected your PC") — click **More info → Run anyway**. As on every platform, Node.js is only
needed at *site*-build time for interactive islands; `vark build --no-bundle` works without it.

## Linux

Download the matching tarball from the
[same release page](https://github.com/aardvarkdocs/homebrew-tap/releases/latest)
(`aardvark-<version>-linux-x86_64.tar.gz` or `…-linux-aarch64.tar.gz`):

```bash
curl -fsSL https://github.com/aardvarkdocs/homebrew-tap/releases/download/v<version>/aardvark-<version>-linux-x86_64.tar.gz \
  | tar xz && sudo mv vark /usr/local/bin/
vark --version
```

The prebuilt binary is **glibc-linked** (not musl/Alpine). Release tarballs are built against
**glibc ≥ 2.28**, so they run on every current distro — RHEL 8+, Debian 10+, Ubuntu 20.04+,
Fedora, Amazon Linux 2023. Node.js is only needed at *site*-build time for interactive islands.

The binary bundles the default theme and the islands runtime, so it works out of
the box. Node is still required on the build machine to bundle interactive
islands — see [Deployment](/deployment/) for details.

## AI features

Aardvark's AI features are built into the binary — there's nothing extra to
install. Turn them on in `aardvark.config.yaml` (the `ai:` block) and provide a
key. See [AI features](/ai/) for the overview, [Build-time AI](/ai-features/) for
the build-time enrichment options, and [Cloud gateway](/ai-gateway/) for the
hosted reader assistant.

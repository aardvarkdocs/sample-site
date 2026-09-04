---
title: Aardvark 0.4.1 release roundup
description: The 0.4.1 fixes in one read, plus the 0.4.0 release behind them — an islands toolchain that ships with Aardvark, prerendering on by default, and a deploy command.
date: 2026-09-01
image: /landscape.jpg
aliases:
  - /blog/vark-0-9-release-roundup/
taxonomy:
  - name: blog
    leftnav: dates
    tags: [release, cli]
    authorName: The Aardvark team
    authorAvatar: /favicon.svg
    badgeText: Release
    tagCloud: true
---

# Aardvark 0.4.1 release roundup

0.4.1 landed on 1 September. It is a small fix release sitting on top of 0.4.0, which changed
how a site gets built more than any release since islands themselves. Here are both, in one
read — the full timeline is always on the [changelog](/changelog/).

## What 0.4.1 fixes

**Windows has its binary back.** 0.4.0 published macOS and Linux but no Windows build: the
release step that vendors the islands toolchain launched `npm` under its bare name, and
Windows resolves a bare command without consulting `PATHEXT`, so it never found `npm.cmd` and
the build failed before producing anything. npm is resolved to an absolute path now. macOS and
Linux were never affected, and 0.4.0's binaries for them stand — but if you are on Windows,
0.4.1 is your upgrade from 0.3.3.

**The reader assistant stops guessing at failures.** All four gateway rejections used to say
"This conversation is too long", which was true of none of them — including a rejected
attachment, where the reader was told to start a new chat rather than to drop a file. They are
classified by their code now. The panel's attachment, install, zoom, fullscreen and
clear-conversation controls, and its whole "Copy page" menu, are registered for translation
too, so a localized site stops rendering them in English.

Two more, quickly: `{% raw %}{% combobox %}{% endraw %}` keeps its `attr={…}` pairs when it
sits inside another component (it forwards a ref onto its own input, so it was never one of
the islands with nothing to attach to), and a Cloudflare preview whose metadata lookup fails
now says so instead of leaving a degraded build looking deliberate.

## The 0.4.0 headline: nothing to install

**Aardvark ships the entire islands JS toolchain.** A release binary carries a digest-pinned
store of everything the islands need — React, the `@mantine/*` packages the built-ins use, the
community components, the Twoslash render dependencies, esbuild and its native binaries. A
project with no `node_modules` of its own gets that store staged into `.aardvark-cache/`,
verified against recorded digests, never executed, entirely offline. **Node is still the one
build-machine prerequisite**: the toolchain ships with Aardvark, but something has to run it.

Your own tree always wins. A real `node_modules` means the store never serves and any copy
Aardvark staged earlier is removed, so it can't shadow yours; a `package.json` asking for
something the store doesn't carry falls back to the automatic `npm ci`/`npm install` that was
there before. The [installation page](/getting-started/installation/) has the whole rule.

**Prerendering is on by default.** A site with no `islands` block now bakes each SSR-capable
island's rendered HTML into its static pages, so crawlers and no-JS readers see real markup and
the first paint doesn't shift — then the client hydrates that markup in place. The browser-only
ones — most community widgets, the native map, and any component library configured without SSR
— mount on the client instead. `islands: {ssr: false}` opts out and keeps the client bundle.

**`vark deploy` publishes from the command line.** It runs the same full production build as
`vark build` and uploads the output to Aardvark cloud managed hosting — no connected
repository needed. Managed hosting serves a site on its custom domain, so the deploy prints a
URL once you have attached one; before that it uploads and stores the build without a
reachable address. It authenticates with your secret key in
`AARDVARK_SECRET_KEY`, an interrupted deploy resumes rather than restarting, and a site that
*is* connected to a GitHub repository is refused before the build runs rather than after.

**The repo browser reads GitLab, and stops growing without limit.**
{% raw %}`{% gitfolder %}`{% endraw %} and `github=` fences accept `https://gitlab.com/…` URLs
on the same anonymous, token-free path they use for GitHub, and every widget now embeds
previews up to a `gitfolder.maxEmbedBytes` budget (2 MiB by default) — past that, files stay
listed, linked and in the Download ZIP, and the build names what it skipped.

One upgrade note that is easy to miss: the **MCP Server Card is now written only when
`mcp: true` and a `baseUrl` are set**. Every build used to publish one, advertising an endpoint
a static deploy would never answer. If you were relying on the card, set those two.

Upgrade with your package manager of choice, and if anything regresses, the
[changelog](/changelog/) is the quickest way to see what moved.

---
title: Aardvark ships the islands JS toolchain — nothing to install
date: 2026-08-30
version: "0.4.0"
taxonomy:
  - name: changes
    tags: [build, components]
nav: false
noindex: true
---

# Aardvark ships the islands JS toolchain — nothing to install

A fresh site builds its interactive components with no `npm install` and nothing downloaded.
Release binaries carry a digest-pinned store of the whole dependency tree the islands need —
React, every `@mantine/*` package the built-ins use, the community-component packages, the
Twoslash render dependencies and esbuild with its native binaries. When a project has no
`node_modules` of its own, the build stages that store into `.aardvark-cache/node_modules/`,
extracted and checked against a recorded sha256, never executed, and entirely offline.

**Node.js is still the one build-machine prerequisite** — the toolchain ships with Aardvark,
but something has to run it. See [Installation](/getting-started/installation/) for the
version floor.

Your project always wins, wholesale. A real `node_modules` (or a workspace's hoisted tree)
means the store never serves and any copy Aardvark staged earlier is removed, so it can't
shadow yours. And a `package.json` asking for packages or versions the store doesn't carry
falls back to the existing automatic `npm ci`/`npm install` rather than being quietly served
different versions. A source checkout — or a binary built without the vendoring step — keeps
that automatic-npm behavior as before.

This generalizes what the [map runtime](/components/extras/map/) did for one component: it
ships beside the store, so `{% raw %}{% map %}{% endraw %}` no longer asks you to install
anything either.

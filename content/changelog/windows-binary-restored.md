---
title: Windows binaries are back
date: 2026-09-01
version: "0.4.1"
taxonomy:
  - name: changes
    tags: [build, cli]
nav: false
noindex: true
---

# Windows binaries are back

0.4.0 published macOS and Linux builds but no Windows one. The release step that vendors the
islands JS toolchain launched `npm` under its bare name, and Windows resolves a bare command
without consulting `PATHEXT` — so it never found `npm.cmd`, and the build failed before
producing anything. npm is resolved to an absolute path once now, and every call uses it.

macOS and Linux were never affected, and 0.4.0's binaries for them stand. If you are on
Windows, 0.4.1 is the upgrade from 0.3.3.

See [Installation](/getting-started/installation/).

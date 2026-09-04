---
title: Generate the CLI reference from `vark --help`
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [cli, docs]
nav: false
noindex: true
---

# Generate the CLI reference from `vark --help`

The **CLI reference** page is generated straight from `vark --help`, so every flag and
subcommand stays in lockstep with the code:

- No hand-maintained option tables to drift
- Each subcommand is documented from its own `--help`, examples included
- The page's front matter is preserved; only its body is rewritten, so titles, nav
  placement and redirects survive a regeneration

The generated page is a build artifact of the release scripts rather than something to edit
by hand — change the command in the CLI and the docs follow. See the
[CLI reference](/cli/) for the full command list.

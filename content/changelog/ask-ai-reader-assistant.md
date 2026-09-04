---
title: Ask-AI reader assistant
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [ai, search]
nav: false
noindex: true
---

# Ask-AI reader assistant

An optional [**Ask AI**](/ai-assistant/) assistant answers reader questions grounded in your
docs, backed by a metered cloud gateway: a reader asks in natural language, and the answer
comes from your published pages, citing the ones it used.

Turn it on with `ai.assistant.enabled: true` plus your **public** gateway key
(`aardvark_live_…`), supplied at build time as the `AARDVARK_KEY` environment variable —
never the secret key, which is why a build handed one aborts rather than baking it into a
static site. Every answer is metered in real dollars against the account behind that key, so
size the key's spend cap to the exposure you accept; a `:free` model slug always answers at
$0 if you want to run the panel without spending anything.

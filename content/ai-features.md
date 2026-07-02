---
description: Opt-in, cached AI features — generate frontmatter, example API
  responses, and Claude Code skills from your docs, via the aardvark gateway.
icon: fa-solid fa-microchip
menu: ai
title: Build-time AI
weight: 30
---

# Build-time AI

aardvark has optional, build-time AI features that run through the metered **aardvark
cloud gateway**, so you can use **any model it proxies**. They are **off by default**, run
only when explicitly enabled, and their results are **cached** by content hash in
`.aardvark-cache/ai/` — so unchanged content never re-calls the API and builds stay fast
and deterministic.

## Enable

1. Set a key (the AI features are built into the binary — nothing extra to install):

   ```bash
   export AARDVARK_SECRET_KEY=aardvark_secret_...
   ```

2. Turn on the features you want in `aardvark.config.yaml`, and pick a model:

   ```yaml
   ai:
     frontmatter: true   # generate missing description + keywords
     examples: true      # example API responses for OpenAPI pages
     skills: true        # plan + generate skills/ (on demand, via vark ai-enrich)
     model: "~anthropic/claude-sonnet-latest"   # any model the gateway proxies; "latest" alias needs the leading ~
   ```

   Any run can override the configured model with `--model <slug>` (e.g.
   `vark build --model "~anthropic/claude-sonnet-latest"`). If the key or the SDK is
   missing, the features simply no-op.

## What each does

- **`frontmatter`** — for pages missing `description`/`keywords`, generates them
  and fills the page metadata (used in `<meta>` tags and `llms.txt`).
- **`examples`** — generates a realistic example response for each OpenAPI
  operation and shows it on the [reference page](/api/).
- **`skills`** — plans a set of Claude Code "skills" from your docs, then generates a
  full `SKILL.md` for each (grounded in the pages it cites) under `skills/<name>/` in
  your project root. Runs **only** via `vark ai-enrich` (below), not during `vark build`.
  `vark build` then publishes whatever is in `skills/` as an
  [Agent Skills Discovery index](/llms-and-sitemap/) at
  `/.well-known/agent-skills/index.json`.

## Run on demand

`vark ai-enrich` runs enrichment outside a full build — it writes generated
`description`/`keywords` back into your source Markdown frontmatter and, if
`ai.skills` is on, (re)generates the `skills/` directory. Skills live outside the
build output, so a normal `vark build` never regenerates or wipes them — they're
refreshed only when you run `ai-enrich`.

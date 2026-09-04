---
description: Opt-in, cached AI features — generate frontmatter, example API
  responses, and Claude Code skills from your docs, via the Aardvark gateway.
icon: fa-solid fa-microchip
menu: ai
title: Build-time AI
weight: 30
---

# Build-time AI

Aardvark has optional, build-time AI features that run through the metered **Aardvark
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
   `vark build --model "~anthropic/claude-sonnet-latest"`); with neither set, the default
   is `~anthropic/claude-sonnet-latest`. Without a key the features stay dormant — the
   build runs exactly as if they were off. A key that isn't a secret key (a public
   `aardvark_live_…` key, for example) is refused with a warning and enrichment is
   skipped rather than failing the build.

{% callout severity="info" title="Good to know" %}
The gateway endpoint is baked into Aardvark — there is no config key or environment variable to
point the build-time features at another endpoint. `AARDVARK_SECRET_KEY` is the only thing to set,
and every call is metered against that key's account at the published [per-model
rates](/pricing/models/).
{% endCallout %}

## What each does

- **`frontmatter`** — for pages missing `description`/`keywords`, generates them
  and fills the page metadata (used in `<meta>` tags and `llms.txt`). During `vark build`
  the generated values live in the build output only — your source files are untouched;
  run `vark ai-enrich` (below) to write them back into the frontmatter.
- **`examples`** — generates a realistic example response for each OpenAPI
  operation and shows it on the [reference page](/api/) under the operation's success
  (2xx) responses. An example authored in the spec — on the response or on its schema —
  always wins; the generated one fills in only where the spec ships none. One example is
  generated per operation, so an operation documenting both `200` and `201` shows the same
  generated body under each.
- **`skills`** — plans a set of Claude Code "skills" from your docs, then generates a
  full `SKILL.md` for each (grounded in the pages it cites) under `skills/<name>/` in
  your project root. Runs **only** via `vark ai-enrich` (below), not during `vark build`.
  `vark build` then publishes whatever is in `skills/` as an
  [Agent Skills Discovery index](/llms-and-sitemap/) at
  `/.well-known/agent-skills/index.json`.

Every result is cached under `.aardvark-cache/ai/`, keyed by a hash of the input each feature
reads: a page's body for `frontmatter`, the operation for `examples`, and a skill's plan entry
plus the text of the pages it cites for `skills`.

{% callout severity="warning" title="What the cache key does not cover" %}
The key is narrower than the prompt, so some edits don't invalidate a cached result:

- **`frontmatter`** keys on the page **body** only — retitling a page without touching its body
  reuses the old description and keywords.
- **`examples`** keys on the **operation** only — an operation that `$ref`s a shared
  `components.schemas` entry keeps its cached example when only that schema changes.
- **`skills`** keys on each cited page's text up to a fixed context budget (and the plan itself on
  a prefix of every page), so an edit far down a long page may not trigger a regeneration.

Delete `.aardvark-cache/ai/` (or just the feature's subdirectory) to force a fresh run.
{% endCallout %}

## Run on demand

`vark ai-enrich` runs enrichment outside a full build — it writes generated
`description`/`keywords` back into your source Markdown frontmatter and, if
`ai.skills` is on, (re)generates the `skills/` directory. A page that already has both a
`description` and `keywords` is skipped; on a page missing only one of them, only the
missing field is written. Skills live outside the build output, so a normal `vark build`
never regenerates or wipes them — they're refreshed only when you run `ai-enrich`, and
files already in `skills/` are left in place rather than deleted.

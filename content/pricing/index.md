---
title: Pricing
navtitle: Pricing
description: >-
  Aardvark is free to self-host. AI use and Docs Quality Checks runner time draw from
  one prepaid balance at published rates.
icon: fa-solid fa-tags
menu: pricing
weight: 1
---

Aardvark is **free to use, forever**: prebuilt binaries for macOS, Linux, and Windows,
self-hosting anywhere at no cost, and an open contribution mirror for these docs. There is
no platform fee, no tier to pick and no seat to count — invite as many teammates as you like.
Aardvark charges for two things, both in **dollars** (never opaque credits) and both from one
prepaid balance: the **AI you actually use**, metered per token, and — only if you connect a
repository — the runner minutes that [Docs Quality Checks](/github-automation/) consume.

{% cardGrid cols=3 %}
{% card title="Free to self-host" icon="sparkles" accent="gray" href="/getting-started/installation/" cta="Install the CLI" %}
**$0** — every build, every feature

- Prebuilt binaries for macOS, Linux, and Windows
- Every component and theme, agent discovery (`llms.txt`, Markdown-for-Agents, the skills index), whole-site PDF
- Dashboard **Insights**, conversation analytics, and **Content Reach** — all included
- Host the static `build/` anywhere, or run `vark serve`
{% endCard %}
{% card title="AI, metered" icon="calculator" accent="grape" href="/pricing/models/" cta="See model rates" %}
**One published rate** — {% data.pricing.rate %}× the model's OpenRouter list price

- Billed per token, in dollars, at the rate on [the pricing table](/pricing/models/)
- Supported models are OpenRouter's auto-updating `latest` aliases — the gateway serves no other model id
- Reader answers, build-time AI, `vark author` runs, and Insights passes all meter the same way
- Runs on Aardvark's managed keys — nothing of yours to create, rotate, or secure
{% endCard %}
{% card title="Prepaid balance" icon="credit-card" accent="violet" href="https://gateway.aardvarkdocs.com/dashboard" cta="Open the dashboard" %}
**You fund it, you own it** — serving stops when the balance is gone; only the requests already in flight finish and bill what they used

- Save a card through hosted Stripe Checkout (card details never touch Aardvark)
- **Top up now** for a one-off charge, or turn on **auto top-up** with your own amount and threshold ($10 floor)
- Remove the card any time; the balance stays yours
- Operators can also credit a balance directly
{% endCard %}
{% endCardGrid %}

Every supported model's rate and estimated cost per answer: **[the pricing table](/pricing/models/)**.

## Safety limits

A metered feature has to be impossible to run away with. Four guardrails are on for every
account, and each is documented exactly:

- **The cutoff** stops serving AI when the balance is exhausted. It is bounded, not exact: the
  requests already in flight finish and bill their actual cost, so keep a small buffer for a
  hard ceiling; the concurrency cap keeps that set small — [the docs say so](/support/spend-cutoff-precision/).
- **An unusual-usage brake** pauses AI when a day's spend spikes far above your normal
  pattern — a scraped widget, a CI loop — and [one click resumes it](/support/unusual-usage-pause/).
- **A concurrency cap** bounds how many requests can start before their usage is billed, so a
  burst gets a brief `429` with a `Retry-After` instead of [a bill](/support/concurrent-request-limits/).
- **Your balance is always yours.** A declined top-up or a removed card never spends it —
  [it just stops adding to it](/support/prepaid-balance-safety/).

[Docs Quality Checks](/github-automation/) runner compute — the authoring runs that open pull
requests against your repository — is a separate meter billed to the same prepaid balance: each
run's runner time, rounded up to whole minutes, at {% data.pricing.rate %}× GitHub's standard
2-core Linux runner price (today ${% data.pricing.compute_per_minute_usd %} a minute, so
**${% RunnerMinutePrice %} per started minute**), shown per run in the dashboard next to the
run's AI spend. So there is still one number to watch.

## FAQ

Billing is designed to be predictable and never to surprise you. Every question — and its
exact answer — lives in the searchable support knowledge base.

{% card title="Browse the support knowledge base" icon="lifebuoy" href="/support/" cta="Visit support" %}
Top-ups, auto top-up, the spend cutoff, concurrent-request limits, and removing a card —
every billing question answered, straight from the team.
{% endCard %}

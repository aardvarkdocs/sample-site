---
title: AI assistant & analytics
navtitle: AI assistant
description: A built-in "Ask AI" chat panel for your readers, and a full conversation-analytics
  dashboard behind it — Top Questions, Coverage Gaps, intent tags, search, digests, and more.
icon: fa-solid fa-robot
menu: ai
weight: 10
---

# AI assistant & analytics

aardvark ships a **native "Ask AI" assistant** for your readers, and behind it a full
**conversation-analytics dashboard** that turns every question into product insight. It is a
first-party feature — the assistant calls the [aardvark cloud gateway](/ai-gateway/), which proxies
the model, meters the spend, and records the conversation for analysis. There is no third-party
widget to embed and no separate vendor to sign up with.

This page has two halves: the **reader's assistant** (what visitors see) and the **analytics
dashboard** (what you see). The [cloud gateway](/ai-gateway/) page covers the billing, metering, and
Stripe setup that sit underneath both.

{% callout severity="info" title="One assistant, one bill" %}
The reader chat **and** every analytics model pass (clustering, per-turn analysis, the natural-language
analytics assistant) are metered to **your** gateway account at the gateway's rate. You pay to analyze
your own conversations; a depleted account simply pauses analysis rather than breaking. See
[How it's billed](#how-its-billed).
{% endCallout %}

## The reader's assistant

A floating **"Ask AI"** panel sits on every page. Readers ask a question in natural language; the
assistant answers from **your content**, citing the pages it used, and they can rate each answer with
👍 / 👎. It can read the whole corpus inline on the first turn (for a fast, zero-fetch answer) or
navigate page-by-page, and it accepts **file attachments** (images, PDFs, text/code) when you leave
them on.

![The built-in "Ask AI" reader panel answering a question with cited sources](/img/assistant/ai-assistant-panel.png)

### Enable it

```yaml
ai:
  assistant:
    enabled: true
    model: "~anthropic/claude-sonnet-latest"   # any model the gateway proxies; "latest" alias needs the leading ~
```

The site also needs your **public** gateway key baked in as the `AARDVARK_KEY` environment variable at
build time (`aardvark_live_…`, never the secret key — it ships in the static site). Provisioning a key
and funding the account live on the [cloud gateway](/ai-gateway/) page.

### Options

All optional except `enabled`:

| Key | Default | What it does |
|-----|---------|--------------|
| `enabled` | `false` | Master switch for the reader panel. |
| `model` | `~anthropic/claude-sonnet-latest` | The model the assistant answers with (must be vision/file-capable if you keep attachments on). |
| `gateway` | the managed gateway | Base URL of the gateway Worker (include the `/v1` suffix). Point it at your own gateway to self-host. |
| `reasoning` | model default | Reasoning control for a reasoning-capable model (`enabled` / `effort`). |
| `attachments` | on | Reader file uploads — see [Reader attachments](/ai-gateway/#reader-attachments) on the gateway page for the caps and cost notes. |
| `store_history` | `true` | Posts each finished turn to the gateway so it appears in your dashboard **and feeds the analytics below**. |
| `inlineContextMaxTokens` | model-derived | First-turn inline budget; `0` forces page-by-page navigation. |
| `prompt` | server-side | The system prompt is **not** baked into the public site — set it as the key's `system_prompt` when you mint the key. |

{% callout severity="warning" title="store_history feeds the analytics" %}
The entire analytics dashboard is built from **stored transcripts**. Leaving `store_history` on (the
default) is what populates Insights, Conversations, Top Questions, and the rest. Set it to `false` and
the assistant still works, but the dashboard has nothing to analyze.
{% endCallout %}

## The analytics dashboard

Every stored conversation feeds an analytics suite on the **gateway dashboard** — open
`gateway.aardvarkdocs.com/dashboard` (or your own gateway host) and sign in via the **magic link**
emailed to the account owner. (The dashboard is email-login only; the `aardvark_secret_…` key is the
API/CLI credential — it authenticates the [programmatic endpoints](#programmatic-export) below, not
the dashboard UI.) Cron passes on the gateway classify each answer, cluster the corpus into themes,
and surface where your docs fall short.

### Insights — the overview

The **Insights** tab is a KPI overview over a 7 / 30 / 90-day window: total **conversations** and
**answers**, the reader **satisfaction rate** (the 👍 share of votes), the **uncertainty rate**, an
**answer-quality** distribution bar (every answer is graded `confident` / `unconfident` / `not_found`
/ `doc_gap` from the model's own reasoning trace), a **conversation-volume** series, the **language**
mix, and a **support-deflection** rate.

![The Insights tab: engagement KPIs, the answer-quality distribution, and the volume chart](/img/assistant/insights-overview.png)

### Top Questions

A cron pass clusters recent conversations into broad **themes** — each a label, an approximate
conversation count, example questions, and a trend chip versus the prior period. Use it to see what
readers actually come for, and export the list to CSV.

![Top Questions clustered into themes with counts and trend chips](/img/assistant/top-questions.png)

### Coverage Gaps

The companion pass clusters the **uncertain** answers — the questions your docs handle poorly — into
recurring topics. Each gap card carries a **Finding** (what's missing or confusing) and a concrete
**Recommendation**. A **Copy for LLM** button drops the finding + recommendation onto your clipboard
to paste into an LLM or issue, you can set a **triage status**, and you can **export the gap as a
ready-to-paste GitHub / Linear / Jira issue** — the status is keyed to a stable label hash, so it
survives the next re-cluster.

![Coverage Gaps, each with a finding, a recommendation, and a triage status menu](/img/assistant/coverage-gaps.png)

### Conversations

The **Conversations** tab is the raw record: every conversation with its per-turn **verdict**, an
**intent** auto-label, and any **custom tags** you've defined (up to 20 per account — you give a tag a
name and a description, and the analysis pass applies it, backfilling existing conversations). A rich
filter bar narrows by full-text **search**, verdict, vote, intent, tag, and date range, and a
**needs-attention** view surfaces the answers worth reading. Open any conversation for the full
transcript, and **export** the filtered set to CSV (formula-injection-guarded).

![The Conversations tab with filters, intent labels, and custom tags](/img/assistant/conversations.png)

### Source Analytics

Which of your pages are doing the work: **most-cited sources**, plus the citations that show up
disproportionately alongside **down-voted** answers — a signal that a popular page may be misleading
rather than helpful.

### Periods, trends & the email digest

Snapshots are versioned by **period** — week, month, or quarter — so you can navigate back through
history and every cluster shows a **trend** against the prior period. Opt in to a **weekly or monthly
email digest** (from the dashboard) and the gateway emails the account owner a summary of the latest
Top Questions, new Coverage Gaps, and headline metrics.

### Ask your analytics

A natural-language panel answers questions about your own Insights data — "what are readers most
confused about this month?", "which pages get cited with thumbs-down?" — so you don't have to read
every chart. Like the clustering passes it's metered to the account and rate-limited.

![The "Ask your analytics" natural-language panel](/img/assistant/analytics-assistant.png)

### Programmatic export

For pulling analytics into your own pipelines, two dashboard-authed read APIs:

- **`GET /v1/activity`** — aggregate stats (conversations, answers, satisfaction, verdict
  distribution, deflection, languages) over a `?days=` window.
- **`GET /v1/threads`** — a keyset-paginated full-conversation export with `?since=` **incremental
  sync**, so a follow-up pull returns only what's new.

## How it's billed

The reader assistant uses your configured `model` (a capable chat model by default). The **analytics**
passes deliberately default to a cheap, large-context model (`~google/gemini-flash-latest`) so
classifying and clustering a corpus stays inexpensive; an operator can override each pass
independently. Every call — reader chat and analytics alike — rides the gateway's managed upstream key
and is **metered to your account** at the published rate. Spend can't run away: each pass is bounded
per cron tick and per account, and an account with no balance is skipped until it's funded again. Full
pricing, funding, and Stripe details are on the [cloud gateway](/ai-gateway/) page.

## Privacy

The analytics are deliberately **leaner on identity than third-party tools**: there is no durable
per-visitor id, so the dashboard reports **active conversations**, never a "unique users" count.
Stored transcripts keep the **question and answer text** (to analyze), not attachment bytes, and they
age out on the gateway's retention schedule along with everything derived from them (verdicts, tags,
cited-source events).

## Related

- [Cloud gateway](/ai-gateway/) — the metering proxy behind the assistant: prepaid balances, Stripe
  card-on-file, auto-top-up, and reader attachments.
- [Build-time AI](/ai-features/) — opt-in features that run during the build (frontmatter, example API
  responses, skills), also via OpenRouter.
- [Self-hosting & MCP](/self-hosting/) — running a built site, and serving it over MCP.

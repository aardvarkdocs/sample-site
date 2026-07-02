---
title: AI Features
navtitle: Overview
description: Every AI and agent-enabling capability in one place — the Ask AI assistant,
  the cloud gateway, build-time enrichment, MCP/WebMCP, and agent discovery.
icon: fa-solid fa-robot
menu: ai
weight: 1
---

# AI features

aardvark is built for two audiences at once — the people reading your docs and the agents
acting on them. The reader features add an assistant; the agent features make your site
discoverable, queryable, and verifiable by automated clients. Everything is in one place
here.

## For readers

{% cardGrid cols=3 %}
{% card title="AI assistant" icon="robot" accent="grape" href="/ai-assistant/" cta="Add Ask AI" %}
A built-in "Ask AI" chat panel for your readers — plus a full analytics dashboard (Top Questions, Coverage Gaps, and more) for you.
{% endCard %}
{% card title="Cloud gateway" icon="cloud" accent="grape" href="/ai-gateway/" cta="Meter usage" %}
The managed metering proxy behind the built-in assistant — a prepaid balance with Stripe card-on-file and auto-top-up.
{% endCard %}
{% card title="Build-time AI" icon="sparkles" accent="grape" href="/ai-features/" cta="Enrich the build" %}
Opt-in, cached OpenRouter features — generate frontmatter, example API responses, and Claude Code skills from your docs.
{% endCard %}
{% endCardGrid %}

## For agents

{% cardGrid cols=2 %}
{% card title="Self-hosting & MCP" icon="server" accent="teal" href="/self-hosting/" cta="Serve over MCP" %}
Run `vark serve` to expose a live MCP server and serve each page as Markdown via content negotiation — the same tools work in the browser through WebMCP.
{% endCard %}
{% card title="Agent readiness" icon="checklist" accent="teal" href="/agent-readiness/" cta="Score well" %}
A checklist for making your site agent-ready — what aardvark publishes on every build, and the few steps only you can do.
{% endCard %}
{% card title="Agent discovery" icon="compass" accent="teal" href="/agent-discovery/" cta="Be discoverable" %}
Always-on discovery endpoints — an MCP Server Card, OAuth/OIDC metadata, `auth.md`, and DNS-AID records — emitted by every build.
{% endCard %}
{% card title="Web Bot Auth" icon="shield" accent="teal" href="/web-bot-auth/" cta="Prove identity" %}
Publish a key directory so your site can identify itself when an agent sends signed requests on its behalf.
{% endCard %}
{% endCardGrid %}

{% callout severity="info" title="More agent-facing output lives under Deploy" %}
The files agents read most — `llms.txt`, `llms-full.txt`, and the Agent Skills index — are written by every build; see [Generated files](/llms-and-sitemap/). The `vark ai-enrich` and `vark web-bot-auth-keygen` commands are in the [CLI reference](/cli/).
{% endCallout %}

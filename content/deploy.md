---
title: Deploy Aardvark
navtitle: Overview
description: Everything you need to run an aardvark site in production — host the static
  build, serve it yourself, and know what every build generates.
heading: Deploy
heading-icon: fa-solid fa-server
icon: fa-solid fa-server
menu: docs
weight: 60
---

# Deploy aardvark

`vark build` writes a plain static site to `build/` — no server required. Host that
directory on any static host, or run it yourself with the bundled `vark serve`. This section
collects everything about shipping aardvark to production.

{% callout severity="info" title="New here?" %}
Install the CLI first — see [Installation](/getting-started/installation/) — then come back to ship what you've built.
{% endCallout %}

{% cardGrid cols=3 %}
{% card title="Deployment" icon="rocket" accent="grape" href="/deployment/" cta="Host the build" %}
Hand the static `build/` directory to any host — Cloudflare Pages, Netlify, Vercel, GitHub Pages, S3 — or ship aardvark itself as one compiled binary.
{% endCard %}
{% card title="CLI reference" icon="terminal-2" accent="grape" href="/cli/" cta="Every command" %}
`build`, `dev`, `serve`, `link-check`, and the rest — and the exact flags each command takes.
{% endCard %}
{% card title="Generated files" icon="file-export" accent="grape" href="/llms-and-sitemap/" cta="What a build writes" %}
`sitemap.xml`, `robots.txt`, `_redirects`, `_headers`, per-page Markdown, the search index, and the whole-site PDF.
{% endCard %}
{% endCardGrid %}

## Run a live server

Need an origin process — for the MCP endpoint, `Accept: text/markdown` negotiation, or a
CDN to sit in front of? That's `vark serve`. It lives under **AI Features** because the
same process also exposes your docs to agents over MCP.

{% cardGrid cols=1 %}
{% card title="Self-hosting & MCP" icon="server" accent="grape" href="/self-hosting/" cta="Run vark serve" %}
The hardened `vark serve` process — static plus a live MCP server — packaged as a Docker image behind a CDN. Documented under [AI Features](/ai/).
{% endCard %}
{% endCardGrid %}

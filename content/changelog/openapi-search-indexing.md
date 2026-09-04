---
title: Index OpenAPI descriptions for search
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [search, openapi]
nav: false
noindex: true
---

# Index OpenAPI descriptions for search

Titles, summaries and descriptions from your [OpenAPI spec](/components/extras/openapi/) —
the API blurb, operation summaries, and parameter, response, schema and security-scheme
descriptions — are part of the [search](/search/) index, so a reader searching for an
endpoint's behavior lands on the right reference section, not just on pages that happen to
mention it in prose.

That prose lives only in the reference island's props and is rendered in the browser, so
nothing in the page's static HTML would otherwise carry it. Operations are indexed by
`operationId` and `METHOD /path` as well, and each result deep-links to the operation's own
anchor rather than to the top of the page.

---
title: The MCP Server Card is written only when MCP is on
date: 2026-08-30
version: "0.4.0"
taxonomy:
  - name: changes
    tags: [build, search]
nav: false
noindex: true
---

# The MCP Server Card is written only when MCP is on

Every build used to write `/.well-known/mcp/server-card.json` advertising a `{baseUrl}/mcp`
endpoint — even on a purely static deploy where nothing would ever answer there. The card, its
`_headers` content-type and CORS rule, and its homepage `Link:` entry now ride the same gate as
the other MCP surfaces: `mcp: true` in `aardvark.config.yaml` together with a `baseUrl`.

**If you relied on the card, set those two after upgrading** — a site that never opted in was
advertising an endpoint it did not serve, and now correctly says nothing. A server card you
ship by hand at `static/.well-known/mcp/server-card.json` still wins, gate or no gate, and
still gets its `_headers` rule.

See [Agent discovery](/agent-discovery/).

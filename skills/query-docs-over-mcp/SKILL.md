---
name: query-docs-over-mcp
description: Query an aardvark documentation site over its built-in MCP server. Use when an agent needs to search or fetch documentation pages programmatically.
---

# Query aardvark docs over MCP

1. Start the site with `vark serve`. It exposes a live MCP endpoint at `/mcp`
   alongside the static files (pass `--no-mcp` to turn it off).
2. Point an MCP client at `https://<your-site>/mcp` to discover the documentation
   tools the server advertises.
3. Use the search tool to find relevant pages, then fetch a page to read its full
   Markdown content.
4. For a static overview without MCP, read `/llms.txt` (a linked index of every
   page) or `/llms-full.txt` (the whole corpus concatenated as clean text).

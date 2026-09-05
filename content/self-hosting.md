---
description: Run a built Aardvark site in production with vark serve — a hardened static
  server plus a live MCP server — and package it as a Docker image behind a CDN.
heading: Agent-ready
heading-icon: fa-solid fa-robot
icon: fa-solid fa-server
menu: ai
title: Self-hosting & MCP
weight: 40
---

# Self-hosting & MCP

[Deployment](/deployment/) covers handing the static `build/` directory to a host
(Cloudflare Pages, Netlify, S3, …). This page covers the other option: **running the
site yourself** with `vark serve` — a single hardened process that serves the static
site *and* a live **MCP server**, so AI clients can query your docs as a tool — and
packaging it as a container ready for the open internet.

## `vark serve`

`vark serve` is the production counterpart to [`vark dev`](/cli/#vark-dev). It does **not**
build, watch, or live-reload — run `vark build` first, then:

```bash
vark build
vark serve                      # serve ./build on 0.0.0.0:8080, with /mcp
vark serve --port 80 --no-mcp   # static only, no MCP endpoint
```

It serves the build exactly as a CDN host would — honoring the `_headers` and
`_redirects` the build emits (see [Generated files](/llms-and-sitemap/)), so content
types, the `.md`-as-`text/plain` rule, redirects, and the `ai-config.json` `no-store`
rule all match. That's the point of serving from the same tool that built the site:
there's no second web-server config to drift from what the build produced. It also serves
the extension-less well-known documents — the [OAuth/OIDC discovery](/agent-discovery/) trio
on every site, and the [Web Bot Auth](/web-bot-auth/) key directory when you've enabled it —
which a generic static resolver would mistake for HTML pages.

Other flags: `--host` (default `0.0.0.0`), `--workers N` (uvicorn worker processes, default 1),
`--mcp-rate-limit N` (per-IP requests per minute on `/mcp`, default 60), `--trusted-proxy CIDR`
(repeatable; see the hardening notes below) and `--root DIR` for a project directory other than
the current one. A `GET /healthz` is the load-balancer / container health check: `200` while the
built site is in place, `503` when it isn't (so a wiped or half-swapped `build/` takes the replica
out of rotation). Its JSON body reports the Aardvark `version`, whether the site is `ready`, and —
with MCP on — whether the corpus the MCP tools read was built (`mcp_corpus`), which is reported but
deliberately never fails the check.

The serve stack (uvicorn/starlette/MCP) ships with every Aardvark install — `pip install
aardvark`, the standalone binary, and the Docker image below — so there's nothing extra to
add.

### Markdown for Agents

`vark serve` also does [Markdown-for-Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/)
content negotiation automatically: request any page with `Accept: text/markdown` and you
get that page's Markdown — the same per-page `.md` the build already emits ([Generated
files](/llms-and-sitemap/)) — at the **same URL** as `text/markdown; charset=utf-8`, while
browsers keep getting HTML. The response also carries estimated token counts
(`x-markdown-tokens` / `x-original-tokens`) and `Vary: Accept`, so a cache in front keeps
the HTML and Markdown variants separate. There's nothing to switch on — it's automatic
whenever per-page `.md` files are published (the default):

```bash
curl -H 'Accept: text/markdown' https://your-docs.example.com/guide/intro/
```

### Put a CDN in front

`vark serve` is one process designed to sit **behind a CDN** (Cloudflare, Fastly,
CloudFront). The CDN terminates TLS, caches the static tier, and is your real defense
against volumetric abuse — so the origin mostly serves cache fills and a single replica
comfortably handles a site with hundreds of thousands of monthly readers. Scale out by
running more replicas (each is stateless); the `/mcp` endpoint is dynamic and is not
CDN-cacheable.

If you'd rather front it with your own nginx/Caddy, you can — but then *you* own
translating `_headers`/`_redirects` into that server's config and keeping it in sync with
each build. Serving through `vark serve` avoids that entirely.

## The Docker image

Drop the multi-stage `Dockerfile` from this project's root into your own docs project (next
to `aardvark.config.yaml`), then build and run it:

```bash
DOCKER_BUILDKIT=1 docker build -t my-docs .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp my-docs
```

The build stage downloads the published `vark` release binary (no source build, no
Python/uv toolchain) and uses Node 22 only to bundle the islands. It **bind-mounts** your
project read-only and renders it in-container, so your Markdown never lands in an image
layer — only the built `build/`, the `vark` binary, and your config travel in the final
runtime image. That image runs as a non-root user and is read-only-rootfs friendly (give the
self-extracting binary a writable `/tmp` via `--tmpfs /tmp`), with a `/healthz` health check.
Build multi-arch with `docker buildx build --platform linux/amd64,linux/arm64`. Behind a
CDN/LB that terminates TLS, point the container's rate limiter at it (see below):

```bash
docker run -p 8080:8080 --tmpfs /tmp my-docs --trusted-proxy 173.245.48.0/20
```

By default the image builds with the **latest published `vark` release**, so each rebuild picks
up the newest version automatically. To pin a specific version instead, pass
`--build-arg VARK_VERSION=X.Y.Z` (any release that includes `vark serve`, i.e. `>= 0.1.6`). For a
tamper-checked build, also pass `--build-arg VARK_SHA256=<hash>` to verify the downloaded binary
against the per-architecture hash published with that release; left unset, the build proceeds on
HTTPS trust alone and warns.

## The MCP server

When `/mcp` is enabled (the default), the server exposes a stateless
[Model Context Protocol](https://modelcontextprotocol.io) endpoint over Streamable HTTP
that wraps your docs as four read-only tools:

| Tool | What it returns |
| --- | --- |
| `search_documentation` | Ranked pages for a query (same scoring and query syntax as the on-page search box); `limit` defaults to 5, max 25 |
| `fetch_document` | One page's raw Markdown |
| `list_documentation` | The navigation index — every page's title, path, headings, glossary |
| `get_full_corpus` | The whole site as one Markdown document (size-guarded: refused past `max_bytes`, default 1 MB) |

These wrap the artifacts the build already emits (the agent-audience
`search-index-agent.json` when present, otherwise `search-index.json`, plus
`metadata.json`, the per-page `.md` files, and `llms-full.txt`). A site with the on-page
search box already emits the human search index; Search/MCP also emits the compact agent
twin when its audience projection differs. The [AI assistant](/ai-assistant/)'s complete
`assistant-corpus.json` is browser-only and is not read by MCP. A public-key versioned
assistant independently emits the compact agent index for its scope-safe browser fallback only
when that index fits the reader's separate 8 MiB cap; an unversioned assistant does not. To
guarantee full-text MCP artifacts with Search off,
set `mcp: true` in `aardvark.config.yaml` so the build writes its full-text index and
navigation corpus:

```yaml
mcp:
  enabled: true
```

### Connecting a client

Point any MCP client at `https://your-docs.example.com/mcp`:

- **Claude.ai / Claude Desktop** — add a Custom Connector with that URL.
- **Claude Code** — `claude mcp add --transport http my-docs https://your-docs.example.com/mcp`
- **IDEs (Cursor, etc.)** — add an HTTP MCP server pointing at `/mcp`.

A `GET /mcp` returns `405` by design (the server pushes nothing); clients use `POST`.

### MCP on managed hosting

You don't need to run `vark serve` to get a live `/mcp` endpoint: on
[Aardvark managed hosting](/deployment/), the platform serves MCP for your site
automatically. When your deploy publishes the MCP server card
(`/.well-known/mcp/server-card.json` — written when MCP is enabled and a `baseUrl`
is set, alongside the search and Markdown artifacts the tools read), the same
four read-only tools answer at your site's
`/mcp` — same tool names, same ranking, same size guards as `vark serve --mcp`.
There is nothing to configure and no server to operate; a deploy without the card
simply has no MCP endpoint. `/mcp` is a reserved path on hosted sites, so a
`_redirects` rule can't shadow it.

One exception worth knowing before you turn it on: a site with **reader authentication**
enabled has **no hosted MCP endpoint** — `/mcp` returns 404 for as long as the gate is on,
even though the build still publishes the server card. MCP is a machine surface with no
browser to complete the team sign-in, and the serving worker can't verify a session on its
own, so it refuses rather than serving a private site's whole corpus to any caller.
Authenticated MCP for gated sites needs a token of its own and isn't in this version. If
you rely on the hosted `/mcp` integration, gating the site will silently take it away — the
site's own pages keep working, only the endpoint stops answering.

### WebMCP — the same tools, in the browser

The same four tools are also exposed to **in-browser AI agents** (Chrome's built-in agent,
extensions) via [WebMCP](https://webmachinelearning.github.io/webmcp/): every page calls
`navigator.modelContext` on load and registers `search_documentation`, `fetch_document`,
`list_documentation`, and `get_full_corpus`. They run entirely client-side — same-origin fetches
over the artifacts above, ranked with the on-page search box's scorer — so this works on **any**
host (a CDN, static hosting, `vark serve`), not only the MCP server.

WebMCP rides the same `mcp: true` switch — it's the browser transport of the same tool set, so
there's nothing extra to turn on. It's a progressive enhancement: in a browser without WebMCP, or
over plain HTTP (the API is secure-context-only — HTTPS or `localhost`), the script is a silent
no-op. Keep `markdownMenu` on (the default) so `fetch_document` / `list_documentation` have the
per-page `.md` files and `metadata.json` to read.

To run the `/mcp` server **without** injecting the in-browser client (for example, under a strict
Content-Security-Policy), opt out while keeping the server on:

```yaml
mcp:
  enabled: true
  webmcp: false
```

Under a strict `script-src 'nonce-…'` CSP, the small inline config script — emitted **only** when you
override a search default (`search.compress: false`, a custom `search.ranking`, `search.synonyms`,
or a `search.typoTolerance` override) — is blocked; the client then falls back to its built-in
defaults (gzipped index, default ranking, no synonyms, typo tolerance on), so the tools still work
but a custom ranking wouldn't reach them. A default-search site emits no inline script at all.
Use `mcp.webmcp: false` to drop the browser client entirely.

Raw event attributes passed through component `attr`, such as
`attr={'onchange': '...'}`, are compiled into event listeners during island hydration.
If your CSP permits those handlers, `script-src` must allow `unsafe-eval`; a strict
Trusted Types policy can block them outright. For strict-CSP deployments, prefer a
small snippet island or built-in component callback over raw `on*` attribute handlers.

## Hardening notes

Read these before exposing the server to the open internet.

- **Set `--trusted-proxy` behind a CDN.** The per-IP rate limit on `/mcp` keys on the
  client IP. Behind a CDN the direct peer is the CDN, so pass its CIDR(s) with
  `--trusted-proxy` (repeatable) — then the limiter reads the real client from
  `CF-Connecting-IP` / `X-Forwarded-For`. By default only a loopback proxy is trusted:
  forwarded headers from any other peer are ignored (they're spoofable) and **every client
  shares one bucket**. `vark serve` prints a warning when no trusted proxy is configured;
  `--trusted-proxy none` trusts nothing at all, not even loopback, and silences it.
- **The in-process limiter is a backstop, not a DDoS shield.** It caps a single abusive
  client and a runaway agent loop on one replica (60 requests per minute per IP by default,
  `--mcp-rate-limit`, and a 256 KiB cap on any `/mcp` request body); it does not coordinate
  across replicas — or across `--workers`: each worker process keeps its own counters, so
  with `--workers 4` the effective per-IP cap is four times the flag, and `vark serve` says
  so at startup. Real volumetric defense is the CDN in front.
- **Bind a public interface, or put a Host-checking proxy in front.** The MCP server is
  tuned for a CDN-fronted host and does no DNS-rebinding protection of its own, so `vark
  serve --host 127.0.0.1` (or any private address) on an internal network warns: a
  malicious web page could rebind DNS to reach it. The default `0.0.0.0` bind behind a CDN
  is the intended deployment.
- **TLS is the CDN/LB's job.** `vark serve` speaks plain HTTP; terminate TLS at the edge.
- **Private docs: gate the whole container.** `/mcp` is open by design — it only exposes
  the same `.md` and `metadata.json` files already fetchable from the static site, so
  gating `/mcp` while leaving the site public is security theater. For private docs, put
  the entire container behind your CDN access rules or an SSO proxy.
- **Rotated keys propagate.** `/_aardvark/ai-config.json` (which carries the rotatable
  assistant key) is served `no-store` straight from the build's `_headers`, so a rotation
  isn't held stale at the edge.

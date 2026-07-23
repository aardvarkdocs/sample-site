---
description: A checklist for making your site AI-agent ready — what aardvark publishes for you on
  every build, and the few steps only you can do (a Web Bot Auth key, DNS-AID records, real OAuth)
  to score well on isitagentready.com.
icon: fa-solid fa-list-check
menu: ai
title: Agent readiness
weight: 50
---

# Agent readiness

[isitagentready.com](https://isitagentready.com) (Cloudflare's Agent Readiness Scanner) grades how
well a site cooperates with AI agents: can they discover it, read it, learn the rules, and find its
machine interfaces? aardvark publishes **almost all** of those signals automatically on every
`vark build` — this page is the checklist, so you can see what's already handled and do the handful
of steps only you can do.

## How the score works

The scanner runs a set of named checks grouped into five categories and reports a **level** (the top
rung is *Agent-Native*). Four categories count toward your level:

| Category | What it asks |
| --- | --- |
| **Discoverability** | Can an agent find your content and interfaces? (`robots.txt`, `sitemap.xml`, `Link` headers, DNS-AID) |
| **Content accessibility** | Can it read your pages as clean text? (Markdown negotiation) |
| **Bot access control** | Have you stated the rules for bots/AI? (`robots.txt` AI rules, Content Signals, Web Bot Auth) |
| **Discovery** | Can it find your APIs, auth, MCP server, skills? (API catalog, OAuth/OIDC, `auth.md`, MCP card, A2A card, agent skills, WebMCP) |

A fifth category, **Commerce** (x402, MPP, UCP, ACP, AP2), is reported but **does not count toward
your score** — it only applies to shopping/checkout sites, so a docs or marketing site can ignore it.

## What aardvark publishes for you (no work required)

Most are emitted on **every build** with no configuration — set [`baseUrl`](/llms-and-sitemap/) in
`aardvark.config.yaml`, deploy over HTTPS, and they pass. A few are conditional, as the Notes column
calls out: WebMCP rides on `mcp: true` (MCP is opt-in), the API catalog appears once you embed
OpenAPI specs, and the Agent Skills index lists whatever `skills/` you ship.

| Check | Endpoint / signal | Notes |
| --- | --- | --- |
| robots.txt | `/robots.txt` | Includes wildcard rules that apply to AI bots |
| Content Signals | `/robots.txt` (`Content-Signal:`) | Declares search / ai-input / ai-train usage; tune under `robots.contentSignals` |
| Sitemap | `/sitemap.xml` | Every page, with `lastmod` |
| Link headers | `Link: …; rel="service-desc" / "describedby" / "api-catalog"` | Added by `vark serve` and the generated `_headers` |
| Markdown negotiation | `/<page>.md` + "View as Markdown" | Agents fetch the clean Markdown of any page |
| MCP Server Card | `/.well-known/mcp/server-card.json` | Advertises the MCP server `vark serve --mcp` hosts |
| WebMCP | `/_aardvark/webmcp-<sha>.js` | In-page tools agents can call — **opt-in**, requires `mcp: true`; generated pages are rewritten to the fingerprinted file |
| OAuth / OIDC discovery | `/.well-known/oauth-authorization-server`, `/.well-known/openid-configuration` | See "Point OAuth at your IdP" below |
| OAuth Protected Resource | `/.well-known/oauth-protected-resource` | RFC 9728 |
| auth.md | `/auth.md` | Human + agent summary of how to authenticate |
| Agent Skills index | `/.well-known/agent-skills/index.json` | Lists every `skills/<name>/SKILL.md` you ship |
| API catalog | `/.well-known/api-catalog.json` | Published when your site embeds `{% raw %}{% openapi %}{% endraw %}` specs (see [OpenAPI](/components/extras/openapi/)) |
| llms.txt | `/llms.txt`, `/llms-full.txt` | Bonus agent-friendly content index |

See [Agent discovery](/agent-discovery/) and [Generated files](/llms-and-sitemap/) for the details of
each. The takeaway: out of the box, with just a `baseUrl`, an aardvark site already clears most of
the scanner.

## Hand this site to an agent (the page menu)

Discovery files help an agent that *already found* your site. To let a **reader** point their own
agent at it, the "View in Markdown" menu at the top of every page also offers one-click hand-offs
(all on by default, hidden per item under `markdownMenu`):

| Menu item | What it does | Works in |
| --- | --- | --- |
| **Copy MCP Server** | Copies this site's MCP endpoint URL | Claude Code (`claude mcp add --transport http`), Claude Desktop / claude.ai (Customize → Connectors → *Add custom connector*) — shown only when `mcp: true` |
| **Install Skill** | Downloads an [Agent Skill](/ai-features/) (`SKILL.md`) that teaches an agent how to search this site | Claude Code (drop in `~/.claude/skills/`), Claude apps (Customize → Skills → *Upload a skill*) |
| **Install Plugin** | Opens a setup page for installing the site's plugin — it bundles the skill (and, when configured, the MCP server) | Claude Desktop / claude.ai / Cowork (Customize → Plugins → upload a custom plugin file) and Claude Code (terminal) — see below |
| **Install Assistant** | Installs the site's [assistant app](/ai-features/) (PWA) so readers can launch the AI assistant from their home screen or desktop | Chromium browsers (others fall back to the standalone assistant page) — shown only when the assistant app is built |

The generated artifacts (built once per `vark build`, no config beyond `markdownMenu`):

- `/_aardvark/<slug>-docs-skill.zip` — the downloadable skill (also published into the
  `/.well-known/agent-skills/index.json` discovery index above, so agents find it like your other skills).
- `/_aardvark/<slug>-docs-plugin.zip` — a single Claude plugin (the skill **and**, when `mcp: true` +
  a `baseUrl`, the MCP server) for the Claude apps: Customize → Plugins → upload a custom plugin file.
- `/_aardvark/<slug>-docs-marketplace.zip` — the same plugin wrapped in a local marketplace for the
  Claude Code terminal; add it with `/plugin marketplace add ./<slug>-docs-marketplace` then `/plugin install`.
- `/.well-known/claude-plugin/marketplace.json` — a hosted marketplace, so
  `/plugin marketplace add {baseUrl}/.well-known/claude-plugin/marketplace.json` installs the MCP
  server in one command (written when `installPlugin` is on — the default — plus `mcp: true` and a
  `baseUrl`).
- `/_aardvark/agent-setup.html` — the "Install Plugin" link target: a benefit-led page that walks a
  reader through installing the plugin in the **Claude apps** AND the **Claude Code** terminal.

To turn an item off, set it under `markdownMenu` (e.g. `markdownMenu: {copyMcp: false}`); every item
defaults on. Copy MCP additionally requires `mcp: true`, and Install Assistant requires the assistant
app to be built.

## What only you can do

A static-site generator can't generate a cryptographic identity for you, operate your DNS, or run
your identity provider. These steps are yours:

1. **Publish a Web Bot Auth key** (below) — required for the top *Agent-Native* level.
2. **Publish your DNS-AID records and enable DNSSEC** (below) — the one check no web server can pass for you.
3. *(Optional, recommended)* **Point OAuth/OIDC at your real identity provider** (below).
4. Set [`baseUrl`](/llms-and-sitemap/) and deploy over **HTTPS** on a real domain.

### 1. Publish a Web Bot Auth key

[Web Bot Auth](/web-bot-auth/) lets your site identify itself when an agent sends signed requests on
its behalf. The scanner looks for a JWKS (a set of public keys) at
`/.well-known/http-message-signatures-directory`. aardvark **publishes** that directory — you just
provide a public key.

Generate an Ed25519 keypair:

```bash
vark web-bot-auth-keygen
```

```text
Private key — store as a secret; your signing agent needs it (NOT recoverable):
  <PRIVATE_KEY>

Public key — add to aardvark.config.yaml:

  webBotAuth:
    keys:
      - <PUBLIC_KEY>
```

Then add the **public** key to `aardvark.config.yaml`:

```yaml
webBotAuth:
  keys:
    - <PUBLIC_KEY>   # the PUBLIC key from the command above
```

Listing a key turns the feature on; the next `vark build` writes the JWKS. Keep the **private** key
out of your repo — store it as a secret wherever your signing agent runs (aardvark never holds it,
and the public directory is safe to commit). aardvark only publishes the directory; it never signs
requests itself. Full reference: [Web Bot Auth](/web-bot-auth/).

### 2. Publish your DNS-AID records (and enable DNSSEC)

DNS-based Agent Interface Discovery is validated over DNS-over-HTTPS against your **authoritative
nameservers** — so no HTTP server, `vark serve` included, can make it pass. aardvark writes a
copy-pasteable zone file for you at `/.well-known/dns-aid/records.zone`; you publish it:

1. `vark build` writes `records.zone` (and a `records.json` mirror) from your `dnsAid.services` config.
2. Paste those `SVCB`/`HTTPS` records into your DNS provider (Cloudflare DNS, Route 53, …), matching
   the owner names and parameters exactly.
3. **Enable DNSSEC** for the zone so resolvers can authenticate the records.
4. Verify with a DoH lookup, e.g.
   `https://cloudflare-dns.com/dns-query?name=_mcp._agents.YOUR-DOMAIN&type=SVCB`.

Configuration and the full walkthrough live in [Agent discovery](/agent-discovery/).

### 3. Point OAuth at your IdP

aardvark always *advertises* OAuth 2.1 / OpenID Connect discovery metadata (derived from `baseUrl`
as labelled examples if you set nothing), so the discovery checks pass on a fresh build. For a real
deployment, point the `oauth` block at your actual identity provider (for example Cloudflare Access)
and fill in the `oauth.agentAuth` sub-block so `auth.md` advertises how an autonomous agent
registers and proves identity:

```yaml
oauth:
  issuer: https://your-idp.example.com
  authorizationEndpoint: https://your-idp.example.com/authorize
  tokenEndpoint: https://your-idp.example.com/token
  jwksUri: https://your-idp.example.com/.well-known/jwks.json
  agentAuth:
    registerUri: https://your-idp.example.com/oauth/register
    identityTypesSupported: [service_account, delegated_user]
    credentialTypesSupported: [client_secret, private_key_jwt]
```

aardvark is **not** an OAuth server — these documents only point agents at where to authenticate. See
[Agent discovery](/agent-discovery/) for every field.

## Full checklist

Every scanner check, who handles it, and where to configure it:

| Check | Category | Handled by | What to do |
| --- | --- | --- | --- |
| robots.txt | Discoverability | aardvark | Nothing (tune `robots` if you like) |
| Sitemap | Discoverability | aardvark | Set `baseUrl` |
| Link headers | Discoverability | aardvark | Nothing |
| DNS-AID | Discoverability | **You** | Publish records + DNSSEC (step 2) |
| Markdown negotiation | Content accessibility | aardvark | Nothing |
| robots.txt AI rules | Bot access control | aardvark | Nothing |
| Content Signals | Bot access control | aardvark | Tune `robots.contentSignals` |
| Web Bot Auth | Bot access control | **You** | Add a public key (step 1) |
| API catalog | Discovery | aardvark | Embed `{% raw %}{% openapi %}{% endraw %}` specs |
| OAuth/OIDC discovery | Discovery | aardvark | Point at your IdP (step 3) |
| OAuth Protected Resource | Discovery | aardvark | Nothing |
| auth.md | Discovery | aardvark | Fill `oauth.agentAuth` for full credit |
| MCP Server Card | Discovery | aardvark | Nothing |
| Agent Skills | Discovery | aardvark | Add `skills/<name>/SKILL.md` (see [Build-time AI](/ai-features/)) |
| WebMCP | Discovery | aardvark | Enable `mcp: true` (opt-in) |
| A2A Agent Card | Discovery | *Not yet* | aardvark does not emit an A2A agent card today |
| Commerce (x402, MPP, UCP, ACP, AP2) | Commerce | n/a | Not scored; only for commerce sites |

## Verify your score

After deploying, re-run the scan:

```bash
curl -X POST https://isitagentready.com/api/scan \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://YOUR-SITE.com"}'
```

Or just open [isitagentready.com](https://isitagentready.com) and enter your URL. A check that reads
`unableToCheck` is usually a fetch timeout, not a failure — re-run it. For Web Bot Auth specifically,
confirm `checks.botAccessControl.webBotAuth.status` is `"pass"`.

## Known gaps

- **A2A Agent Card** (`/.well-known/agent.json`): aardvark advertises an A2A entry in its DNS-AID
  records but does not yet generate the agent card document itself. If you need this check, ship the
  card as a static file under `static/.well-known/`.
- **Commerce checks**: out of scope for a docs/marketing site and excluded from the score.

---
description: Always-on agent-discovery endpoints — an MCP Server Card, OAuth/OIDC discovery, OAuth
  Protected Resource metadata, auth.md, and DNS-AID records — emitted by every build.
icon: fa-solid fa-compass
menu: ai
title: Agent discovery
weight: 60
---

# Agent discovery

Every `vark build` publishes a set of **always-on** discovery endpoints that let AI agents learn
what your site offers and how to use it. These are emitted on every build (no opt-in needed), so a
checker such as [isitagentready.com](https://isitagentready.com) clears with the best-available
information. Each endpoint is populated from your config when you provide it, and otherwise from
clearly-labelled **example** values derived from your `baseUrl`.

| Endpoint | What it tells an agent |
| --- | --- |
| `/.well-known/mcp/server-card.json` | This site exposes an MCP server, where, and what it can do |
| `/.well-known/oauth-authorization-server` | OAuth 2.1 authorization-server metadata (RFC 8414) |
| `/.well-known/openid-configuration` | The OpenID Connect flavour of the same metadata |
| `/.well-known/oauth-protected-resource` | Which authorization server guards this resource (RFC 9728) |
| `/auth.md` | A human- and agent-readable summary of how to authenticate |
| `/.well-known/dns-aid/records.json` + `records.zone` | DNS records for agent-interface discovery |

## MCP Server Card

`/.well-known/mcp/server-card.json` advertises the Model Context Protocol server that
[`vark serve --mcp`](/self-hosting/) hosts — its transport endpoint and the read-only documentation
tools it exposes (`search_documentation`, `fetch_document`, `list_documentation`,
`get_full_corpus`). The card is written on every build, so an agent can discover the server even on
a static Cloudflare Pages / Netlify deploy where no live `/mcp` is running.

```json
{
  "serverInfo": { "name": "aardvark", "version": "0.1.8" },
  "protocolVersion": "2025-06-18",
  "endpoint": "https://aardvarkdocs.com/mcp",
  "transport": "streamable-http",
  "capabilities": { "tools": { "listChanged": false } },
  "tools": [ … ]
}
```

The endpoint is `{baseUrl}/mcp`. No configuration is required — the card reflects the tools the MCP
server actually serves.

## OAuth / OIDC discovery

aardvark **publishes** OAuth 2.1 / OpenID Connect discovery metadata so an agent knows where to
authenticate. It does **not** become an OAuth authorization server — these documents only advertise
discovery information. Point them at your real identity provider (for example Cloudflare Access);
left unset, every field is derived from `baseUrl` as a labelled example endpoint.

```yaml
oauth:
  issuer: https://aardvarkdocs.com
  authorizationEndpoint: https://aardvarkdocs.com/oauth/authorize
  tokenEndpoint: https://aardvarkdocs.com/oauth/token
  jwksUri: https://aardvarkdocs.com/.well-known/jwks.json
  registrationEndpoint: https://aardvarkdocs.com/oauth/register
  scopesSupported: [openid, profile, email, offline_access]
  # Generic OAuth grants plus the two agent-auth profile grants (JWT-bearer assertion exchange and
  # the WorkOS claim-ceremony polling grant); these are also the build default when the key is unset.
  grantTypesSupported: [authorization_code, refresh_token, client_credentials, urn:ietf:params:oauth:grant-type:jwt-bearer, urn:workos:agent-auth:grant-type:claim]
  responseTypesSupported: [code]
  oidc: true            # also publish /.well-known/openid-configuration (default on)
  agentAuth:            # how an autonomous agent registers and proves identity
    registerUri: https://aardvarkdocs.com/oauth/register
    claimUri: https://aardvarkdocs.com/oauth/claim
    revocationUri: https://aardvarkdocs.com/oauth/revoke
    identityTypesSupported: [identity_assertion, anonymous]
    assertionTypesSupported: [urn:ietf:params:oauth:token-type:id-jag, verified_email]
    credentialTypesSupported: [access_token]
    eventsSupported: [https://schemas.workos.com/events/agent/auth/identity/assertion/revoked]
```

The build writes `/.well-known/oauth-authorization-server` (RFC 8414) and, when `oauth.oidc` is on
(the default), `/.well-known/openid-configuration`. The discovery check accepts either, so a
plain-OAuth site can set `oidc: false` to drop the OIDC copy. Both documents include an `agent_auth`
block describing the agent registration / identity flow.

### The `agent_auth` block

The `agent_auth` block follows the [WorkOS auth.md](https://github.com/workos/auth.md) profile's
recognized registration flows. `identity_types_supported` lists the methods the service accepts, and
each gets a nested object: `identity_assertion` carries the assertion types it accepts (the ID-JAG
`urn:ietf:params:oauth:token-type:id-jag` and `verified_email`) plus the issued credential types,
and `anonymous` carries its credential types. `events_supported` advertises the upstream revocation
event the registration layer can ingest. Inside `agent_auth`, the registration / claim / revocation
surface is published in BOTH vocabularies — the readiness scanner's `register_uri` / `claim_uri` /
`revocation_uri` and the canonical WorkOS `identity_endpoint` / `claim_endpoint` / `events_endpoint`
aliases — so either reader finds what it expects. Revocation is additionally exposed as the standard
RFC 7009 `revocation_endpoint` at the **top level** of the authorization-server metadata (a sibling
of `agent_auth`, not a field inside it):

```json
{
  "revocation_endpoint": "https://aardvarkdocs.com/oauth/revoke",
  "agent_auth": {
    "skill": "https://aardvarkdocs.com/auth.md",
    "register_uri": "https://aardvarkdocs.com/oauth/register",
    "identity_endpoint": "https://aardvarkdocs.com/oauth/register",
    "claim_uri": "https://aardvarkdocs.com/oauth/claim",
    "claim_endpoint": "https://aardvarkdocs.com/oauth/claim",
    "revocation_uri": "https://aardvarkdocs.com/oauth/revoke",
    "events_endpoint": "https://aardvarkdocs.com/agent/event/notify",
    "identity_types_supported": ["identity_assertion", "anonymous"],
    "identity_assertion": {
      "assertion_types_supported": ["urn:ietf:params:oauth:token-type:id-jag", "verified_email"],
      "credential_types_supported": ["access_token"]
    },
    "anonymous": { "credential_types_supported": ["access_token"] },
    "events_supported": ["https://schemas.workos.com/events/agent/auth/identity/assertion/revoked"]
  }
}
```

### Protected Resource metadata

`/.well-known/oauth-protected-resource` (RFC 9728) names which authorization server guards the
resource and how to present a token:

```json
{
  "resource": "https://aardvarkdocs.com",
  "authorization_servers": ["https://aardvarkdocs.com"],
  "scopes_supported": ["openid", "profile", "email", "offline_access"],
  "bearer_methods_supported": ["header"]
}
```

### auth.md

`/auth.md` restates the same facts in Markdown an agent (or a human) can read directly — its `# auth.md`
heading is what readiness checkers look for. It also **embeds the authorization-server metadata,
including the `agent_auth` block, as a fenced JSON code block** (mirroring the canonical WorkOS
`AUTH.md`), so the `agent_auth` metadata is parseable from `auth.md` itself and not only from the
separate well-known document. It is written on every build and served inline as `text/plain`.

## DNS-AID records

DNS-based Agent Interface Discovery lets an agent find your machine interfaces from DNS alone, by
looking up `SVCB`/`HTTPS` records under `_<service>._agents.<domain>`. Configure the services:

```yaml
dnsAid:
  services:
    - name: a2a              # -> _a2a._agents.<domain>
      target: aardvarkdocs.com
      alpn: h2
      port: 443
      params:
        path: /.well-known/agent.json
    - name: mcp
      target: aardvarkdocs.com
      params: { path: /mcp }
```

`alpn` accepts either a single protocol (`alpn: h2`) or a list (`alpn: [h2, h3]`); a list is
rendered as the comma-joined SVCB value `alpn="h2,h3"`.

Every build writes a copy-pasteable zone snippet at `/.well-known/dns-aid/records.zone` and a
machine-readable mirror at `/.well-known/dns-aid/records.json`:

```text
_a2a._agents.aardvarkdocs.com. 3600 IN SVCB 1 aardvarkdocs.com. alpn="h2" port=443 path="/.well-known/agent.json"
_mcp._agents.aardvarkdocs.com. 3600 IN SVCB 1 aardvarkdocs.com. alpn="h2" port=443 path="/mcp"
```

### This step is manual (and required)

The DNS-AID check validates via **DNS-over-HTTPS against your domain's real authoritative
nameservers** (`cloudflare-dns.com` / `dns.google`) — *not* against your web server. That means **no
HTTP server, including `vark serve`, can make the DNS-AID check pass.** A static-site generator
cannot operate your DNS or sign DNSSEC for you. To go green you must:

1. **Build** — `vark build` writes `/.well-known/dns-aid/records.zone` and `records.json`.
2. **Publish** the SVCB/HTTPS records from `records.zone` at your DNS provider (Cloudflare DNS,
   Route 53, etc.) — paste them into your zone, matching the owner names and SvcParams exactly.
3. **Enable DNSSEC** for the zone, so resolvers can authenticate the records.
4. **Verify** with a DoH lookup, e.g.
   `https://cloudflare-dns.com/dns-query?name=_mcp._agents.aardvarkdocs.com&type=SVCB`.

The `records.json` mirror served over HTTP is provided only for convenience and tooling — it cannot
substitute for publishing the records at DNS.

## How they're served

`/auth.md` and the `.json` artifacts are served by the normal static resolver. The extension-less
OAuth/OIDC paths get dedicated [`vark serve`](/self-hosting/) routes (a suffix-less path is treated
as an HTML request by the resolver, so the raw file would otherwise 404). On Cloudflare Pages /
Netlify the generated [`_headers`](/llms-and-sitemap/) rules set `Content-Type: application/json`
(with open CORS) on each. The homepage also advertises the MCP server card and the Protected
Resource metadata via an RFC 8288 `Link` header.

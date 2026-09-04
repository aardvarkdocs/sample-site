---
title: Security & trust
navtitle: Security
description: How Aardvark keeps your docs secure — a static architecture with no
  third-party runtime scripts by default, opt-in-only cloud features, encrypted
  protected sections, and enterprise team controls.
icon: fa-solid fa-shield-halved
menu: docs
weight: 63
---

# Security & trust

Aardvark's security story starts from its architecture: the product of every build is a
directory of **static files** that you own and host. Deployed on a static host, the
site involves no server-side application code of yours to patch and no database to
breach — pages are files, and the only code that runs is the client-side JavaScript in
each reader's browser. (Choosing [`vark serve`](/self-hosting/) instead means running
an application server — a hardened static file server with a live MCP endpoint — in
your own infrastructure.) The optional cloud features — the AI assistant, Content
Reach, and the Aardvark cloud dashboard — are separate, opt-in services, and this page
describes each of them on its own terms: what leaves your infrastructure and when, how
the built-in protections work, and how to reach us about a vulnerability.

## A static site, under your control

`vark build` writes plain HTML, CSS, and JavaScript into `build/`. You can host that
directory anywhere — [your own server or CDN](/deployment/), [`vark serve`](/self-hosting/)
in your own infrastructure, or Aardvark cloud's [managed hosting](/hosting-onboarding/) on
the [paid plans](/pricing/).

- **The core runtime is local.** Interactive components are delivered as one
  JavaScript bundle, built at build time and served **from your own site** alongside
  the pages, with local styles — the pages themselves load no third-party scripts.
- **Optional features that fetch external resources** — each off until you use it: an
  [analytics integration](/analytics/) you configure adds that provider's script; the
  [map component](/components/extras/map/) fetches its tiles from the provider it
  credits on the map; `theme.fontawesome` (off by default) loads the Font Awesome
  stylesheet from a pinned CDN URL — or from any URL you set, including a self-hosted
  copy; and Tabler `icon:` glyphs are baked into the HTML at build time when the
  matching icon package is available locally, with any that can't be baked fetched
  from a pinned icon CDN at runtime (`theme.iconCdn` repoints that to a base you
  host).
- **Readers' browsers talk to your host** — plus the Aardvark cloud gateway *only* for
  the cloud features described below, each of which is off until you turn it on.

## What talks to Aardvark cloud — and when

A default build makes no calls to Aardvark cloud and bakes no keys into the output. Each
cloud feature is a separate, deliberate opt-in:

- **The [AI assistant](/ai-assistant/)** — when enabled, the reader panel calls the
  [Aardvark cloud gateway](/ai-gateway/) with your **public** key (`aardvark_live_…`),
  which is designed to ship in the static site. Each question — together with the pages
  the assistant retrieves as context, and any reader file attachments (**on by
  default**; set `attachments: false` to disable) — travels through the gateway to the
  model provider to be answered. By default (`store_history: true`) each finished turn
  (question, answer, and a confidence label) is also stored for your dashboard's chat
  history and analytics; `store_history: false` stops transcripts from being posted or
  stored, while the assistant's 👍/👎 answer feedback and its engagement beacons still
  reach the gateway. Spending on the public key is bounded by your account's prepaid
  balance and spend cap, and the gateway ignores any system prompt a caller supplies
  with a public key — it uses the one stored for your account. The build **fails
  closed** if it finds a secret key where the public one belongs: a secret key in
  `AARDVARK_KEY` aborts the build rather than publishing it.
- **Reader-feedback surfaces that ride the assistant's key.** With the assistant
  enabled, three other built-in surfaces report to your dashboard: [on-site
  search](/search/#search-analytics-dashboard-ai-enabled-sites) analytics is on by
  default and stores raw query text (`search.analytics.store_terms: false` keeps only
  the anonymous funnel — counts, rates, positions, latency; `search.analytics: false`
  turns the capture off, and readers with Do Not Track or Save-Data are never logged);
  the ["Was this page helpful?"](/analytics/#page-ratings) widget posts its star
  rating, and its optional comment separately; and any [reader
  surveys](/survey/) you configure post their answers. Each is off whenever the
  assistant is off.
- **[Build-time AI](/ai-features/)** — generating front matter, example responses, or
  agent skills is opt-in per feature, runs only when you invoke it, and caches its
  results so rebuilds don't re-send your content.
- **[Content Reach](/content-reach/)** — off by default even on the plans that include
  it. When enabled, it records which *sections* of a page came into view, how long the
  page was visibly in the foreground, how long each section held the reader's scroll
  position, and which controls readers used — no cookies, no fingerprinting, no
  visitor IDs, and no screen
  coordinates. Nothing identifying survives in the browser past the tab: the per-tab
  session marker dies when the reader closes it. The recorded section events themselves
  are retained server-side and **deleted after 90 days** by default. Readers with
  **Do Not Track** or **Save-Data** enabled send nothing at all, and `requireConsent`
  defers all recording to your site's own consent banner.
- **Reader authentication on managed hosting** — off unless you turn it on for a hosted
  site. While it is on, a reader who arrives without a valid session is *redirected* to the
  gateway (`/v1/reader-auth/login`) before any page is served: the gateway checks that they
  are signed in to the Aardvark dashboard and are an active member of the team that owns the
  site — honoring the team's SSO enforcement — then sends them back to your site with a
  short-lived signed token, which the serving worker exchanges for a session cookie scoped
  to that hostname and good for 12 hours. So on a gated site the reader's browser does
  contact the gateway on the way in — for the sign-in check only; the pages themselves
  still come from your hosted site. Unlike the features above this one is not keyed to your
  public key, and it applies to previews and custom domains as well as production. The
  practical limits — the short cache window after the switch, and a removed member's
  session outlasting their removal by up to 12 hours — are spelled out on the
  [managed hosting](/hosting-onboarding/#branch-previews) page.

## Password-protected sections

The [`protected`](/protected-pages/) option encrypts whole directories of pages at build
time with **AES-256-GCM**, deriving the key from your password via PBKDF2 (SHA-256,
600,000 iterations). Only the ciphertext is published; readers decrypt in the browser
with the password. The mechanism is **fail-closed**: if a configured password variable
is missing or empty at build time, the build aborts before writing anything, rather than
publishing the pages in the clear. That is also why a push-to-deploy site on managed
hosting can't carry a `protected:` section — its build runs with no secrets of yours —
while a [`vark deploy`](/hosting-onboarding/#deploy-from-your-machine-with-vark-deploy)
upload can, because the encryption happens on your machine.

## Team security in the dashboard

The Aardvark cloud dashboard is built for teams that have to answer to a security review:

- **Roles.** Three team roles: the **owner** holds full account authority — billing,
  minting and rotating the account **secret** key, and owner-only configuration;
  **admins** can manage billing and non-owner teammates, but can't touch the secret key
  or grant the admin/owner tier; **members** can read general dashboard data and manage
  their own public keys, and never see billing.
- **Single sign-on.** **OIDC SSO** is available for configuration on the Business and
  Enterprise plans: you prove ownership of an email domain with a DNS TXT record
  (`_aardvark-verify.<domain>`), sign-ins for that domain then route through your identity
  provider, and a separate **enforce-SSO** setting requires SSO for the team. The domain
  proof is good for 90 days; once it lapses, sign-ins fall back to magic links until you
  re-verify. Even under enforcement, the account owner deliberately keeps magic-link
  access, so a misconfigured or unavailable IdP can never lock you out of your own account.
  **SAML 2.0** is built in but ships **switched off**: it is enabled for the gateway as a
  whole by the Aardvark operator after a dedicated security review — not by a per-account
  setting — and until then the dashboard reports SAML as unavailable and refuses a SAML
  configuration. If you need SAML rather than OIDC, ask through your plan's
  [support channel](/pricing/).
- **SCIM provisioning** lets your identity provider create, update, and — crucially —
  deactivate dashboard users automatically. The SCIM bearer token is minted and rotated by
  the account owner from the dashboard on the plans that include SCIM (listed on the
  [pricing page](/pricing/)), but provisioning itself is never blocked by billing state:
  a lapsed card can't stop your IdP from removing access.
- **Audit-log export.** Business and Enterprise accounts can export the account audit
  log as CSV from the dashboard's **Billing** tab — newest first, up to 10,000 rows, and
  the download says so if it had to cut off there.
- **Secrets encrypted at rest, fail-closed for new writes.** SSO client secrets you
  save are encrypted at rest; if the encryption key is unavailable, the gateway refuses
  to store a new secret at all rather than fall back to plaintext. A secret stored
  before encryption was configured stays readable until the next configuration save,
  which re-encrypts it under the current key.

## Build-time code runs with your privileges

Aardvark runs your project's Python at build time — [generation scripts](/generators/)
and inline `{% raw %}{% %}{% endraw %}` template blocks in pages. This is intentional and works
like every other build tool that runs code (Sphinx's `conf.py`, Jekyll plugins, npm
scripts): **it is not a sandbox**, and we deliberately don't pretend otherwise, because
an in-process Python "sandbox" is escapable and would offer only false confidence. The
security model is the standard one for build tooling: **only build content you trust.**

In practice:

- Review changes to generators and inline blocks as *code*, not prose.
- Keep secrets out of any build that runs untrusted code — in CI, require approval
  before outside contributors' workflows run, scope deploy secrets to protected
  environments, and keep self-hosted runners off public repositories.
- To build genuinely untrusted content, isolate the build in an ephemeral container or
  VM with no secrets in its environment.

Managed hosting applies the same rule to itself: a push-to-deploy build runs your
generators on Aardvark's runners in a job that holds no gateway key, no repository token,
and no environment variables of yours, so build-time code can reach nothing it shouldn't.

The [build-time Python](/generators/) docs cover this guidance in full.

## Reporting a vulnerability

Please report security issues **privately** — not in a public issue or pull request. Use
GitHub's private vulnerability reporting: the **"Report a vulnerability"** button under
the **Security** tab of the
[public sample-site repository](https://github.com/aardvarkdocs/sample-site) — the
project's public contribution repository, and the place to reach the maintainers about
any part of Aardvark. That keeps
the report confidential until a fix ships; we'll acknowledge it and keep you posted on
the fix and disclosure timeline. If private reporting isn't available to you, open a
minimal issue asking for a private channel — without any details — and we'll follow up.

Aardvark is pre-1.0; security fixes land on the latest release, so please reproduce
against the most recent version before reporting.

## How Aardvark itself is distributed

The `vark` CLI ships as a **compiled binary** — via
[Homebrew](/getting-started/installation/) on macOS, and as direct downloads from the
release page for macOS, Linux (tarball), and Windows (zip). The **Linux** tarballs ship
beside a `SHA256SUMS` file listing them, so that download can be checked with
`sha256sum -c SHA256SUMS` before you run it; the macOS and Windows assets carry no
published checksum file today.

The macOS binaries carry an ad-hoc signature, not an Apple Developer ID, and are not
notarized. That is all `brew install` needs — Homebrew doesn't quarantine formula
downloads — but a tarball fetched **directly** in a browser is quarantined by Gatekeeper:
right-click → **Open** the binary once, or clear the flag with
`xattr -dr com.apple.quarantine <file>`.

Windows binaries are **unsigned by default**: Authenticode signing is in place as an
opt-in step that the release operator enables by configuring a code-signing certificate,
and today's published downloads are built without one. While a release is unsigned, the
first launch may show a SmartScreen warning ("Windows protected your PC"); click **More
info → Run anyway**. Once a release is signed, that prompt eases as the certificate earns
reputation. On every platform, some antivirus engines can flag compiled single-file
binaries as false positives.

## Questions

For anything this page doesn't answer, browse the [support knowledge base](/support/) or
open an issue on the
[public sample-site repository](https://github.com/aardvarkdocs/sample-site) —
plan-based support channels are listed on the [pricing page](/pricing/).

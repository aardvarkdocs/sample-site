---
title: Security status
navtitle: SOC 2 status
description: >-
  Aardvark has not completed a SOC 2 audit or any other independent audit, and none is
  scheduled. This page is our own short account of what is in place today and what is not.
icon: fa-solid fa-clipboard-check
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 12
sortableTables: false
filterableTables: false
---

# Security status

## Status {#status}

{% callout severity="caution" title="Not audited" %}
There is no SOC 2 report to request. What follows is our own description of what is in
place today and what is not; nobody outside Aardvark has examined it.
{% endCallout %}

No audit of any kind is scheduled; when one is, this page will say so. The page covers
Aardvark cloud: the dashboard and the gateway API.

## What is in place

Items link to the page that describes them; the two with no other page are stated here.

- **Static-site architecture:** [A static site, under your control](/security/#a-static-site-under-your-control).
- **Team roles and magic-link sign-in:** [Team security in the dashboard](/security/#team-security-in-the-dashboard).
- **Password-protected pages:** [Password-protected sections](/security/#password-protected-sections).
- **What build-time code can reach:** [Build-time code runs with your privileges](/security/#build-time-code-runs-with-your-privileges).
- **Vulnerability reporting:** [Reporting a vulnerability](/security/#reporting-a-vulnerability).
- **Encryption.** TLS in transit and encryption at rest are Cloudflare's. Aardvark's own
  code stores API keys, session tokens, sign-in links and team invitations as SHA-256
  hashes, never in full, and keeps service credentials in the platform's secret storage.
- **Deploy gate.** A production deploy of the cloud service through the deploy pipeline
  reruns its tests and type checks and stops if either fails; a team member can also
  deploy by hand, which skips that check.
- **Database recovery and request logs:** [backups and logs](/trust/data-retention/#backups-and-logs).
- **Availability:** what Aardvark cloud runs on, under [uptime](/trust/terms/#uptime) in the Terms.
- **Model providers:** [model providers](/trust/subprocessors/#model-providers).
- **Data not collected:** [what we collect](/trust/privacy/#what-we-collect) in the privacy policy.

## What is not in place

These lists cover the gaps a security review asks about; they are not an inventory of every
weakness, which we do not publish.

### Sign-in {#authentication}

- **No multi-factor authentication and no single sign-on.** An emailed link proves control
  of the mailbox only; the dashboard cannot be placed behind your identity provider, and
  removing someone there does not remove them from your team.
- No list of active sessions, no "sign out everywhere", no idle timeout, no sign-in
  history and no alert on a new sign-in.

### Access control {#access-control}

- API keys never expire, are not rotated automatically and cannot be restricted by IP
  address; rotating them is up to you.
- The account secret key carries full owner authority and is shared by the account's
  owners, so removing or demoting an owner does not revoke it; an owner has to rotate it.
- Removing a member ends their dashboard access and revokes the keys they created; it does
  not rotate keys other people created, and it keeps their user record.
- No self-serve account deletion, and no deleting an individual reader record in the
  dashboard; see [closing an account](/trust/data-retention/#closing-an-account) and
  [erasure](/trust/data-retention/#erasure).

### Availability {#availability}

- What database recovery relies on, and whether a restore has ever been tested, is under
  [backups and logs](/trust/data-retention/#backups-and-logs).
- No recovery-time or recovery-point targets, no disaster-recovery plan and no status page.

### Monitoring and incidents {#monitoring}

- No documented alerting, paging or uptime monitoring. Logs are collected; do not assume
  anything alerts on them.
- No formal incident-response plan, on-call rotation or post-incident review; the notice
  you get is under [security incidents](/trust/dpa/#security-incidents) in the DPA.
- Operator actions are only partly recorded: status changes we make appear in the account's
  event history; other actions go to an internal record that does not identify who acted,
  does not cover every action or any viewing of account data, and is not visible to you.
- No audit log for customers: the account event history the API returns records
  suspensions, reactivations and closure only, the dashboard does not show it, and sign-ins
  and team changes made in the dashboard are not recorded for you.

### Confidentiality {#confidentiality}

- One shared database for all accounts, separated in application logic.
- Beyond the hashed credentials above, nothing is encrypted by Aardvark's own code; stored
  records rely on Cloudflare's encryption at rest alone, with no customer-managed keys.
- Pre-production environments, when enabled, run against a copy of production data behind
  access control, not scrubbed test data.
- What erasure leaves behind, and where, is under [erasure](/trust/data-retention/#erasure).

### Supply chain and testing {#supply-chain}

- No penetration test, no bug bounty and no committed response time for vulnerability
  reports.
- A Docs Quality Check runs your build-time code in the same job as that run's inference
  key, so code in your repository can reach it; see
  [build-time code runs with your privileges](/security/#build-time-code-runs-with-your-privileges).
- **Dependency-vulnerability scanning is not a deployment gate.** A daily audit checks
  every committed dependency lockfile against known-vulnerability databases, alongside
  GitHub's dependency alerts, but neither blocks a deploy, the audit does not reach every
  component, automated dependency updates reach only some, and no software bill of
  materials is published.

### Application protections {#application-protections}

- Misuse of a public key is bounded by the spend limits, which apply to paid requests —
  your [prepaid balance](/support/prepaid-balance-safety/), the
  [limit on concurrent paid requests](/support/concurrent-request-limits/) and the
  automatic [unusual-usage pause](/support/unusual-usage-pause/) — rather than by a request
  rate limit or a bot check. Per-minute limits cover sign-in, team invitations, billing
  changes, the dashboard's assistants and the reader analytics and feedback endpoints.

## Reviews

Questions a security review needs answered go to
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com); what Aardvark does and does
not provide for reviews is in the DPA under
[information for your reviews](/trust/dpa/#reviews).

---
title: Data retention and deletion
navtitle: Data retention
description: >-
  How long Aardvark cloud keeps each kind of data, what it deletes on a
  schedule, and how account closure, erasure and exports work.
icon: fa-solid fa-clock-rotate-left
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 14
sortableTables: false
filterableTables: false
---

# Data retention and deletion

Aardvark cloud deletes a few categories of data on a schedule: assistant transcripts,
search analytics, Content Reach measurements and short-lived records such as sign-in
links and sessions. Everything else has no time limit: it stays until you remove it, where
the dashboard lets you, or ask us to erase it, and some billing records are kept even then
(see [Erasure](#erasure)). Closing an account does not erase anything.

## Retention schedule {#schedule}

The schedule covers data held by Aardvark cloud: the dashboard and the gateway API. What
each kind of record contains is under [what we collect](/trust/privacy/#what-we-collect)
in the privacy policy.

| Data | Kept for | How it is removed |
| --- | --- | --- |
| **Deleted on a schedule** | | |
| Assistant transcripts and what is derived from each turn (the automated verdict and summary, tags, cited-source events) | 90 days by default | Deleted by a scheduled job, together with the derived records. |
| Search analytics events, including Ask AI handoffs | 90 days by default. A bounded sample of the current period's queries and clicks, from which that period's snapshot is built, can be kept until the period has closed and its snapshot is finalized, so one recently completed period's sample can remain for a time as well | Deleted by a scheduled job; see [Search analytics](/search/#search-analytics-dashboard-ai-enabled-sites). |
| Search theme and content-gap snapshots, which quote example query text | While their period is current, then 90 days by default from when they were generated | Deleted by a scheduled job. A snapshot can outlive the events it summarizes; see [Search analytics](/search/#search-analytics-dashboard-ai-enabled-sites). |
| Content Reach page views and section measurements | 90 days by default | Deleted by a scheduled job. No derived summary is kept; see [Content Reach](/content-reach/#privacy). |
| **Short-lived** | | |
| Sign-in and invitation links | Sign-in links 15 minutes by default, single use; invitations 7 days | Deleted when an invitation is revoked, or by a scheduled job after expiry. |
| Dashboard sessions | 30 days by default from sign-in or from the last account switch, which starts a new session; not extended by other activity | Deleted when you sign out, or by a scheduled job after expiry. |
| GitHub app connection state, while you connect the app | 30 minutes | Deleted by a scheduled job after expiry, whether or not the connection completed. |
| Rate-limit counters | Until their counting window ends | Each counter deletes itself. |
| **No time limit** | | |
| Account, user and operator-action records, including team memberships | No time limit | On request only, except the record of operator actions, which is kept (see [what we keep](#erasure)). Removing a team member deletes their membership; what it leaves in place is under [access control](/trust/soc-2/#access-control). |
| API key records, including revoked ones | No time limit | On request only. |
| Billing records, including the usage ledger, account events and saved-card details | No time limit | On request, apart from what we keep; see [Erasure](#erasure). Removing a saved card clears it from the account, but the payment history still shows its brand and last four digits. |
| Assistant thumbs feedback and support-link records | No time limit | On request only. The transcript deletion does not cover them. |
| Insights snapshots for each period | No time limit | On request only. They outlive the transcripts they were built from. |
| Page ratings, page comments and survey answers | No time limit | On request only. |
| MCP tool-call telemetry | No time limit | On request only. |
| Support requests and escalations | No time limit | On request only. |
| Files of sites that were on managed hosting before it was retired | No time limit | Preserved in object storage at the retirement cutover. Nothing in the service serves or reads them, and the records that tied them to accounts were deleted then, so they can no longer be found by account. |
| Docs Quality Checks run history | No time limit | An owner can delete a finished run. Uninstalling the GitHub app removes the connection records but keeps the run history. |

The windows marked "by default" are set for the service as a whole, not a per-account
setting: you cannot change them for your account, and we can change them for everyone.
The deletion jobs run on a schedule, several times an hour. Some work in bounded batches
and take accounts in turn, so a record can stay for a time after its window ends, until a
job reaches it.

Several kinds of reader data can be switched off in your site's configuration; which have
a setting is under [what we process about your readers](/trust/privacy/#reader-data).
Records stored before a switch-off follow the schedule above, or stay until [erased](#erasure).

## Closing an account {#closing-an-account}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

There is no button for closing an account. The account owner emails
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com), and we close the account by
hand.

What closing does:

- **Archives the account.** Its status becomes closed, and a closed account cannot be
  reopened.
- **Revokes every API key,** so AI requests and other calls made with them stop.

What closing does not do:

- **It does not erase records.** The scheduled deletions keep running, so transcripts,
  search analytics and Content Reach rows still age out. Everything else stays;
  [erasure](#erasure) is a separate request.
- **It does not stop the analysis of conversations already stored.** Turns with a reasoning trace that have not
  been classified yet can still be classified, and billed against a remaining prepaid
  balance, until they age out or are erased. See the entry on automated analysis under
  [what we process about your readers](/trust/privacy/#reader-data).
- **It does not remove team memberships or end dashboard sessions.** Team members can
  still view the retained records in the dashboard.
- **It does not remove the saved card or the Stripe customer record.** The card stays
  attached at Stripe. To remove the card yourself first, see
  [Can I remove my saved card?](/support/removing-saved-card/).
- **A remaining prepaid balance is a refund question,** covered under
  [fees](/trust/terms/#fees) in the Terms of Service.

## Erasure {#erasure}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

Closing an account archives it and does not erase its records. To have personal data
erased, email us; we carry out the erasure by hand, confirm when it is done, and say
what we keep and why.

- **How to ask.** Email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com) and
  say what you want erased: the whole account, particular records, or your own user
  record. How we handle a privacy request is under
  [your rights](/trust/privacy/#your-rights) in the privacy policy, along with your
  other rights.
- **What we keep.** We erase what we can and keep the record of operator actions on the account and the records of payments and charges
  that we need for tax, accounting and dispute purposes. What those records hold is
  listed under [what we collect](/trust/privacy/#what-we-collect) in the privacy policy.
- **Readers' records.** You cannot delete an individual transcript, comment, rating or
  survey answer in the dashboard, so ask us. Reader records cannot be looked up by
  person; what a request has to identify is under
  [your rights](/trust/privacy/#your-rights) in the privacy policy. When you ask on a
  reader's behalf, the [Data Processing Addendum](/trust/dpa/) describes our role.
- **Where erased data can persist.** Erased data can remain in Cloudflare's
  point-in-time database recovery window, in platform logs, and in a pre-production copy
  of the database while one exists, until those age out or are removed. Copies held by
  other [subprocessors](/trust/subprocessors/), such as the Stripe customer record or
  email in our support mailbox, are separate from the database and are not removed by
  erasing a record from it. What OpenRouter or a model provider retains from a request
  is governed by their own terms; see
  [model providers](/trust/subprocessors/#model-providers).

## Exports {#exports}

There is no export of everything in an account. These exports exist:

- **Conversations.** A CSV of assistant conversations from the dashboard, up to 5,000
  turns per download, and a paginated feed of full turns for syncing to your own systems.
  Both cover only transcripts still inside the retention window. See
  [Programmatic export](/ai-assistant/#programmatic-export).
- **Analytics.** CSV downloads in the dashboard for top search terms, Content Reach
  pages, coverage gaps and top questions.

There is no full export of usage or billing history: the dashboard API returns only the
most recent rows, such as the 50 latest usage entries.

For anything else, email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com).
How we handle requests is under [your rights](/trust/privacy/#your-rights) in the privacy
policy. We do not promise a particular format.

## Backups and logs {#backups-and-logs}

- **Backups.** Aardvark runs no separate backup job. Recovery relies on the
  point-in-time recovery Cloudflare provides for its database, which is one of the
  places [erased data can persist](#erasure). There is no documented restore test. What
  else is not in place for recovery is listed under
  [Availability](/trust/soc-2/#availability) on the SOC 2 page.
- **Platform request logs.** Request logging for the cloud service is enabled on
  Cloudflare's platform. Cloudflare holds those logs for a limited period, and they can
  include request metadata such as URL and IP address. See
  [subprocessors](/trust/subprocessors/).
- **Run logs.** Logs from [Docs Quality Checks](/github-automation/) runs are kept at
  GitHub, where the dashboard reads them from. Aardvark cloud stores no copy.
- **Preview environments.** Pre-production environments can run against a copy of
  production data; see [confidentiality](/trust/soc-2/#confidentiality) on the SOC 2
  page. The scheduled deletions do not run on that copy, so data past its retention
  window, or erased from production after the copy was made, can remain there until the
  preview is removed.

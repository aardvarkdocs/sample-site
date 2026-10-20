---
title: Subprocessors
description: >-
  The outside companies Aardvark cloud depends on, the data each one handles,
  and when each one is involved.
icon: fa-solid fa-building-shield
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 13
sortableTables: false
filterableTables: false
---

# Subprocessors

On this page, a subprocessor is a company that handles customer or reader data on
Aardvark's behalf so that Aardvark cloud can run. None of these companies handles
anything for us about a site you build and host yourself with no cloud features turned
on; see
[what talks to Aardvark cloud, and when](/security/#what-talks-to-aardvark-cloud-and-when).

## The list

| Subprocessor | What it does for Aardvark cloud | Data it handles | When it is involved |
| --- | --- | --- | --- |
| Cloudflare | Runs the service: compute, database, cache, email delivery, and platform request logs. Also receives email sent to our support address and forwards it. | All data Aardvark cloud stores or serves; the recipient and content of each email we send, and of each email you send to our support address; request metadata, including in its platform request logs (see [backups and logs](/trust/data-retention/#backups-and-logs)). | Always. |
| Stripe | Processes payments and hosts the page where you enter a card. | The account owner's email address, your account identifier, the amount of each charge, and the card details you enter. | When you add a card or top up, whether by hand or by auto top-up. |
| OpenRouter | Receives every AI request and routes it to a provider that runs the model. | Prompts, the docs pages sent as context, and reader attachments; stored assistant transcripts when they are analyzed; and, for the dashboard's support assistant, the conversation and the account details described under [what is sent](#what-is-sent). | When an AI feature runs. |
| Google | Hosts the mailbox (Gmail) where email sent to our support address is stored. | Your email address and whatever your message contains, including privacy and erasure requests. For a dashboard support-form submission: the submitter's email address, your account identifier and the message. | When you email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com) or submit the dashboard's support form. |
| GitHub | Runs Docs Quality Checks for the GitHub app, and holds escalated support conversations. | Your repository's contents during a run, the run's logs, and repository and branch names. For an escalation, the conversation, a log of the assistant's actions and the account details listed below. | Only when you install the GitHub app or escalate a support conversation. |

Some detail behind those rows:

- **Cloudflare.** All email from Aardvark cloud, such as sign-in links, team
  invitations and account notifications, is sent through Cloudflare from
  `noreply@aardvarkdocs.com`. Email you send to `support@aardvarkdocs.com` is received
  by Cloudflare and forwarded to a mailbox hosted by Google, where it is stored. The copy
  of each dashboard support-form submission that is emailed to us goes to the same mailbox.
- **Stripe.** How card details are handled, and what Aardvark stores about a card, is
  under [what we collect](/trust/privacy/#what-we-collect) in the privacy policy.
- **GitHub.** With the [GitHub app](/github-automation/) installed, Docs Quality Checks
  run on GitHub-hosted runners in a repository Aardvark owns, not in yours. A run checks
  out your repository on that runner, runs the check, and opens or updates a pull request
  in your repository with the result; the run's logs stay at GitHub (see
  [backups and logs](/trust/data-retention/#backups-and-logs)). When you escalate from the
  dashboard's support assistant, Aardvark stores the request and files it as an issue in a
  private Aardvark repository; the filing contains the conversation, a log of the actions
  the assistant attempted with their inputs and results, the requester's and the account
  owner's email addresses, the requester's user identifier and role, and the account's
  identifier, status and balance, with API key values masked. A filing GitHub refuses
  stays in Aardvark's records.

How Cloudflare's and OpenRouter's availability bears on ours is under
[uptime](/trust/terms/#uptime) in the Terms of Service.

## Model providers {#model-providers}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

OpenRouter is the only AI service Aardvark cloud calls. It passes each request to a
provider that runs the model, and which provider that is depends on the model and on
OpenRouter's routing. The companies downstream of OpenRouter are therefore not a fixed
list, and this page does not name them. The [model rates](/pricing/models/) page lists
every model the gateway serves, each an auto-updating alias rather than a pinned version.

### No training on your data

Aardvark's commitment not to train or fine-tune AI models on your data is made in the
Terms of Service, under [your content](/trust/terms/#your-content). It is a commitment
about what Aardvark itself does. OpenRouter and the model provider that answers a
request each handle it under their own terms, and those terms govern what they retain
from it. Aardvark does not currently send a per-request data-retention or no-training
preference upstream.

### Who picks the model

You pick the model for the reader assistant, for build-time AI and for `vark author`, from
the aliases on the [model rates](/pricing/models/) page, and aardvark's default applies when
you set none. Docs Quality Checks run `vark author` and build-time AI for you, so they follow
your setting too. Aardvark picks the model for the automated analysis of stored transcripts
and for the dashboard's analytics and support assistants, so those requests can be served by a
different provider from the one behind your model (see
[how it's billed](/ai-assistant/#how-its-billed)).

### What is sent, and what is not {#what-is-sent}

What goes to OpenRouter, and through it to the provider that runs the model, depends on
the feature:

- **The reader assistant.** The question, the docs pages selected as context, any
  files the reader attached, and a hidden note the reader does not type: the title and
  source path of the page they are on and, when they opened the assistant from a page's
  "Ask a question" button, from a search (with the words they searched) or from the
  knowledge base's ask field, how they arrived. That note rides the first message of a
  conversation and any later message sent right after such an opening. The first message
  also carries that browser tab's session activity (pages visited, time spent in
  sections, and search terms). By default, OpenRouter converts an attached PDF to text
  before the model reads it.
- **Build-time AI features.** The page content they work on.
- **`vark author`, and the Docs Quality Checks that run it for you.** The body of the
  page an action works on, plus its title for the keyword and description actions; the
  rest of its front matter is not sent. The outbound-link check sends only a broken link
  and its link text, never the page, and the writing agent sends your conversation with
  it, the pages it opens, and a list of your site's pages with their titles and word
  counts.
- **Automated analysis of stored transcripts.** Stored assistant turns (the question,
  the answer and, when captured, the model's reasoning) are sent to a model through
  OpenRouter again for your dashboard's analytics; the per-answer classification runs
  only for turns with a reasoning trace.
- **The dashboard's analytics assistant.** Your question with a summary of your
  account's analytics.
- **The dashboard's support assistant.** Your conversation with your account identifier,
  the owner's email address, your role, and the account's status and balance; for owners
  and admins, also whether a card is saved and whether auto top-up is on. The result of
  each account action you approve in that conversation goes to the model too, which,
  depending on the action, can include your team list (email addresses and roles), your
  key list, usage figures, recent reader feedback, a saved card's brand, last four digits
  and expiry. If
  you escalate, the conversation is also filed with GitHub; the GitHub entry above says
  what the filing contains.

When the assistant answers a reader, Aardvark does not forward the reader's IP address
or the site's origin, and it sends no account or user identifier. The docs content sent
as context can itself name your site and contain its URLs.

Which reader-facing features are on by default, and the settings that turn them off,
including how to stop the automated analysis, are in the privacy policy under
[what we process about readers](/trust/privacy/#reader-data).

## This website

aardvarkdocs.com uses Aardvark cloud the way a customer's site does, so the list above
applies to it. The other companies this website loads files from or links out to, Google
Analytics among them, are described in the privacy policy under
[This website](/trust/privacy/#this-website).

## Services you choose

These are not Aardvark's subprocessors: you decide whether to use them.

- **A webhook endpoint**, if you give us one for account notifications. It receives
  the notification type, your account identifier, the balance and a timestamp.
- **Analytics integrations and custom HTML** you add to your own site. The provider's
  script runs in your readers' browsers. See [Analytics](/analytics/).
- **Map tiles and icon files**, which a reader's browser fetches directly from their
  provider, and, for a map pin given a street address, the geocoding service your build
  asks to look it up (OpenStreetMap's Nominatim by default; see
  [geocoding, privacy and offline builds](/components/extras/map/#geocoding-privacy-offline-builds)).

Separately, the `vark` command-line tool can check GitHub for a newer release. The
request carries the tool's version and nothing about your site; the
[CLI reference](/cli/) says when it checks and how to turn it off.

## Changes {#changes}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

We update this list when we add a subprocessor; the updated list is the notice. If you
object to a change, email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com);
if we cannot resolve your objection, you may close your account (see the
[Terms of Service](/trust/terms/#termination)).

There is no email list for subprocessor changes and we do not promise a separate email,
so check this page if you need to track them. Changes are posted here, and the "Last
modified" date on this page shows when it last changed.

The model providers behind OpenRouter are not on this list, and the provider that answers
a request can change with the model and with OpenRouter's routing; see
[Model providers](#model-providers).

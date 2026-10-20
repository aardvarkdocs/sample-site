---
title: Privacy policy
description: >-
  What personal data Aardvark collects, why, who receives it, and the choices
  you and your readers have.
icon: fa-solid fa-user-shield
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 11
sortableTables: false
filterableTables: false
---

# Privacy policy

Which parts of this policy apply depends on how you use Aardvark. "Aardvark cloud"
means the hosted service: the dashboard and the gateway API.

- **You build and host a site yourself, with no cloud features.** The software needs no
  account, and that site sends us nothing about itself or its readers (see
  [what talks to Aardvark cloud and when](/security/#what-talks-to-aardvark-cloud-and-when)).
  For that site, only [Browser storage](#browser-storage) applies.
- **You use Aardvark cloud or visit this website.** Aardvark is the controller: we decide
  how data about dashboard users and account owners, billing, support requests and visitors
  to aardvarkdocs.com is used.
- **You read a site whose owner uses Aardvark cloud features.** The site's owner is the
  controller and Aardvark is their processor; the
  [Data Processing Addendum](/trust/dpa/) governs that processing. Contact the site's owner
  first, because they decide what their site collects.

## What we collect when you use Aardvark cloud {#what-we-collect}

**Account and sign-in data.** Your email address, stored in lowercase, is your sign-in
identity. We also store a random user ID, a created time and a last-sign-in time. There is
no password: you sign in with a single-use
[emailed link](/security/#team-security-in-the-dashboard). The dashboard does not ask for a
name, postal address or phone number.

**Team data.** Your [role](/security/#team-security-in-the-dashboard) and when you joined.
Teammates can see each other's email address, role and join date. An invitation holds the
invitee's email address until it expires or is revoked, and shows them the inviter's and the
account owner's addresses.

**Billing data.** Stripe processes payments. You enter card details on a Stripe-hosted page;
Aardvark never receives the card number or security code. What we give Stripe is on the
[subprocessor list](/trust/subprocessors/). We store Stripe's customer and payment-method
identifiers, the card's brand, last four digits and expiry date, and a record of each
top-up, charge and failed payment, and of a card being saved or removed.

**Usage records.** Each metered AI request adds a record of the time, account, API key,
model, token counts and cost, with no question or answer text. A request made by the
dashboard's support assistant also records the signed-in user's ID, and owners and admins can
see usage grouped by the member who created each key.

**Support requests.** Email you send to our support address is stored in our support
mailbox. What you submit through the dashboard's support form is stored, and a copy is
emailed to that same address.
The dashboard's support assistant sends your conversation to a model provider together with
account data; [model providers](/trust/subprocessors/#model-providers) lists what a request
carries. Aardvark does not store the conversation unless you escalate it. An escalation is
stored by Aardvark and, when GitHub accepts it, filed as an issue in a private GitHub
repository; [Subprocessors](/trust/subprocessors/) lists what it contains.

**GitHub app data.** If you install the optional GitHub app, we store the name of the GitHub
user or organization it is installed on, the names and default branches of the repositories
you grant it, your automation settings, and a history of runs, including each run's
repository, branch, status and charge. While you connect the app, a short-lived record
holds a random connection token with your account and user identifiers (see the
[retention schedule](/trust/data-retention/#schedule)).

**What is not collected.** No password exists. No IP address or user agent is written to
account, session or API key records, and the records that hold reader data have no field for
an IP address, user agent, referrer or location. That describes Aardvark's database, not the
network: Cloudflare, which runs Aardvark cloud, processes IP addresses to serve every
request, and its platform keeps request logs for the service (see
[backups and logs](/trust/data-retention/#backups-and-logs)). Sign-in requests are
rate-limited by IP and email address; how long the counter is kept is in the
[retention schedule](/trust/data-retention/#schedule).

## What we process for our customers about their readers {#reader-data}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

A site sends reader data to Aardvark cloud only when its owner turns a cloud feature on.
The site's owner is the controller of that data, and Aardvark processes it for them under
the [Data Processing Addendum](/trust/dpa/).

Each entry below says what a feature processes and why, who the data is about, whether the
feature is on by default and how the owner switches it. Unless an entry says otherwise, the
data is about the site's readers. Settings written like `ai.assistant.store_history` are in
the site's configuration file and take effect at the next build and deploy. Switching a
feature off stops new collection. It does not delete what is already stored, which follows
the [retention schedule](/trust/data-retention/#schedule).

The records these features keep have no field for a reader's name, account or durable
identifier: the only identifiers tied to a reader are random IDs held in one browser tab.
Free text is stored as typed, without scanning or redaction, so it can contain whatever a
reader chose to write. Records from the reader features also carry the customer's own
account and API key identifiers, which identify the site, not the person using it. The
records have no field for an IP address, but Cloudflare processes IP addresses to serve
every request; see "What is not collected" above.

Turning the assistant on also turns on stored conversations and their automated analysis,
search analytics and cloud page ratings, unless the owner switches them off. It also turns
on thumbs feedback, which has no switch of its own, and, on a site whose owner runs the docs
MCP server with `vark serve`, MCP tool-call records.

- **Ask AI assistant.** Off by default; the owner turns it on with `ai.assistant.enabled`.
  To answer a question, the question and its context go through Aardvark cloud to a model
  provider. [What is sent](/trust/subprocessors/#what-is-sent) lists what a request
  carries, which includes any files the reader attaches and a hidden note about the page
  the reader is on and their activity in that tab. No setting turns that note off.
  Attachments are on by default and `ai.assistant.attachments: false` turns them off. The
  files themselves are never stored, but an answer or reasoning that quotes or summarizes
  an attachment is stored with the conversation when stored conversations are on.
  Answering stores only a usage record, with no question or answer text.
- **Stored conversations.** On by default with the assistant. Each finished turn is stored
  for the chat history and analytics in the owner's dashboard: the question, the answer,
  the pages cited and, when the model produced one, its reasoning. Every member of the owner's team can read
  stored conversations, and the assistant panel shows readers no notice that chats are
  stored. `ai.assistant.store_history: false` stops new turns being stored once the site is
  rebuilt and deployed; questions still go to the model to be answered. It does not delete
  turns already stored: they stay in the dashboard until they age out on the
  [retention schedule](/trust/data-retention/#schedule) or are
  [erased on request](/trust/data-retention/#erasure).
- **Automated analysis of stored conversations.** Runs whenever conversations are stored
  and has no switch of its own. Stored turns are sent a second time to a model, in two
  passes: one classifies each answer, and runs only for turns stored with the model's
  reasoning; the other groups reader questions into the Insights summaries in the owner's
  dashboard. [Model providers](/trust/subprocessors/#model-providers) says who picks that
  model. Those summaries quote example reader questions. The analysis is billed
  to the owner's account. `ai.assistant.store_history: false` stops new turns reaching the
  analysis, and with them the chat history and analytics built on new conversations. It
  does not stop the analysis of turns already stored: those can still be analyzed, and
  billed, until they age out or are erased.
- **Thumbs feedback.** On whenever the assistant is configured, with no switch of its own.
  A thumbs up or down stores the vote and the text of the question it rates, for the
  feedback reports in the dashboard, even with `store_history` off.
- **Support-link record.** A record is made when the assistant's "Email us" link under a
  down-voted answer is shown or clicked, for the analytics in the dashboard. It is made
  whether or not conversations are stored, and only while `ai.assistant.escalationEmail`
  is set, which it is not by default.
- **Search analytics.** On by default with the assistant. Stores the query text, result
  count, clicked result, timing, site language and a random per-tab ID, for the search
  analytics in the owner's dashboard. `search.analytics: false` turns capture off.
  `search.analytics.store_terms: false` keeps the counts and drops the query text; the
  search widget applies it in the reader's browser, and the server does not re-check it.
  See [search analytics](/search/#search-analytics-dashboard-ai-enabled-sites).
- **Page ratings and comments.** On by default with the assistant. The "Was this page
  helpful?" widget stores the star rating, the page path and any comment, for the feedback
  reports in the dashboard. `pageFeedback: false` removes the widget. See
  [page ratings](/analytics/#ratings-in-the-aardvark-cloud-dashboard).
- **Surveys.** Off by default; the owner turns them on with `survey.enabled`. With the
  assistant configured, each answer is stored with its survey and question IDs, the
  question type and the page path, for the feedback reports in the dashboard. Free text
  can run to 2,000 characters. See
  [reader surveys](/survey/#full-comments-with-the-ai-assistant).
- **Content Reach.** Off by default; the owner turns it on with `contentReach.enabled`.
  Stores the page path, which sections came into view and for how long, counts of five
  actions and a random per-tab ID, to show which parts of a page readers reach. See
  [Content Reach privacy](/content-reach/#privacy).
- **MCP tool calls.** Recorded by the docs [MCP server](/self-hosting/#the-mcp-server)
  that a site owner runs with `vark serve`. It records each tool's name and a one-line
  summary of its arguments, such as a search query, to show MCP usage in the dashboard. It
  does so when the site was built with the assistant configured, or when `vark serve` is
  started with both `AARDVARK_GATEWAY_URL` and `AARDVARK_MCP_KEY` set, even on a site built
  without the assistant. There is no other switch. The data is about the people and agents
  that query the docs.

**Do Not Track and Save-Data.** Content Reach and search analytics send nothing when the
browser signals either one; the check runs in the browser. The assistant, thumbs feedback,
ratings, comments and surveys check neither, and aardvark does not apply either signal to
analytics integrations a site owner adds; whether a vendor's own script honors them is up to
that vendor. Nothing in aardvark checks Global Privacy Control.

**Notice and consent.** aardvark ships no consent banner. Content Reach and surveys can wait
for a signal from the site's own banner, with `contentReach.requireConsent` and
`survey.requireConsent` (see [Content Reach](/content-reach/#consent) and
[surveys](/survey/#consent-gating)). Both settings are off by default, and the other
features have no consent gate. Customers are responsible for their own notice to readers
and for any consent their law requires.

## This website {#this-website}

aardvarkdocs.com is built with aardvark and runs most of these features, with Aardvark as
the controller and no consent banner.

- **Google Analytics** runs on every page; Google's script sets its own cookies, and consent
  mode is not used. Besides page views, Google receives your search terms and the result you
  open, your star rating for a page and the first 100 characters of its comment, and the
  first 100 characters of a survey answer. Google handles this data under its own terms.
- **Ask AI** is on with attachments, stored history and a support link, so every assistant
  entry above applies, including the automated analysis and the support-link record.
- **Search analytics and page ratings** store your query text, star rating and comment in
  Aardvark cloud.
- **A one-question survey** asks for a free-text comment, sent to Google Analytics (first
  100 characters) and to Aardvark cloud (up to 2,000 characters).
- **Content Reach** is on, and tool calls to the site's MCP endpoint are recorded as
  described above.
- **Third-party files.** Some pages load files from other companies straight into your
  browser: icon fonts and icons from public CDNs, map tiles on the map demo, sample images on
  a few component demos, and Stripe's test-mode payment fields on one demo page, where
  nothing is charged. In those roles they are not acting as Aardvark's subprocessors;
  Google's and Stripe's roles as subprocessors are on the [subprocessor list](/trust/subprocessors/).

To opt out of Google Analytics, install
[Google's opt-out browser add-on](https://tools.google.com/dlpage/gaoptout) or block
Google's analytics script. Do Not Track or Save-Data stops the Content Reach and search
analytics beacons only; Google Analytics, the assistant, ratings and the survey are
unaffected. Please do not put personal information in questions, comments or survey answers.

## How we use personal data {#how-we-use-data}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

We do not sell personal data and do not use it for advertising. That covers the data we
hold as a controller and the reader data we process for customers.

We use personal data for these purposes:

- **To provide the service.** We sign you in, run the cloud features a customer turns on,
  and send service email: sign-in links, invitations, account notifications and an opt-in
  Insights digest.
- **To bill.** We charge your card through Stripe, meter usage and keep payment records.
- **To prevent abuse and runaway spending.** The prepaid balance and its cutoff, the
  automatic [pause on unusual usage](/support/unusual-usage-pause/), and rate limits on
  some endpoints serve this purpose.
  [Application protections](/trust/soc-2/#application-protections) lists which protections
  are in place and which are not.
- **To answer support requests.**
- **To operate, maintain and secure the service.** Maintaining includes testing changes,
  which can use a copy of production data (see
  [confidentiality](/trust/soc-2/#confidentiality)).
- **To understand how this website is used,** as described under
  [This website](#this-website).
- **To meet legal requirements,** which can mean disclosing personal data when the law
  requires it.

## AI and model providers

AI requests go from Aardvark cloud through an AI request-routing subprocessor to a model
provider. Who picks the model, and what is and is not sent with a request, are under
[model providers](/trust/subprocessors/#model-providers); the commitment not to train AI
models on your data is in the Terms, under [your content](/trust/terms/#your-content).

## Who we share data with

- **Subprocessors,** the companies that handle data on our behalf so that Aardvark cloud
  can run. [Subprocessors](/trust/subprocessors/) names the companies Aardvark uses
  directly and what each receives; the model providers behind AI request routing vary by
  model and are not listed there. What Google receives from analytics on this website is
  under [This website](#this-website).
- **Your team.** Members see each other's email addresses and roles and can read the reader
  conversations and feedback stored for the account.
- **Services you connect.** A notification webhook or an analytics integration receives
  what you configure.
- **Aardvark's operators.** The people who run Aardvark cloud can access account and reader
  records to operate the service and answer support requests.
- **Authorities.** We disclose personal data when the law requires it.

## Browser storage {#browser-storage}

**The dashboard** sets a session cookie, `__Host-av_session`, to keep you signed in:
HttpOnly, Secure, SameSite=Lax, and cleared on sign-out. How long it lasts is in the
[retention schedule](/trust/data-retention/#schedule). The dashboard also keeps values in
local storage: for each account you top up, a random token under a key that names the
account, which stops a top-up being charged twice. It loads no third-party scripts, fonts or
analytics.

**Sites built with aardvark** set no cookies by default. Preferences and feature state live
in local storage, which lasts until the reader clears site data, or session storage, which
ends with the tab:

| Key | Kept in | Purpose |
| --- | --- | --- |
| `aardvark-color-scheme`, `aardvark-nav-open`, `aardvark-code-lang`, `aardvark-api-lang`, `aardvark-ai-zoom`, `aardvark-banner-<hash>` | Local storage | Theme choice, open sidebar branches, last code-sample language (in code tabs and in the API reference), assistant zoom level, a dismissed banner |
| `aardvark-survey-roll` | Local storage | Surveys shown to a sample of readers: a random number that keeps a reader in or out of the sample. It stays in the browser |
| `aardvark-doc-pw-fails:<area>` | Local storage | Password-protected pages: the number of failed password attempts |
| `aardvark-doc-key:<area>` | Session storage | Password-protected pages: the derived decryption key, never the password; see [protected pages](/protected-pages/#security-notes) |
| `aardvark-activity` | Session storage | Recent search terms; with the assistant on, also pages visited and time on sections |
| `aardvark-chat:<scope>` | Session storage | Assistant: the last 60 messages and the conversation's random ID; for a file the reader attached, its name, type and size, never the file itself |
| `aardvark-search-session`, `aardvark-search-seq`, `aardvark-reach-session`, `aardvark-reach-seq` | Session storage | Search analytics, Content Reach: a random per-tab ID and an event counter each |
| `aardvark-reach-sampled`, `aardvark-reach-tab`, `aardvark-reach-nav` | Session storage | Content Reach: the tab's sampling decision, a random marker for the tab that wrote these keys, and a one-time note that a search result was opened |
| `aardvark-api-key:<spec>` | Session storage | API reference: a pasted API key the reader chose to remember |

Cookies set by another company's script appear only when a site owner adds an integration
or a component whose script sets them. On this website, that is Google Analytics, whose
script sets its cookies on aardvarkdocs.com; Stripe's script on the component libraries
demo page can also set its own.

## How long we keep it

Some records are deleted on a schedule, such as assistant transcripts, search events and
Content Reach data. Most others, such as account records and reader feedback, have no time
limit and are kept until erased on request; some billing records are kept even then. The
[retention schedule](/trust/data-retention/#schedule) lists each kind of record and how
long it is kept.

## Where data is processed {#where-data-is-processed}

Aardvark cloud runs on Cloudflare's global network, and our other subprocessors process data
in the locations they operate. No storage region is pinned and there is no data residency
option today, including no EU-only option, so personal data may be processed in countries
other than your own.

For data we process on a customer's behalf, the [Data Processing Addendum](/trust/dpa/)
says what it does and does not include for international transfers.

## Security

[Security & trust](/security/) describes how the product and the cloud service protect
data, and the [SOC 2 page](/trust/soc-2/) lists the controls that are in place and those
that are not. No independent audit has been completed; see
[SOC 2 status](/trust/soc-2/#status).

## Your rights {#your-rights}

_This section forms part of the [Data Processing Addendum](/trust/dpa/)._

Depending on where you live, laws such as the GDPR and the CCPA give you rights over your
personal data: access, correction, erasure, export and objection.

- **How to ask.** Email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com) and say
  what you are asking for.
- **Who can ask.** Any person can ask about their own personal data: an account owner or
  team member, a visitor to this website, or a reader of a customer's site. A customer can
  also ask on a reader's behalf.
- **When we respond.** We respond within 30 days.
- **Confirming a request.** We may need to confirm that a request comes from the person or
  the account it concerns before we act on it.

**What you can do yourself today.** Any team member can export stored conversations and
analytics (see [exports](/trust/data-retention/#exports)); depending on your role you can
also revoke or rotate API keys, [remove a saved card](/support/removing-saved-card/) and
remove teammates, and whoever maintains the site can turn a cloud feature off in its
configuration. [Team security in the dashboard](/security/#team-security-in-the-dashboard)
says which of those a role can do, and what removing a teammate ends and leaves in place is
under [access control](/trust/soc-2/#access-control).

**What needs an email:** closing an account (the account owner asks), erasing your user
record or an account's data, changing your sign-in email address, deleting an individual
reader record, and getting a copy of data the dashboard does not export. What closing an
account does and does not do is under
[closing an account](/trust/data-retention/#closing-an-account), and how erasure works,
including what we keep, is under [erasure](/trust/data-retention/#erasure).

**Readers of a customer's site.** Ask the site's owner first, because they decide what
their site collects. You can also write to us; we act on the owner's instructions under the
[Data Processing Addendum](/trust/dpa/), so we may need to involve them. No reader
identifier is stored, so records cannot be looked up by person: a request has to identify
the page, the time or the text.

You can also complain to your local data-protection authority.

## Children {#children}

Aardvark cloud is a business tool not directed at children under 16.

## Changes to this policy

Changes to this policy are posted on this page, whose "Last modified" date shows when it
last changed.

## Contact

For privacy questions and data requests, email
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com). To report a security
vulnerability, see [Reporting a vulnerability](/security/#reporting-a-vulnerability).

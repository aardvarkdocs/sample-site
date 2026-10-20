---
title: Terms of Service
navtitle: Terms of Service
description: >-
  What you and Aardvark agree to when you use Aardvark cloud: your account and keys,
  fees, your content, what the service does and does not promise, and how an account
  ends.
icon: fa-solid fa-scale-balanced
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 16
---

# Terms of Service

## 1. These terms

These terms are the agreement between you and Aardvark ("we", "us") for Aardvark cloud: the
dashboard, the gateway API that handles AI requests, billing and analytics, and Docs
Quality Checks. "You" means the person or organization that holds an Aardvark cloud account.
Creating an account or using Aardvark cloud means you accept these terms. If you do that for
an organization, you accept them on its behalf and confirm that you are allowed to.

The aardvark software that you install and run yourself needs no account, and these terms do
not cover it. Aardvark cloud does not host sites: you host the static site that aardvark
builds, as [Deployment](/deployment/) describes.
[What talks to Aardvark cloud, and when](/security/#what-talks-to-aardvark-cloud-and-when)
says when a site you build contacts Aardvark cloud. These terms start to apply when you
create an account or turn on a feature that uses Aardvark cloud.

[Section 7](#acceptable-use) says what Aardvark cloud may not be used for. One other document
is part of these terms: the [Data Processing Addendum](/trust/dpa/), which applies wherever
we process personal data on your behalf, such as data about your readers.

Apart from the sections of other Trust Center pages that the Data Processing Addendum names
as part of it, nothing else is part of these terms. The pricing page, the support articles
and the other pages these terms link to explain how Aardvark cloud works today. They can
change, and a link to one does not make it a term. The [Privacy policy](/trust/privacy/) describes the
personal data we collect and how we handle it.

## 2. Your account and team {#account}

- **Responsibility.** The account owner is responsible for the account, for the people on
  its team and for everything done with its keys.
- **Roles.** Each person on a team holds a role, which decides who can manage billing, keys
  and teammates.
  [Team security in the dashboard](/security/#team-security-in-the-dashboard) names the
  roles and describes what each can do. You decide who joins your team and which role they
  hold.
- **Sign-in.** There are no passwords. Each person signs in with a link emailed to their own
  address. Use one accurate email address per person and do not share a sign-in. Keeping
  the mailboxes that receive sign-in links secure is your responsibility;
  [authentication](/trust/soc-2/#authentication) says what a sign-in link proves and which
  sign-in protections are not in place.
- **The secret key.** Keep the account's secret key secret: out of your built site, out of
  your repository and away from anyone who should not act as an owner. An owner can rotate
  it in the dashboard. Rotate it if it may have been exposed, and whenever someone who had
  it leaves. [Access control](/trust/soc-2/#access-control) says what the key can do,
  whether keys expire, and what removing a person from your team does and does not revoke;
  what ends a key is under [closing an account](/trust/data-retention/#closing-an-account).
- **The public key.** The public key is designed to ship inside your built site, where anyone
  who loads the site can read it. AI requests made with it are your usage and are charged
  to your account, whoever sends them; the reader feedback and analytics it also
  authenticates is not charged. Its spending is bounded by your prepaid balance and by the
  limits described in [section 3](#fees).
- **If a key leaks.** If you believe a key or a sign-in has been exposed or misused, rotate
  the key and tell us at [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com).

## 3. Fees {#fees}

Aardvark cloud is pay as you go. What it charges for and the published rate are on
[Pricing](/pricing/). Per-model AI rates are on [Model rates](/pricing/models/). All amounts
are in US dollars.

- **Prepaid balance and metered usage.** Usage is metered in dollars. Metered usage is the
  AI requests made with your keys, the AI that runs for your dashboard (the next item) and,
  if you use them, the runner compute for [Docs Quality Checks](/github-automation/). Your
  account holds a prepaid balance that you fund in advance. A Docs Quality Check run does
  not start once the balance is used up; one that has already started is billed when it
  finishes, which can take the balance below zero.
  [The prepaid model](/ai-gateway/#the-prepaid-model) explains how usage draws on the
  balance and what happens when it runs out.
- **AI that runs for your dashboard.** The automated analysis of stored assistant
  conversations is [metered to your account](/ai-assistant/#how-its-billed) like any other
  AI request, and so are the dashboard's analytics assistant ("Ask your analytics") and its
  support assistant when you use them. The privacy policy explains when the analysis runs
  and what turning it off does, under
  [what we process about readers](/trust/privacy/#reader-data).
- **Top-ups.** You fund the balance by charging a card saved to your account, either when
  you choose or automatically. Turning [auto top-up](/support/auto-top-up/) on authorizes us
  to charge your saved card the amount you chose each time your balance reaches the
  threshold you set, without asking you again. You can turn it off at any time.
  [Safety properties](/ai-gateway/#safety-properties) explains what limits those charges.
- **Payment.** Card payments are handled by a payment processor, named on the
  [subprocessor list](/trust/subprocessors/). The privacy policy says how card details are
  handled, under [what we collect](/trust/privacy/#what-we-collect).
- **Failed top-ups.** A declined charge never spends your balance;
  [prepaid balance safety](/support/prepaid-balance-safety/) explains what a failed top-up
  or a removed card does.
- **Spending limits are approximate at the margin.** The balance cutoff does not stop at
  the exact cent: requests already in flight when the balance runs out can overshoot it.
  [How precise the cutoff is](/support/spend-cutoff-precision/) explains by how much.
- **Refunds.** There is no automatic refund flow. If you believe a charge is wrong or want to
  request a refund, email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com) and we
  review it. That includes a prepaid balance left in an account when it is closed: closing
  the account does not refund it automatically.

## 4. Your content {#your-content}

You keep ownership of your content: your documentation, the repository a Docs Quality Check
works on, and the data that your account and your site send to Aardvark cloud. Nothing in
these terms transfers ownership of it to us.

You give us the permission we need to copy, store, process and transmit your content in order
to run the features you turn on. Depending on what you enable, that includes:

- when you use AI features, sending content through a routing service to the providers that
  run the models;
- when a Docs Quality Check runs, checking out your repository on a runner and opening pull
  requests against it;
- while history is on, storing assistant conversations and having a model analyze them for
  your dashboard;
- operating, maintaining, securing and billing the service, and answering your support
  requests.

We do not use your content, your readers' questions or your usage data to train or
fine-tune AI models. [Model providers](/trust/subprocessors/#model-providers) explains what
is sent to the providers that run the models and how they handle it.

You are responsible for your content. You confirm that you have the rights needed to upload
it and to let us handle it as these terms describe, and that it does not break
[section 7](#acceptable-use).

## 5. Your readers

When you turn on features that send data about your readers to Aardvark cloud, you are
responsible for your site's privacy notice and for any consent the law requires from your
readers. The [Data Processing Addendum](/trust/dpa/) sets out those responsibilities and
governs our processing of reader data.

## 6. AI features {#ai-features}

AI answers and other generated text come from third-party models. Aardvark does not review
an answer before it is shown. Answers can be wrong, incomplete or out of date, and they are
not legal, medical, financial or other professional advice. You are responsible for how you
use AI output and for what your site presents to its readers.

The models are supplied by third parties, so a model can change or be withdrawn, and
per-model rates can change with the providers' own prices.
[Model rates](/pricing/models/) lists the models the gateway can serve and their rates, and
[model providers](/trust/subprocessors/#model-providers) says who chooses the model for each
AI feature.

## 7. Acceptable use {#acceptable-use}

This section applies to you, to everyone on your team, and to anything done with your API
keys, including the requests your readers send with the public key in your site.

**Content and conduct.** Do not use any part of Aardvark cloud for:

- unlawful content or activity: anything that breaks a law that applies to you, or helps
  someone else break one;
- malicious content: malware, phishing, and anything that deceives people, such as
  collecting credentials or payment details under false pretenses;
- infringement: content that infringes someone else's copyright, trademark, privacy or
  other rights;
- harassment and threats: content that harasses or threatens people, or incites violence
  against them;
- child exploitation: content that sexualizes or exploits children;
- impersonation: passing yourself off as Aardvark, or as another person or organization.

**AI features.** In addition to [section 6](#ai-features):

- **Provider policies apply.** Your requests also have to follow the usage policies of the
  routing service and of the provider that runs the model that answers them, and a provider
  can refuse a request under its own policies. The content of a request goes to those
  companies, which handle it under their own terms, so do not send data you are not allowed
  to share with them.
- **No sensitive categories of data.** Aardvark cloud is not designed for special categories
  of personal data (such as health or biometric data, or data about a person's race, religion
  or sexual orientation), health records, or payment card data. Do not put them in prompts,
  attachments, comments or survey answers, and do not build a site that asks readers for
  them.

**The service itself.**

- **No attacks.** Do not probe, scan or attack Aardvark cloud; try to reach accounts, data or
  systems that are not yours; interfere with other customers, their sites or their readers;
  or send traffic designed to overload the service or to use up capacity that customers
  share.
- **No circumventing limits.** Do not try to bypass the system prompt the gateway sets for
  requests made with a public key, the cutoff when your prepaid balance runs out, or the
  limit on concurrent requests.
- **Use keys as intended.** A public key is meant to ship in your site; do not use one from
  an origin its account has not authorized. Never publish a secret key or put one in a site
  or in client-side code; [section 2](#account) says how to rotate one that is exposed.
- **Automation is fine.** Scripts, CI jobs and other automated clients that use the
  [documented API](/api/) are a normal use of the service.

**The GitHub app.** A [Docs Quality Checks](/github-automation/) run executes the check
against a checkout of your repository, on Aardvark's runners, and that is all a run is for:
do not use one for unrelated computing such as cryptocurrency mining, or to attack other
systems, and install the app only on repositories you own or are authorized to connect.

**What we do about misuse.** Aardvark does not automatically check prompts, attachments,
comments or survey answers against this section; we learn about misuse when we notice it or
when someone reports it. Three automatic controls limit spending and load on an account, and
none of them looks at content: the cutoff when your
[prepaid balance](/ai-gateway/#the-prepaid-model) runs out, the
[unusual usage pause](/support/unusual-usage-pause/) and the
[concurrent request limit](/support/concurrent-request-limits/). When we find misuse, we can
revoke API keys, suspend the account or close it, depending on how serious it is;
[section 9](#termination) says what a suspension and a closure do.

**Reporting misuse.** If you see an assistant that runs on Aardvark cloud, or the site it is
part of, used in a way that breaks this section, email
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com) with the URL and what you saw.
Report a security vulnerability through the private route under
[Reporting a vulnerability](/security/#reporting-a-vulnerability) instead.

## 8. The service

Aardvark cloud is provided as it is today. aardvark is pre-1.0 software, and features can
change or be removed.

We may pause processing to protect an account. An automatic safeguard,
[the unusual usage pause](/support/unusual-usage-pause/), can pause AI on your account;
that page says what it pauses, when it trips and how it is resumed. Automated safeguards
can also suspend an account without a decision by us, for example when the cost of its AI
requests cannot be confirmed. We may also limit or pause a feature when that is needed to
keep the service working or secure.

### Availability {#uptime}

Aardvark cloud has no servers of its own. The dashboard and the gateway API run on
Cloudflare Workers, and AI requests are routed through OpenRouter. Each publishes its own
status page: [Cloudflare's](https://www.cloudflarestatus.com/) and
[OpenRouter's](https://status.openrouter.ai/). Aardvark sets no availability target and
gives no remedy for downtime. There is no status page for Aardvark cloud.

## 9. Suspension and ending your account {#termination}

- **Closing your account.** The account owner can ask us to close the account by emailing
  [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com). Closing an account archives it
  and does not erase its records. [Closing an account](/trust/data-retention/#closing-an-account)
  explains what closing does and does not do, and
  [erasure](/trust/data-retention/#erasure) how to have records erased. A balance left in
  the account is covered by the refunds item in [section 3](#fees).
- **Suspension or closure by us.** We may suspend or close an account that breaks these terms,
  including [section 7](#acceptable-use), that has unpaid fees, or that puts the service or other people at
  risk. A suspended account's AI requests made with its API keys are refused, whether from
  the reader assistant, build-time AI, `vark author` or a Docs Quality Check, and so are
  top-ups and the reader data its site sends us (unlike the gateway's own pause when it
  cannot price requests, which a top-up lifts). Suspension does not stop everything: a
  scheduled or push-triggered Docs Quality Check still runs and its compute time is still
  billed, even though its AI requests fail; and the dashboard's own assistants still work,
  for a signed-in team member or with the account's secret key, as does the analysis of
  stored conversations, and both are still billed. Closure by us has the same effect as
  closure at your request. If you think we acted by mistake, email
  [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com).
- **What continues.** Closing an account does not cancel fees you already owe.
  [Sections 10](#disclaimers), [11](#liability) and [12](#claims) continue to apply, and so does the Data Processing Addendum for
  personal data we still process on your behalf. The Privacy policy and the
  [data retention page](/trust/data-retention/) describe the records we still hold.

## 10. Disclaimers {#disclaimers}

To the extent the law allows, Aardvark cloud is provided "as is" and "as available", without
warranties of any kind, whether express or implied. That includes implied warranties of
merchantability, fitness for a particular purpose and non-infringement.

We make no promise about [availability](#uptime). We do not promise that Aardvark
cloud will be uninterrupted or free of errors, that data will never be lost, or that AI
output will be accurate.

Aardvark cloud is not a backup of your site or your data. Keep your own copy of anything you
cannot afford to lose. The exports that exist are listed under
[exports](/trust/data-retention/#exports).

## 11. Limits on liability {#liability}

To the extent the law allows:

- We are not liable for indirect or consequential loss.
- Our total liability for any claim arising from these terms or from your use of Aardvark
  cloud is limited to the amount you paid Aardvark in the twelve months before the claim
  arose.

Nothing in these terms limits liability that cannot be limited by law.

## 12. Your responsibility for claims {#claims}

If someone else brings a claim against Aardvark because of your content, or because you or
someone on your team broke [section 7](#acceptable-use), you will cover the losses and
reasonable costs that result, including legal fees. This applies only as far as the claim
arises from your content or from that breach.

## 13. Changes to these terms {#changes}

Changes to these terms are posted on this page, whose "Last modified" date shows when it last
changed. For a material change to the Terms of Service (including [section 7](#acceptable-use)) or the Data
Processing Addendum, we email account owners before it takes effect. The subprocessor list
is the one exception: a change to it is announced as that page's
[changes](/trust/subprocessors/#changes) section says, on the page itself and not by email.

If you keep using Aardvark cloud after a change takes effect, the changed terms apply to you.
If you do not accept a change, you can stop using Aardvark cloud or ask us to close your
account, as [section 9](#termination) describes.

## 14. Contact

For questions about these terms, your account or a charge, email
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com).

To report a security vulnerability, see
[Reporting a vulnerability](/security/#reporting-a-vulnerability).

---
title: Data Processing Addendum
navtitle: Data processing (DPA)
description: >-
  The terms that apply when Aardvark cloud processes personal data on your behalf: what is
  processed, who else handles it, and what Aardvark does and does not commit to.
icon: fa-solid fa-file-contract
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 15
---

# Data Processing Addendum

{% callout title="Where this differs from a typical addendum" severity="info" %}
This addendum is narrower than a typical one. It includes no transfer mechanism such
as the EU Standard Contractual Clauses, no audit or inspection rights, no fixed number of
hours for incident notice, no automatic deletion when an account closes, and no claim that
subprocessors' terms mirror it. If your law requires any of these in a processor contract,
this addendum does not provide them.
{% endCallout %}

## 1. What this addendum is

This addendum applies when Aardvark cloud processes personal data on your behalf. That
happens in two cases: your site sends data about its readers to Aardvark cloud because you
turned on a cloud feature, or content of your own that Aardvark cloud handles for you
contains personal data, such as pages sent for build-time AI or `vark author`, or a
repository that a [Docs Quality Checks](/github-automation/) run checks out.

It forms part of the [Terms of Service](/trust/terms/), so there is nothing separate to
sign. Where the two disagree about the processing of personal data, this addendum wins.

It does not cover data Aardvark handles for its own purposes, such as your account, your
team's sign-in details and your billing records. The [Privacy policy](/trust/privacy/)
covers those. A site with no cloud features is outside it altogether: a default build
[makes no calls to Aardvark cloud](/security/#what-talks-to-aardvark-cloud-and-when).

## 2. Roles

You are the controller of the personal data covered here: you decide which features run on
your site and what your readers are told. Aardvark is your processor. If you run the site
for your own customers and act as their processor, Aardvark is your subprocessor and the
same terms apply.

As the controller, you are responsible for:

- **Your notice to readers.** Any notice your readers need has to come from you. What the
  assistant panel itself does and does not tell them is in the privacy policy, under
  [what we process about your readers](/trust/privacy/#reader-data).
- **Your legal basis and any consent.** The same section says whether aardvark supplies a
  consent banner, each feature's default, how it is switched on or off, and whether it can
  wait for a consent signal from your own banner.

## 3. What forms part of this addendum

These sections of other Trust Center pages form part of this addendum, and each says so on
its own page:

- **What is processed, about whom and why:**
  [what we process about your readers](/trust/privacy/#reader-data), and the content of
  your own that Aardvark cloud handles for you, as section 1 describes.
- **No sale or advertising use:**
  [how we use personal data](/trust/privacy/#how-we-use-data).
- **Who runs the models, and what is sent to them:**
  [model providers](/trust/subprocessors/#model-providers).
- **Requests from individuals:** [your rights](/trust/privacy/#your-rights).
- **Changes to the subprocessor list:** [changes](/trust/subprocessors/#changes).
- **The end of an account:** closing deletes nothing by itself; records stay until the schedule or an erasure request removes them. See
  [closing an account](/trust/data-retention/#closing-an-account) and
  [erasure](/trust/data-retention/#erasure).

Aardvark's commitment not to train AI models on your data is made in the Terms of Service
themselves, under [your content](/trust/terms/#your-content), and applies alongside this
addendum.

Every other page this addendum links to is explanation and is not part of it. The security
descriptions on the [Security](/security/) and [SOC 2](/trust/soc-2/) pages are Aardvark's
own, with no independent audit completed (see [SOC 2 status](/trust/soc-2/#status)). What
must not be sent, including special categories of personal data, is in the Terms of Service
under [acceptable use](/trust/terms/#acceptable-use).

## 4. Your instructions

Your instructions are the features you enable and the way you configure them in your site
configuration and the dashboard, together with this addendum. We process the data to
provide those features, to meter usage for billing, to answer your support requests, and to
operate, maintain and secure the service; we also disclose personal data when the law
requires it. Maintaining the service includes testing changes, which can use a copy of
production data (see [confidentiality](/trust/soc-2/#confidentiality)).

**Automated analysis of stored transcripts.** If your site stores reader conversations,
that also instructs us to run the automated analysis of them, including turns already
stored after you turn storing off, until they age out or are erased. What the analysis
does, whether it runs by default, and what turning stored conversations off does and does
not stop are in the entries on stored conversations and their automated analysis under
[what we process about your readers](/trust/privacy/#reader-data).

## 5. Subprocessors

You give general authorization for Aardvark to use the subprocessors listed on the
[Subprocessors](/trust/subprocessors/) page, which says what each one receives.

The companies that run AI models are reached through the AI request routing subprocessor
and are not a fixed list. [Model providers](/trust/subprocessors/#model-providers) says who
picks the model and what a request does and does not carry.

Subprocessors handle data under their own terms. We do not claim that those terms mirror
this addendum.

## 6. Requests from individuals

Privacy requests are made and answered as [your rights](/trust/privacy/#your-rights) sets
out. That covers you asking on a reader's behalf and a reader who writes to us directly.
Because you are the controller of your readers' data, we may need to involve you before
acting on a direct request.

## 7. Security incidents {#security-incidents}

If we learn of a security incident affecting your account data, we notify the account owner
by email without undue delay, with what we know and what we are doing. For this addendum,
account data includes the personal data we process on your behalf.

This addendum sets no fixed number of hours for the notice, and Aardvark has no formal
incident-response plan (see
[monitoring and incidents](/trust/soc-2/#monitoring)).

The notice goes to the account owner's email address, which the dashboard has no control
for changing, so email us if it needs to change. You remain responsible for any notice you
owe to regulators or to your readers.

## 8. International processing

Where data is processed, and whether it can be kept in one region, is described in the
privacy policy under [where data is processed](/trust/privacy/#where-data-is-processed).

This addendum includes no EU Standard Contractual Clauses or other transfer mechanism, and
Aardvark does not sign separate transfer agreements. If your use requires one, do not send
that personal data to Aardvark cloud.

## 9. Information for your reviews {#reviews}

The Trust Center is the information Aardvark makes available about how it handles your
data. For what it does not answer, email
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com). Aardvark does not complete
security questionnaires, there is no third-party audit report to share, and this addendum
gives no right to on-site audits or inspections.

## 10. Changes

Changes to this addendum are posted on this page, whose "Last modified" date shows when it
last changed. A change to one of the sections named in section 3 is a change to this
addendum and is posted on that section's own page, which shows its own "Last modified"
date. For a material change, on this page or in one of those sections, the notice described
under [changes to these terms](/trust/terms/#changes) applies, which excepts the
subprocessor list; that list [announces its own changes](/trust/subprocessors/#changes).

## 11. Contact

Email [support@aardvarkdocs.com](mailto:support@aardvarkdocs.com) about anything in this
addendum.

To report a security vulnerability, see
[Reporting a vulnerability](/security/#reporting-a-vulnerability).

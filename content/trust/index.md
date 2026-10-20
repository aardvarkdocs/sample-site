---
title: Trust Center
navtitle: Overview
description: >-
  Where to find what Aardvark does about security, privacy and customer data,
  what is not in place, and each policy.
icon: fa-solid fa-shield-halved
heading: Trust Center
heading-icon: fa-solid fa-handshake
menu: pricing
lastmod: 2026-10-19 # bump on every edit; production builds show no git dates
weight: 10
---

# Trust Center

The product of an aardvark build is a directory of static files that you own and host.
Aardvark cloud (the dashboard and the gateway API) is a separate service, and a site
sends data to it only for the cloud features you turn on. The
[Security](/security/) page describes the security architecture, including
[what talks to Aardvark cloud and when](/security/#what-talks-to-aardvark-cloud-and-when).

Turning on the AI assistant turns on other cloud features with it. The privacy policy
lists what each cloud feature sends and stores, and which are on by default, under
[What we process for our customers about their readers](/trust/privacy/#reader-data).

## Find an answer

Each topic links to the section that states it.

- **Independent audit:** [SOC 2 status](/trust/soc-2/#status)
- **Penetration testing:** [Secure development and supply chain](/trust/soc-2/#supply-chain)
- **Sign-in and team access:** [Authentication](/trust/soc-2/#authentication),
  [Team security in the dashboard](/security/#team-security-in-the-dashboard)
- **Payments and card data:** [What we collect](/trust/privacy/#what-we-collect)
- **No AI training on your data:** [Your content](/trust/terms/#your-content) in the Terms
- **What Aardvark cloud may not be used for:** [Acceptable use](/trust/terms/#acceptable-use) in the Terms
- **Model providers:** [Model providers](/trust/subprocessors/#model-providers)
- **Where data is processed:** [Where data is processed](/trust/privacy/#where-data-is-processed)
- **How long data is kept:** [Retention schedule](/trust/data-retention/#schedule)
- **Closing an account and erasure:** [Closing an account](/trust/data-retention/#closing-an-account),
  [Erasure](/trust/data-retention/#erasure)
- **How personal data is used:** [How we use personal data](/trust/privacy/#how-we-use-data)
- **Privacy requests:** [Your rights](/trust/privacy/#your-rights)
- **Security incidents:** [Security incidents](/trust/dpa/#security-incidents)
- **Subprocessors:** [The list](/trust/subprocessors/), [changes to it](/trust/subprocessors/#changes)
- **Availability:** [Availability](/trust/terms/#uptime)
- **What is not in place:** each section of the [SOC 2 page](/trust/soc-2/) lists it.

## Documents

{% cardGrid colsBase=1 colsSm=2 colsLg=3 %}

{% card title="Privacy policy" icon="user-shield" href="/trust/privacy/" cta="Read" %}
What personal data Aardvark collects, why, who receives it, and how to exercise your rights.
{% endCard %}

{% card title="Security and SOC 2 status" icon="list-check" href="/trust/soc-2/" cta="Read" %}
Whether Aardvark has been audited, what is in place, and what is not.
{% endCard %}

{% card title="Subprocessors" icon="building" href="/trust/subprocessors/" cta="Read" %}
The vendors that handle customer data for Aardvark cloud, and what each one receives.
{% endCard %}

{% card title="Data retention and deletion" icon="database" href="/trust/data-retention/" cta="Read" %}
How long each kind of record is kept, what closing an account does, how erasure works, and which exports exist.
{% endCard %}

{% card title="Data Processing Addendum" icon="contract" href="/trust/dpa/" cta="Read" %}
The terms that apply when Aardvark processes personal data on your behalf.
{% endCard %}

{% card title="Terms of Service" icon="file-text" href="/trust/terms/" cta="Read" %}
The agreement for using Aardvark cloud: accounts, fees, acceptable use, liability and termination.
{% endCard %}

{% card title="Security" icon="shield-lock" href="/security/" cta="Read" %}
The security architecture: what talks to Aardvark cloud and when, and how to report a vulnerability.
{% endCard %}

{% endCardGrid %}

## Contact

For privacy, security and legal questions, and for data requests, email
[support@aardvarkdocs.com](mailto:support@aardvarkdocs.com).

To report a security vulnerability, see
[Reporting a vulnerability](/security/#reporting-a-vulnerability).

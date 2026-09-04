---
title: Why did my AI pause with an “unusual usage” message?
description: An automatic safety brake pauses paid AI when spending spikes far above your normal pattern — one click resumes it.
nav: false
taxonomy:
  - name: support
    tags: ["Payments & limits"]
    leftnav: true
    articleCount: true
---

# Why did my AI pause with an “unusual usage” message?

An automatic safety brake noticed spending far above your account's normal pattern and paused
paid AI to protect you from a runaway bill — a scraped widget or a CI loop, typically. It trips
when a single day's metered AI spend goes above both $25 and 10× your trailing seven-day daily
average — with no spend in those seven days there is no average to beat, so that rule stays
dormant — or when a single day goes above $200 while that average is $25 or less, which is what
catches a runaway on a new or barely-used account. It isn't a funds problem, and it doesn't stop
free-model answers or GitHub Automations compute. It stays paused until an owner or admin clicks
**Resume AI** on the Billing page; after that it re-arms against new spending, so a runaway that
continues pauses again.

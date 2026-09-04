---
title: What exactly counts against the included AI?
description: The billed dollar cost of metered requests counts against your allowance, pooled account-wide and drained before your prepaid balance.
nav: false
taxonomy:
  - name: support
    tags: ["Included AI"]
    leftnav: true
    articleCount: true
---

# What exactly counts against the included AI?

The billed cost of metered requests — the same number the dashboard meter and your usage
ledger show, measured in real dollars, not opaque credits. That covers reader-assistant
answers, build-time AI features and authoring runs from the CLI, and the Insights passes that
grade and cluster your stored conversations. It pools across your whole account and drains
before your prepaid balance. A free-model **answer** is always $0 — but those Insights passes
run on their own model, not the answering one, so a conversation a free model answered can
still draw the allowance; turn `store_history` off if you'd rather nothing were stored to
analyse. Usage-based GitHub Automations compute bills your prepaid balance directly rather
than the allowance.

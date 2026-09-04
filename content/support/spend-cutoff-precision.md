---
title: Is the cutoff an exact-to-the-penny $0 guarantee?
description: The cutoff stops within roughly one request's cost of your limit, so keep a small buffer if you need a hard ceiling.
nav: false
taxonomy:
  - name: support
    tags: ["Payments & limits"]
    leftnav: true
    articleCount: true
---

# Is the cutoff an exact-to-the-penny $0 guarantee?

No — it stops within roughly one request's cost of your limit, not to the exact cent. The final
request is admitted while you're still in the black and then billed for what it actually used.
The pre-flight hold covers a request's input at the model's real price but not its output, so
the overshoot is about one answer's worth per request that was already in flight — up to five,
the [concurrent-request limit](/support/concurrent-request-limits/). If you need a hard ceiling,
keep a small buffer.

The same one-request bound applies to your included allowance and your overflow cap. Under
cap-and-hold the overshoot is carried against your allowance and paid down by next month's
grant; under pay-as-you-go it's a real charge to your prepaid balance, so it isn't repaid later.

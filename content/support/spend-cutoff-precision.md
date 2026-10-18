---
title: Is the cutoff an exact-to-the-penny $0 guarantee?
description: Requests already in flight can finish and bill after the balance runs out, so keep a small buffer if you need a hard ceiling.
nav: false
taxonomy:
  - name: support
    tags: ["Payments & limits"]
    leftnav: true
    articleCount: true
---

# Is the cutoff an exact-to-the-penny $0 guarantee?

No — requests admitted while the account still has funds can finish and bill after the balance
runs out. Each is billed for what it actually used.
The pre-flight hold covers a request's input at the model's real price but not its output, so
the overshoot is about one answer's worth per request that was already in flight — a set the
[concurrent-request limit](/support/concurrent-request-limits/) keeps small. That limit bounds how
many requests can be admitted before their bills are recorded; a long answer keeps streaming after
its bill lands, so it is a bound on the burst, not an exact count. If you need a hard ceiling,
keep a small buffer.

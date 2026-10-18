---
title: Designing the honest AI meter
description: Why Aardvark bills AI in dollars instead of credits, and the guardrails that keep a metered feature from ever producing a surprise bill.
date: 2026-07-08
taxonomy:
  - name: blog
    leftnav: dates
    tags: [pricing, product]
    authorName: Aardvark product
    tagCloud: true
---

# Designing the honest AI meter

Most products meter AI in **credits** — a currency you can't reason about, converted at a
rate you can't see. When we designed Aardvark's AI billing, we set one constraint up front:
every number a customer sees is a **dollar**. Here's what that constraint produced.

**Published prices, real arithmetic.** [The pricing table](/pricing/models/) lists what
every model costs per answer — real figures, no conversion math. The dashboard shows dollars
funded, dollars spent and your trailing burn rate. No "≈N answers" marketing math.

**The worst case is written down.** AI is served from what you have funded and stops when it
is gone. Auto top-up, if you turn it on, adds the amount *you* chose each time the threshold
*you* set is crossed — every crossing, not once — so with it on your real ceiling is however
long you leave it on; a fixed budget means leaving it off. The cutoff is bounded rather than
exact: the requests already
in flight when the balance runs out — a set the concurrency cap keeps small — each finish and
bill what they actually used, so a hard ceiling means keeping a small buffer.

**Guardrails assume something will go wrong.** An automatic safety brake pauses AI
when spending runs far above your account's normal pattern — one click resumes it, and it
guards every account. Concurrent requests are capped per account;
past the cap a request gets a brief `429` with a `Retry-After` rather than queueing up a
bill. And we're precise about our own precision: the cutoff overshoots by about one answer
per request that was already in flight, never to the exact cent, and the docs say so.

Some smaller choices fell out of the same principle. There is no separate pool of credit to
reason about: each metered answer draws the prepaid balance directly.

None of this is complicated. It's mostly the discipline of refusing a layer of
abstraction that only ever benefits the seller. The full details — every edge case, in
plain language — live in the [support knowledge base](/support/).

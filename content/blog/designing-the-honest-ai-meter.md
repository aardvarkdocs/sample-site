---
title: Designing the honest AI meter
description: Why aardvark bills AI in dollars instead of credits, and the guardrails that keep a metered feature from ever producing a surprise bill.
date: 2026-07-08
taxonomy:
  - name: blog
    leftnav: dates
    tags: [pricing, product]
    authorName: aardvark product
    tagCloud: true
---

# Designing the honest AI meter

Most products meter AI in **credits** — a currency you can't reason about, converted at a
rate you can't see. When we designed aardvark's AI billing, we set one constraint up front:
every number a customer sees is a **dollar**. Here's what that constraint produced.

**Published prices, real arithmetic.** [The pricing table](/pricing/models/) lists what
every model costs per answer on every plan — real figures, no conversion math. Paid plans
include a monthly allowance denominated in those same billed dollars, and the dashboard
shows dollars included, dollars used, your own trailing burn rate, and an estimated
depletion date. No "≈N answers" marketing math.

**The worst case is written down.** The default when your included AI runs out is
**cap-and-hold**: paid AI pauses, readers fall back to free models, and your max possible
bill is your subscription price plus any fixed add-on-seat charges and any overflow already
incurred this month. If you opt into pay-as-you-go overflow, the dashboard also includes
whatever remains under the cap *you* set. Raising that cap past 2× your allowance asks for
an explicit acknowledgment,
once, because a large overage should be a decision rather than a surprise.

**Guardrails assume something will go wrong.** An automatic safety brake pauses paid AI
when spending runs far above your account's normal pattern — one click resumes it.
Concurrent paid requests are capped per account. And we're precise about our own
precision: the cutoff stops within roughly one request's cost of your limit, not to the
exact cent, and the docs say so.

Some smaller choices fell out of the same principle. Unused allowance rolls over one
month, capped at about two months banked, so a quiet period can't build into a bill-shaped
balloon. Answers served by `:free` models never bill at all. And a paid plan's metered AI
never touches your prepaid balance unless you opt into overflow — on Free, where AI is
pay-as-you-go, each metered answer draws that balance directly.

None of this is complicated. It's mostly the discipline of refusing a layer of
abstraction that only ever benefits the seller. The full details — every edge case, in
plain language — live in the [support knowledge base](/support/).

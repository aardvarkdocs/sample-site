---
title: What if I fire a lot of AI requests at the same time?
description: Concurrent paid requests are capped per account; extras get a brief 429 with a Retry-After and can be retried once a slot frees.
nav: false
taxonomy:
  - name: support
    tags: ["Payments & limits"]
    leftnav: true
    articleCount: true
---

# What if I fire a lot of AI requests at the same time?

We cap how many paid requests run at once per account — five by default — to keep spending
predictable. Extra concurrent requests get a brief `429` with a `Retry-After: 2` header (two
seconds) — retry after it, possibly more than once while the account is still at its cap.
Free-model requests aren't limited this way. The cap covers the whole account, so reader
questions on your docs and your own CLI runs share it; if your docs are busy enough to hit it
regularly, contact support.

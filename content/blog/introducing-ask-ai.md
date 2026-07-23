---
title: Introducing Ask AI, the reader assistant
description: aardvark 0.8 ships a native Ask AI panel that answers reader questions from your own docs, with cited sources and metered, dollar-based billing.
date: 2026-05-05
image: /landscape.jpg
taxonomy:
  - name: blog
    leftnav: dates
    tags: [ai, product]
    authorName: The aardvark team
    authorAvatar: /favicon.svg
    badgeText: Product
    tagCloud: true
---

# Introducing Ask AI, the reader assistant

With 0.8.0, every aardvark site can ship a native **Ask AI** assistant. A floating panel
sits on every page; readers ask a question in natural language, and the assistant answers
from **your content**, citing the pages it used. Each answer can be rated 👍 / 👎, and
readers can attach images, PDFs, or code when a screenshot says it better than a sentence.

There is no third-party widget to embed. The assistant is a first-party feature that calls
the [aardvark cloud gateway](/ai-gateway/), which proxies the model, meters the spend, and
records the conversation for analysis. Enabling it is two lines of config:

```yaml
ai:
  assistant:
    enabled: true
```

plus a spend-capped public gateway key baked in as a build-time environment variable —
never a provider key in your repo.

Two design choices matter most. First, **grounding**: when your corpus fits the model's
context budget, the assistant inlines the whole thing on the first turn and answers with
zero fetches; when it doesn't, it navigates your docs page-by-page, reasoning about which
page to read next. Either way the answer comes from what you actually published. Second,
**honest metering**: usage bills in real dollars against a capped allowance, so a public
docs site can offer AI answers without signing up for an unbounded bill. Bring your own
key, or try it on the bundled, capped allowance.

Behind the panel sits a conversation-analytics dashboard — top questions, coverage gaps,
intent tags — so every reader question becomes product insight. You're reading the docs of
a site that runs it: press <kbd>Cmd</kbd>+<kbd>I</kbd> and ask something.

Read more on the [AI assistant](/ai-assistant/) page, or see the
[changelog entry](/changelog/) for the release details.

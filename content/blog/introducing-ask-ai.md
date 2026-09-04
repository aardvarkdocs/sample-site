---
title: Introducing Ask AI, the reader assistant
description: Aardvark 0.1.6 shipped a native Ask AI panel that answers reader questions from your own docs, with cited sources and metered, dollar-based billing.
date: 2026-06-18
image: /landscape.jpg
taxonomy:
  - name: blog
    leftnav: dates
    tags: [ai, product]
    authorName: The Aardvark team
    authorAvatar: /favicon.svg
    badgeText: Product
    tagCloud: true
---

# Introducing Ask AI, the reader assistant

Since 0.1.6, every Aardvark site can ship a native **Ask AI** assistant. A floating panel sits
on every page; readers ask a question in natural language, and the assistant answers from
**your content**, citing the pages it used. Each answer can be rated 👍 / 👎, and — since
0.1.9 — readers can attach images, PDFs, or code when a screenshot says it better than a
sentence.

There is no third-party widget to embed. The assistant is a first-party feature that calls
the [Aardvark cloud gateway](/ai-gateway/), which proxies the model, meters the spend, and
records the conversation for analysis. Enabling it is two lines of config:

```yaml
ai:
  assistant:
    enabled: true
```

plus a spend-capped **public** gateway key (`aardvark_live_…`) baked in as the `AARDVARK_KEY`
build-time environment variable — never a provider key in your repo, and never the secret
key: a build handed one fails rather than shipping it inside a static site.

Two design choices matter most. First, **grounding**: when your corpus fits the model's
context budget, the assistant inlines the whole thing on the first turn and answers with zero
fetches; when it doesn't, it navigates your docs page-by-page, reasoning about which page to
read next. Either way the answer comes from what you actually published. Second, **honest
metering**: usage bills in real dollars against the account behind that key, so a public docs
site can offer AI answers without signing up for an unbounded bill. Point the panel at a
`:free` model slug and it answers at $0 while you evaluate it.

Behind the panel sits a conversation-analytics dashboard — top questions, coverage gaps,
intent tags — so every reader question becomes product insight. You're reading the docs of
a site that runs it: press <kbd>Cmd</kbd>+<kbd>I</kbd> and ask something.

Read more on the [AI assistant](/ai-assistant/) page, or see the
[changelog entry](/changelog/) for the release details.

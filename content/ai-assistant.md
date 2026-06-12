---
description: Add a kapa.ai "Ask AI" widget to your docs with one config value.
icon: fa-solid fa-robot
menu: docs
title: AI assistant (kapa.ai)
navtitle: AI assistant
weight: 51
---

# AI assistant (kapa.ai)

aardvark can embed a [kapa.ai](https://www.kapa.ai/) assistant widget so visitors can
ask questions about your docs.

## Configure

```yaml
integrations:
  kapa:
    websiteId: "your-kapa-website-id"
    # optional:
    # buttonText: "Ask AI"
    # modalTitle: "Ask AI"
    # projectColor: "#228be6"
    # projectLogo: "https://.../logo.svg"
```

Leave `websiteId` empty to disable (the default here).

## What the build does

Injects the kapa widget script with your `websiteId` and `site.name` as the
project name, plus any optional button/modal/branding values you set. The widget
renders its own floating "Ask AI" launcher.

This is distinct from the [build-time AI features](/ai-features/), which run
during the build rather than in the browser.

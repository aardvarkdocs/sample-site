---
title: The reader assistant says what actually went wrong — in your language
date: 2026-09-01
version: "0.4.1"
taxonomy:
  - name: changes
    tags: [ai, ui]
nav: false
noindex: true
---

# The reader assistant says what actually went wrong — in your language

Every rejected turn used to report "This conversation is too long", which was true of none of
the four cases that produce it — including a rejected attachment, where the reader was told to
start a new chat instead of to drop a file. Failures are classified by their code now, so a
reader is told the thing they can act on. A turn rejected that way also restores what was
typed, but only if the reader has not already begun a new question.

The panel's remaining chrome localizes too. Its attachment, install, zoom, fullscreen and
clear-conversation controls, and the whole "Copy page" / Markdown / agent-install menu, were
never registered for translation, so a localized site rendered them in English without saying
it had fallen back. Run a UI-string re-extraction ([`vark build --translate`](/cli/)) to pick up the new
strings; until then they fall back to English as before.

See [Ask AI](/ai-assistant/).

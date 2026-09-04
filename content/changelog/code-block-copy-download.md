---
title: Standardized code-block Copy & Download buttons
date: 2026-06-14
version: "0.1.6"
taxonomy:
  - name: changes
    tags: [components, ui]
nav: false
noindex: true
---

# Standardized code-block Copy & Download buttons

Every code block — on the page, in the file-tree modal, and in OpenAPI request/response
samples — shares one **Copy** and **Download** affordance, so the interaction is identical
everywhere a reader meets code.

Two details worth knowing. The buttons are revealed on hover *and* on keyboard focus, and a
copy announces itself through the page's ARIA live region rather than only flashing a
checkmark. And what lands on the clipboard is the block's real source: a highlighted or
Twoslash-rendered block copies the code, never the type popovers and per-line markup drawn
over it. The download's file extension follows the fence's language, falling back to `.txt`
for a language it doesn't recognize.

See the [components](/components/) library.

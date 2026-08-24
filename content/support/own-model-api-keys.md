---
title: Do I need my own model API keys?
description: No — metered AI runs through Aardvark's managed keys, with an optional Enterprise bring-your-own-key path.
nav: false
taxonomy:
  - name: support
    tags: ["Plans, seats & hosting"]
    leftnav: true
    articleCount: true
---

# Do I need my own model API keys?

No. On every plan, metered AI runs through **Aardvark's managed keys** by default — you
never create, rotate, or secure a provider key.

**Enterprise** accounts can optionally register their own OpenRouter key, for
organizations whose policy requires model traffic to run on their own provider contract.
It is opt-in and owner-only, and it changes one thing only: which OpenRouter account is
billed upstream. It is **not** a discount — the Aardvark meter still charges the same
published list rate at your plan's rate, exactly as it does on a managed key. Register a
key only if you want the upstream contract, not to lower your Aardvark bill.

Once a key is registered, Aardvark never quietly falls back to a managed key: if your
provider rejects the key or your provider account is out of credit, the request is
**refused and not billed** rather than run on Aardvark's account behind your back. Remove
the key to move traffic back to the managed keys.

Your key is encrypted at rest, and no API ever returns more than its last four characters.

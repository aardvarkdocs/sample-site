---
title: "Target"
description: "The built-in target tag — name a region of a page so Content Reach reports on it as its own section, alongside the sections your headings already create."
---

# Target

A **built-in** tag that names a region of a page:

{% raw %}
```aardvark
{% target id="install-cli" %}
Everything in here is one section.
{% endTarget %}
```
{% endraw %}

[Content Reach](/content-reach/) already treats every `##` and `###` heading as a
section, which covers your prose. `{% raw %}{% target %}{% endraw %}` covers the blocks
that matter most but aren't headings — the install command, the API auth step, the
"Try it now", the sign-up call to action.

The tag adds no box, no spacing, and no styling — it wraps the region in a plain, unstyled
`<div class="aardvark-target">` carrying the id. The region looks exactly as it did before.

## The id

Required, and a lowercase slug: letters, digits, `-` and `_`, starting with a letter or
digit, up to 64 characters. That is the same shape as a generated heading anchor, on
purpose — the dashboard shows one ordered list of sections rather than two parallel ones.

A malformed or missing id emits a build warning and renders the body **unwrapped**. You
lose the measurement for that region until the id is fixed; you never lose the content.

Ids should be stable. Renaming one starts a new section in the dashboard rather than
continuing the old one's history, the same way renaming a heading does.

They must also be **unique on the page**. The id *is* the identity the dashboard groups by, so
reusing one is a build warning: only the last region with that id is measured, and clicks in the
earlier one are credited to whichever section encloses them — a wrong number rather than a missing
one. The `attr=` form below claims from the same set of ids, so the two ways of marking a region
can collide with each other too.

## A worked example

{% raw %}
````aardvark
## Getting started

{% target id="install-cli" %}
Install the CLI:

```bash
npm install -g aardvark
```
{% endTarget %}

Then run `vark new` to scaffold a site.
````
{% endraw %}

The page now reports three sections: the `getting-started` heading, the `install-cli`
target inside it, and whatever heading follows. Copying that `npm install` line is
attributed to `install-cli` rather than to the whole `getting-started` section.

## Markdown inside

The body is ordinary Markdown — headings, lists, code fences, other components — and
renders exactly as it would outside the tag. Nesting a heading inside a target is fine;
both become sections, in document order — which is also how their time divides. The target
is credited from its opening tag down to that heading, and the heading from there on, since
it is the narrower region the reader is in. Both still count as reached when they come into
view. If you want the whole region's time under one id, put the target inside the heading's
section rather than around it.

## A single component

For one component rather than a region, no new tag is needed. The generic `attr=`
channel every built-in accepts carries the same marker:

{% raw %}
```aardvark
{% button url="/signup" attr={"data-aardvark-target": "signup-cta"} %}Start free{% endButton %}
```
{% endraw %}

Reach for `{% raw %}{% target %}{% endraw %}` when you want a region; reach for `attr=`
when you want one element. Both draw from the same page-wide set of section ids, so give each
its own.

## What it does not do

- **No effect without Content Reach.** With the feature off, or on a plan that doesn't include it, the marker is inert markup — harmless, and costing nothing.
- **Nothing reaches the agent Markdown.** The wrapper is stripped from each page's `.md` twin and from `llms-full.txt`, so an AI agent reading your docs never sees it.
- **It captures no content.** Marking a region records that the region was on screen and that its controls were used, never anything inside it.

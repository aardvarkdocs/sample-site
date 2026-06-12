---
weight: 110
title: "Changelog"
description: "The built-in changelog tag — a Mantine timeline of changes read from a YAML data file, with tag-cloud filtering, same-day combining, On-this-page entries, an RSS feed, and an optional wide two-column layout. Usage, the data-file schema, options, and live examples."
---

# Changelog

A **built-in** tag that turns a YAML data file of changes into a Mantine
[Timeline](/components/steps/) — newest first, each entry with a date, an optional release
**version** badge, and a **Markdown** description of any length. A cloud of tag badges lets
readers **filter** the timeline; in a wide layout the cloud sits in a sticky right-hand
column, otherwise above the entries. Each changelog also publishes an **RSS feed** (linked
from the icon above it) and — in a normal-width layout — adds every change to the page's
**On this page** list. The live [Changelog](/changelog/) tab of this site is built from this
one tag.

## Usage

Point the tag at a YAML data file (path relative to your site root). Everything else is
optional:

{% raw %}
```aardvark
{% changelog "data/changelog.yaml" %}
```
{% endraw %}

renders, live (capped to the four most recent entries here):

{% changelog "data/changelog.yaml" limitEntries=4 toc=false %}

Click a tag to filter; click more than one to combine them — an entry shows if it matches
**any** active tag. Click an active tag again, or **Clear**, to reset.

## The data file

The data file is a **YAML list** of changes. Each change needs a `title`, a `date`, and a
`description` (Markdown of any length); `version` and `tags` are optional. A `date` may
include a **time** — the full timestamp drives the sort, so two changes on the same day
order correctly:

```yaml
- title: Generate the CLI reference from `vark --help`
  date: 2026-05-28 16:30             # a time is optional; it refines the sort
  version: "0.9.0"                   # optional — a release badge beside the date
  tags: [cli, docs]                  # optional — populate the filter cloud
  description: |                     # required — rendered as Markdown (links welcome)
    Generated straight from `vark --help`. See the [CLI reference](/cli/).

- title: Build-time accessibility contrast audit
  date: 2026-04-19
  tags: [a11y, build]
  description: |
    A non-fatal **WCAG contrast audit** over your theme colors.
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | The change's headline. |
| `date` | yes | `YYYY-MM-DD`, optionally with a time (`2026-05-28 16:30`). Entries render newest first by the full timestamp. |
| `description` | yes | Markdown of any length — lists, code, links, emphasis. |
| `version` | no | A release marker shown as a badge beside the date. |
| `tags` | no | A list of labels (or a comma-separated string); these populate the filter cloud. |

## Filtering and limiting

**Only one tag.** Pass `tags=` to render just the changes carrying one of those tags. The
list is then already filtered, so no tag cloud is drawn:

{% raw %}
```aardvark
{% changelog "data/changelog.yaml" tags="build" %}
```
{% endraw %}

{% changelog "data/changelog.yaml" tags="build" toc=false %}

**Only the last few.** `limitEntries=N` caps how many entries render (after the newest-first
sort); `limitDays=N` instead keeps only changes from the last *N* days, counted from the
build date. Showing the three most recent:

{% raw %}
```aardvark
{% changelog "data/changelog.yaml" limitEntries=3 %}
```
{% endraw %}

{% changelog "data/changelog.yaml" limitEntries=3 %}

Because this page uses a normal (non-wide) layout, those three changes are also linked from
the **On this page** list on the right — that's the default. Add `toc=false` to opt out (the
other examples on this page do, to keep this page's contents about the docs).

## Combining same-day changes

Add `combineByDay` to merge every change from one calendar day into a single timeline entry
— the date shows once, with each change listed beneath it. (Add times to your dates when you
*don't* want this, so same-day changes stay separate but still sort correctly.)

{% raw %}
```aardvark
{% changelog "data/changelog.yaml" combineByDay limitEntries=2 %}
```
{% endraw %}

{% changelog "data/changelog.yaml" combineByDay limitEntries=2 toc=false %}

## Feeds

Every changelog publishes an **RSS feed** at `feed.xml` beside the page — so the
[Changelog](/changelog/) tab's feed is at `/changelog/feed.xml` — with one item per change.
The **RSS icon** above the timeline links to it, and the page advertises the feed in its
`<head>` so feed readers discover it automatically. No configuration needed.

## Options

| Attribute | Effect |
| --- | --- |
| `"…"` (first argument) | Path to the YAML data file, relative to the site root (**required**). |
| `wide` | Lay the tag cloud out in a sticky right-hand column. **Requires a wide layout mode** — `mode: wide`, `full`, or `uncapped` in the page front matter (see [Modes](/modes/wide/)); otherwise the build fails with a clear error. Without `wide`, the cloud renders above the timeline. |
| `tags="a,b"` | Show only changes carrying one of these tags; suppresses the tag cloud. |
| `combineByDay` | Merge all of a day's changes into one timeline entry. |
| `toc=false` | Don't add the changes to the page's "On this page" list (added by default in a non-wide layout; wide layouts hide that list). |
| `limitDays=90` | Show only changes from the last *N* days, counted from the build date. |
| `limitEntries=20` | Show at most *N* entries (after the newest-first sort and any combining). |

For the full **wide** layout — the timeline beside a sticky tag cloud — set a wide mode and
add `wide`, exactly as the [Changelog](/changelog/) tab does (it uses `mode: full`):

{% raw %}
```aardvark
{% changelog "data/changelog.yaml" wide %}
```
{% endraw %}

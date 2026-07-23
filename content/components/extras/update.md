---
title: "Update"
description: "Update — an inline release-note / changelog entry rendered as a timeline-rail row: a version or date label on the left, the Markdown body beside it. Author each entry in the page (distinct from the data-driven changelog tag)."
---

# Update

The built-in **update** tag renders a single **release-note** — one entry on a
timeline rail: a version or date **label** on the left, and the entry's **Markdown**
body beside it. Give it a `label` (the version or date), an optional `description`
(a dimmed sub-label — a date under a version, say), and an optional `tags` cloud.
Close it with `{% raw %}{% endUpdate %}{% endraw %}`.

Reach for it when you want to hand-author a short **"What's new"** note on a page, or
stack a run of them into a release log. It is **distinct** from the
[Changelog](/components/extras/changelog/) tag: `{% raw %}{% changelog %}{% endraw %}`
reads a whole **YAML data file** and owns the tag-filter cloud and RSS feed, while
`{% raw %}{% update %}{% endraw %}` is a **single inline entry** you write in the page.

Use it as `{% raw %}{% update %}{% endraw %}` in Markdown, or call it from Python
logic (loops, snippets) via `component('aardvark', 'update', …)`.

## Demonstrations

### A single entry

A `label` on the rail, the Markdown body beside it:

{% update label="v1.4.0" %}
Added a **dark-mode** toggle and a per-page table of contents. See the
[theming guide](/theming/) for the new CSS variables.
{% endUpdate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% update label="v1.4.0" %}
Added a **dark-mode** toggle and a per-page table of contents. See the
[theming guide](/theming/) for the new CSS variables.
{% endUpdate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'update', label='v1.4.0', children=(
    'Added a **dark-mode** toggle and a per-page table of contents. See the '
    '[theming guide](/theming/) for the new CSS variables.'))
```
{% endAccordionSection %}
{% endAccordion %}

### A run of entries (a release log)

Stack several — each is its own entry, and the rail joins them into one continuous
timeline. Entries render in the order you write them, so put the newest first:

{% update label="v2.1.0" description="2026-07-03" tags="feature, api" %}
- New `search` endpoint with typo-tolerant matching.
- The dashboard now remembers your last filter.
{% endUpdate %}

{% update label="v2.0.1" description="2026-06-18" tags="fix" %}
Fixed a race in the billing reconciler that could double-count a refund.
{% endUpdate %}

{% update label="v2.0.0" description="2026-06-01" tags="breaking" %}
Renamed the `token` parameter to `apiKey` across every endpoint. See the
[migration notes](/) before upgrading.
{% endUpdate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% update label="v2.1.0" description="2026-07-03" tags="feature, api" %}
- New `search` endpoint with typo-tolerant matching.
- The dashboard now remembers your last filter.
{% endUpdate %}

{% update label="v2.0.1" description="2026-06-18" tags="fix" %}
Fixed a race in the billing reconciler that could double-count a refund.
{% endUpdate %}

{% update label="v2.0.0" description="2026-06-01" tags="breaking" %}
Renamed the `token` parameter to `apiKey` across every endpoint. See the
[migration notes](/) before upgrading.
{% endUpdate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'update', label='v2.1.0', description='2026-07-03',
          tags='feature, api', children=(
              '- New `search` endpoint with typo-tolerant matching.\n'
              '- The dashboard now remembers your last filter.'))
component('aardvark', 'update', label='v2.0.1', description='2026-06-18',
          tags='fix', children=(
              'Fixed a race in the billing reconciler that could double-count a refund.'))
component('aardvark', 'update', label='v2.0.0', description='2026-06-01',
          tags='breaking', children=(
              'Renamed the `token` parameter to `apiKey` across every endpoint. See the '
              '[migration notes](/) before upgrading.'))
```
{% endAccordionSection %}
{% endAccordion %}

### A custom bullet and accent color

`bullet` sets the rail glyph — a Tabler icon name (lazily fetched), an emoji, or short
text — and `color` accents this entry's bullet and line:

{% update label="v1.5.0" bullet="rocket" color="grape" %}
Shipped the new onboarding flow. 🎉
{% endUpdate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% update label="v1.5.0" bullet="rocket" color="grape" %}
Shipped the new onboarding flow. 🎉
{% endUpdate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'update', label='v1.5.0', bullet='rocket', color='grape',
          children='Shipped the new onboarding flow. 🎉')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

| Attribute | Valid values | Description |
| --- | --- | --- |
| `label` | Any string | The rail heading — the version or date (e.g. `v1.2.0`, `2026-07-03`). Optional; omit for an unlabelled entry. |
| `description` | Any string | An optional dimmed sub-label under the label (a date beneath a version, say). |
| `tags` | Comma-separated string | An optional badge cloud under the label (e.g. `tags="feature, fix"`). |
| `bullet` | Tabler icon name, emoji, or short text | The rail glyph. A bare Tabler name is fetched lazily; anything else renders verbatim; unset uses Mantine's default dot. |
| `color` | Any Mantine color | Accent for this entry's bullet and line. Defaults to your site's primary color. |
| `attr` | `{…}` | Raw HTML attributes forwarded onto the rendered island root (see below). |
| *(body)* | Markdown | The entry content, written between `{% raw %}{% update %}{% endraw %}` and `{% raw %}{% endUpdate %}{% endraw %}` (`children=` from Python). |

## Update vs. Changelog

Both draw a timeline, but they solve different problems:

| | `{% raw %}{% update %}{% endraw %}` | `{% raw %}{% changelog %}{% endraw %}` |
| --- | --- | --- |
| Source of entries | Authored inline, one tag per entry | A YAML data file |
| Best for | A short "What's new" note, a hand-written release log | A full, filterable changelog with a feed |
| Tag filtering | A static badge cloud (display only) | An interactive filter cloud |
| RSS feed / On-this-page | No | Yes |

## CSS Selectors

Each `update` carries `data-aardvark-island="Update"` on its wrapper, and the rendered
Mantine Timeline exposes its parts as `mantine-Timeline-*` classes — target either to
style it from your theme CSS.

{% raw %}
```css
[data-aardvark-island="Update"] {
  /* style every update entry on the page */
}

.aardvark-update-version {
  /* the version/date label on the rail */
}

.aardvark-update-body {
  /* the Markdown body */
}

.mantine-Timeline-itemBullet {
  /* the rail bullet */
}
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes (including event handlers) straight onto the
rendered island root.

{% update label="v1.6.0" attr={'data-analytics': 'release-note', 'aria-label': 'v1.6.0 release note'} %}
Added keyboard shortcuts across the app.
{% endUpdate %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% update label="v1.6.0" attr={'data-analytics': 'release-note', 'aria-label': 'v1.6.0 release note'} %}
Added keyboard shortcuts across the app.
{% endUpdate %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'update', label='v1.6.0',
          children='Added keyboard shortcuts across the app.',
          attr={'data-analytics': 'release-note', 'aria-label': 'v1.6.0 release note'})
```
{% endAccordionSection %}
{% endAccordion %}

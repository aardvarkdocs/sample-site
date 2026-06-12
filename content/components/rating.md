---
title: "Rating"
description: "The built-in rating tag — a star rating for feedback and scores. Usage, options, and sending the result to Google Analytics with attr."
---

# Rating

A **built-in** tag for a star rating — collect feedback or show a score. It ships with
aardvark, so a rating is a single tag with no setup. For the underlying component and
every prop it accepts, see [Mantine's Rating docs](https://mantine.dev/core/rating/).

## Usage

Write `{% raw %}{% rating %}{% endraw %}` with any of the options below:

{% raw %}
```aardvark
{% rating defaultValue=3 %}
```
{% endraw %}

renders, live:

{% rating defaultValue=3 %}

Leave `defaultValue` off for an empty rating the reader fills in, or add `readOnly`
to show a fixed score.

## Options

Omit any option to take its default. [Mantine's Rating docs](https://mantine.dev/core/rating/) list every
prop it accepts.

| Attribute | Type | Effect |
| --- | --- | --- |
| `defaultValue` | number | Stars selected on load (a float, so `2.5` works with `fractions`). |
| `count` | integer | Number of symbols (default `5`). |
| `fractions` | integer | Sub-symbol steps — `2` gives half-stars, `4` quarters. |
| `color` | string | Any Mantine color (blue, yellow, …) or a [config](/theming/) color (primary, secondary). |
| `size` | string | `xs`–`xl`. |
| `readOnly` | boolean | Display-only; the reader can't change it. |
| `name` | string | Radio-group name — set a stable one if a page has several ratings. |

{% raw %}
```aardvark
{% rating defaultValue=2.5 fractions=2 count=5 color="yellow" size="lg" %}
```
{% endraw %}

{% rating defaultValue=2.5 fractions=2 count=5 color="yellow" size="lg" %}

## Send ratings to Google Analytics with `attr`

A rating is only useful if you can *read* the result — so send each selection to Google
Analytics. Like every component, `{% raw %}{% rating %}{% endraw %}` accepts an `attr`: a
dict of raw HTML attributes applied to the widget's rendered root. Hang an `onchange` on
it and your JavaScript runs in the
browser each time a reader picks a star — drop in an anonymous function and send the
event:

{% raw %}
```aardvark
{% rating count=5 attr={'onchange': '''
  (() => {
    if (this.dataset.rated) return;               // fire once, even if they re-pick
    this.dataset.rated = '1';
    const rating = Number(event.target.value);    // the star the reader picked
    window.gtag && gtag('event', 'rating_submitted', {
      event_label: 'docs-helpfulness',
      value: rating,
    });
  })()
'''} %}
```
{% endraw %}

renders, live — pick a rating (with Google Analytics configured on the site, the first
pick sends a `rating_submitted` event):

{% rating count=5 attr={'onchange': '''
  (() => {
    if (this.dataset.rated) return;
    this.dataset.rated = '1';
    const rating = Number(event.target.value);
    window.gtag && gtag('event', 'rating_submitted', {
      event_label: 'docs-helpfulness',
      value: rating,
    });
  })()
'''} %}

**Reading the value.** A `change` from any star bubbles up to the root the handler sits
on, so `event.target.value` is the chosen rating. (`this` inside the handler is that
root *element*, not the value — if you'd rather go through it,
`Number(this.querySelector('input:checked').value)` works too.) `Number(…)` also handles
fractional values like `2.5`.

What makes this a *good* event:

- **`'rating_submitted'`** — a clear, present-tense GA4 event name, not a generic
  `click`, so it reads well in reports and the Realtime view.
- **`event_label: 'docs-helpfulness'`** — a stable, human-readable label naming *which*
  rating. Give each widget its own (`docs-helpfulness`, `pricing-clarity`, …) so several
  ratings stay distinct instead of blurring into one. (In GA4 `event_label` is a custom
  parameter — register it as a custom dimension in your property to see it in reports;
  `value` is built in. We skip Universal Analytics' `event_category` — GA4 doesn't use it.)
- **`value`** — the stars the reader chose, as a number GA4 can average.
- **`window.gtag &&`** — a guard so the handler is a no-op when GA isn't on the page
  (local preview, a consent gate) rather than throwing.
- **fires once** — `onchange` runs on *every* selection, so the `this.dataset.rated` flag
  sends the event on the first pick only; changing 3 → 5 stars won't send two events. (The
  default theme's page-feedback widget guards the same way.)

`attr` is the same mechanism every component supports — pass a whole dict (it can't ride
the tag as a single scalar like `color="yellow"`, so it gets its own `attr={…}`). A site
can lock handlers down with an `attrPolicy` in `aardvark.config.yaml` (e.g. `deny: ['on*']`).

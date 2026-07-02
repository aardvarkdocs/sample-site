---
title: "Rating"
description: "The built-in rating tag — a star rating for feedback and scores. Usage, options, fractions, read-only scores, and sending the result to Google Analytics with attr."
---

# Rating

A star rating for collecting feedback or showing a score. Set `defaultValue` (the stars
shown on load — a float, so half-stars work with `fractions`), `count` (number of
symbols), and `fractions` (sub-symbol granularity). Add `readOnly` to show a fixed
score, or leave `defaultValue` off for an empty rating the reader fills in.

Use it as `{% raw %}{% rating %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'rating', …)`.

## Default value

`defaultValue` is the number of stars shown on load. Leave it off for an empty rating.

{% rating defaultValue=3 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rating defaultValue=3 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rating', defaultValue=3)
```
{% endAccordionSection %}
{% endAccordion %}

## Fractions, count, color, and size

`fractions` adds sub-symbol steps (`2` gives half-stars), so a `defaultValue` of `2.5`
lands on a half. `count` sets the number of symbols; `color` and `size` style them.

{% rating defaultValue=2.5 fractions=2 count=5 color="yellow" size="lg" %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rating defaultValue=2.5 fractions=2 count=5 color="yellow" size="lg" %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rating', defaultValue=2.5, fractions=2, count=5,
          color='yellow', size='lg')
```
{% endAccordionSection %}
{% endAccordion %}

## Read-only score

`readOnly` makes the rating display-only — the reader can't change it. Use it to show a
score you've computed.

{% rating defaultValue=4 readOnly=true %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% rating defaultValue=4 readOnly=true %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rating', defaultValue=4, readOnly=True)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Pair a read-only rating with text to show an average score inline, or an interactive
one with a heading to prompt feedback.

Average customer rating: {% rating defaultValue=4.5 fractions=2 readOnly=true %}

How was this page?

{% rating count=5 name='page-helpfulness' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
Average customer rating: {% rating defaultValue=4.5 fractions=2 readOnly=true %}

How was this page?

{% rating count=5 name='page-helpfulness' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rating', defaultValue=4.5, fractions=2, readOnly=True)
component('aardvark', 'rating', count=5, name='page-helpfulness')
```
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its Mantine default.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `defaultValue` | number (float OK) | Stars selected on load. A float, so `2.5` works with `fractions`. |
| `count` | integer | Number of symbols (default `5`). |
| `fractions` | integer | Sub-symbol steps — `2` gives half-stars, `4` quarters (default `1`). |
| `color` | theme color name (`yellow`, `blue`, …) | Color of the filled symbols. |
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | Overall size. |
| `readOnly` | bare flag (`true`) | Display-only; the reader can't change it. |
| `name` | string | Radio-group name — set a stable one if a page has several ratings. |
| `attr` | dict (`attr={…}`) | Raw HTML attributes (e.g. `onchange`) applied to the rendered root. |

## CSS Selectors

Target a `{% rating %}` from your own CSS with the island data attribute or the Mantine Styles API part classes:

{% raw %}
```css
/* Every Rating instance on the page */
[data-aardvark-island="Rating"] { }

/* Mantine Styles API parts */
.mantine-Rating-root { }
.mantine-Rating-symbolGroup { }
.mantine-Rating-starSymbol { }
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards a dict of raw HTML attributes — including inline event handlers —
straight onto the widget's rendered root. It's the same mechanism every component supports:
it can't ride the tag as a single scalar like `color="yellow"`, so it gets its own `attr={…}`.
A rating is only useful if you can *read* the result, so here's the canonical use — hang an
`onchange` on it and send each selection to Google Analytics:

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

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
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
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'rating', count=5, attr={'onchange': '''
  (() => {
    if (this.dataset.rated) return;
    this.dataset.rated = '1';
    const rating = Number(event.target.value);
    window.gtag && gtag('event', 'rating_submitted', {
      event_label: 'docs-helpfulness',
      value: rating,
    });
  })()
'''})
```
{% endAccordionSection %}
{% endAccordion %}

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

A site can lock handlers down with an `attrPolicy` in `aardvark.config.yaml` (e.g. `deny: ['on*']`).

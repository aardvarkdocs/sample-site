---
title: "ArticleCard"
description: "The built-in articleCard tag — blog-style article cards with a byline, avatar (or initials fallback), date, badge, cover image, tags, and five layout variants. Usage, options, and live examples."
---

# ArticleCard

A **built-in** tag for blog-style article cards — the card the
[`{% raw %}{% taxonomy %}{% endraw %}`](/components/extras/taxonomy/) article listing
renders one-per-post, available standalone for hand-built index pages. You give it a flat
attribute set — title, teaser `description`, a **byline** with an avatar, a date, an
optional badge, tags, and an optional cover image — and pick one of five layouts: a
horizontal media card, a footer-metadata card, a full-bleed background-image card, a
vertical card, and a plain grid card. Wrap a set of them in
`{% raw %}{% cardGrid %}{% endraw %}` for a responsive grid, or call it from Python via
`component('aardvark', 'articleCard', …)`. (The variants match the
[mantine.dev article-cards gallery](https://ui.mantine.dev/category/article-cards/) if
you want a visual reference.)

Cards **degrade gracefully**: omit `authorAvatar` and the byline shows the author's
**initials** in a colored disc; omit the author entirely and the byline row is dropped;
omit `image` and image-led variants render as clean text cards rather than leaving a hole.

## Demonstrations

### Horizontal

`variant="horizontal"` (the default) is the gallery's classic article card: cover image
on top, the badge floating over its corner in a gradient chip, title, a four-line teaser,
and a footer with the byline on the left and the date on the right:

{% articleCard variant="horizontal" title="Introducing Ask AI, the reader assistant" href="/blog/introducing-ask-ai/" image="/landscape.jpg" imageAlt="" badge="Product" authorName="The aardvark team" authorAvatar="/favicon.svg" date="2026-05-05" tags="ai, product" %}
A native Ask AI panel that answers reader questions from your own docs, with cited
sources and metered, dollar-based billing.
{% endArticleCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% articleCard variant="horizontal" title="Introducing Ask AI, the reader assistant" href="/blog/introducing-ask-ai/" image="/landscape.jpg" imageAlt="" badge="Product" authorName="The aardvark team" authorAvatar="/favicon.svg" date="2026-05-05" tags="ai, product" %}
A native Ask AI panel that answers reader questions from your own docs, with cited
sources and metered, dollar-based billing.
{% endArticleCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'articleCard', variant='horizontal',
          title='Introducing Ask AI, the reader assistant', href='/blog/introducing-ask-ai/',
          image='/landscape.jpg', imageAlt='', badge='Product',
          authorName='The aardvark team', authorAvatar='/favicon.svg',
          date='2026-05-05', tags='ai, product',
          children='A native Ask AI panel that answers reader questions from your own '
                   'docs, with cited sources and metered, dollar-based billing.')
```
{% endAccordionSection %}
{% endAccordion %}

### Footer

`variant="footer"` leads with an outline badge and the byline block, and moves the
teaser into a separated border-top footer strip — good for uniform grids. Note the
**initials fallback**: no `authorAvatar` here, so the byline draws a disc from the
author's initials:

{% articleCard variant="footer" title="Why aardvark rebuilds every page (for now)" href="/blog/how-incremental-builds-work/" badge="Engineering" authorName="aardvark engineering" date="2026-06-02" tags="build, performance" %}
Where the dev loop's speed actually comes from, and why per-page skipping is a harder
promise than it looks.
{% endArticleCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% articleCard variant="footer" title="Why aardvark rebuilds every page (for now)" href="/blog/how-incremental-builds-work/" badge="Engineering" authorName="aardvark engineering" date="2026-06-02" tags="build, performance" %}
Where the dev loop's speed actually comes from, and why per-page skipping is a harder
promise than it looks.
{% endArticleCard %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Background

`variant="background"` is the tall photo card: the badge renders as an uppercase
category caption over a large white title, with an optional `cta` button pinned at the
bottom — the hero treatment. With no `image`, it falls back to a plain text card:

{% articleCard variant="background" title="Multi-language docs in practice" href="/blog/multi-language-docs-in-practice/" image="/landscape.jpg" imageAlt="" badge="How-to" cta="Read article" %}{% endArticleCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% articleCard variant="background" title="Multi-language docs in practice" href="/blog/multi-language-docs-in-practice/" image="/landscape.jpg" imageAlt="" badge="How-to" cta="Read article" %}{% endArticleCard %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Vertical

`variant="vertical"` is the side-by-side row — image on the left (stacking on small
screens), an uppercase category caption, the title, and a compact `author • date` line.
Here two of them ride a `{% raw %}{% cardGrid %}{% endraw %}`:

{% cardGrid colsBase=1 colsSm=2 %}
{% articleCard variant="vertical" title="Anatomy of a Mantine island" href="/blog/anatomy-of-a-mantine-island/" image="/img/sample-landscape.svg" imageAlt="" badge="Deep dive" authorName="aardvark engineering" authorAvatar="/img/sample-square.svg" date="2026-06-18" tags="components, engineering" %}{% endArticleCard %}
{% articleCard variant="vertical" title="vark 0.9 release roundup" href="/blog/vark-0-9-release-roundup/" image="/landscape.jpg" imageAlt="" badge="Release" authorName="The aardvark team" authorAvatar="/favicon.svg" date="2026-05-30" tags="release, cli" %}{% endArticleCard %}
{% endCardGrid %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% cardGrid colsBase=1 colsSm=2 %}
{% articleCard variant="vertical" title="Anatomy of a Mantine island" href="/blog/anatomy-of-a-mantine-island/" image="/img/sample-landscape.svg" imageAlt="" badge="Deep dive" authorName="aardvark engineering" authorAvatar="/img/sample-square.svg" date="2026-06-18" tags="components, engineering" %}{% endArticleCard %}
{% articleCard variant="vertical" title="vark 0.9 release roundup" href="/blog/vark-0-9-release-roundup/" image="/landscape.jpg" imageAlt="" badge="Release" authorName="The aardvark team" authorAvatar="/favicon.svg" date="2026-05-30" tags="release, cli" %}{% endArticleCard %}
{% endCardGrid %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

### Plain

`variant="plain"` is the grid tile: a rounded 16:9 cover (when given), a small
uppercase date, and the title, with the border materializing on hover. It is
deliberately minimal — no teaser text, even if a `description` is supplied:

{% articleCard variant="plain" title="Designing the honest AI meter" href="/blog/designing-the-honest-ai-meter/" date="2026-07-08" tags="pricing, product" %}{% endArticleCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% articleCard variant="plain" title="Designing the honest AI meter" href="/blog/designing-the-honest-ai-meter/" date="2026-07-08" tags="pricing, product" %}{% endArticleCard %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Set what you need, omit the rest.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `title` | string | The article headline. Also the accessible link name when `href` is set. |
| `href` | URL | Make the whole card a link to the article. |
| `url` | URL | Alias for `href`, used when `href` is absent (handy when reusing a data source that names the field `url`). |
| `description` | string | The teaser text — the four-line body of `horizontal`, the footer strip of `footer`. `vertical` and `plain` are deliberately compact and omit it; `background` omits it on the photo card but shows it in the no-image text fallback. The tag **body** does the same job — use whichever reads better; with both given, the attribute wins and the body is ignored. |
| `image` | image URL | Cover image — on top (`horizontal`/`footer`), on the left (`vertical`), a rounded 16:9 tile (`plain`), or the full background (`background`). Omitted, the card renders as a text card. |
| `imageAlt` | string | Alt text for the image (use `imageAlt=""` for a decorative image). |
| `badge` | string | A badge label — a gradient chip over the cover (`horizontal`), an outline chip (`footer`), or an uppercase category caption (`background`/`vertical`). |
| `badgeColor` | any theme/CSS color | Badge color (chip-style variants; `horizontal` switches from the gradient to a filled chip). |
| `authorName` | string | The byline. Omitted, the byline row is dropped. |
| `authorAvatar` | image URL | The byline avatar. Omitted, the byline falls back to the author's **initials** in a colored disc. |
| `date` | `YYYY-MM-DD`, optionally with a time | The article date shown on the card. |
| `dateDisplay` | string | A pre-formatted date string to show instead of the default formatting of `date`. |
| `variant` | `horizontal`, `footer`, `background`, `vertical`, `plain` | Card layout. |
| `cta` | string | Call-to-action label — rendered by the `background` variant only (as a button-styled affordance inside the card's single link). |
| `tags` | comma-separated string | Accepted for payload parity with cards supplied through a [taxonomy](/components/extras/taxonomy/) article listing (whose islands filter on the data) — a **standalone** card neither renders nor filters by them. |
| `onclick` | JS expression | A JS click handler on the card root (a raw HTML attribute; in Python it rides `attr={'onclick': …}`). |
| `attr={…}` | mapping | Forward raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks, event handlers — onto the rendered card root. See [Injecting Attributes](#injecting-attributes) below. |

## CSS Selectors

Each card is a `[data-aardvark-articlecard]` root carrying its layout in `data-variant`;
inner parts use the `.aardvark-articlecard-*` prefix:

{% raw %}
```css
[data-aardvark-articlecard]              /* one article card */
[data-aardvark-articlecard][data-variant="footer"]  /* one layout variant */
.aardvark-articlecard-title              /* the (linked) title */
.aardvark-articlecard-authorrow          /* byline: avatar + name + date */
```
{% endraw %}

## Injecting Attributes

`attr={…}` forwards raw HTML attributes — `id`, `data-*`, ARIA, analytics hooks — onto the
rendered card root:

{% articleCard variant="plain" title="vark 0.9 release roundup" href="/blog/vark-0-9-release-roundup/" date="2026-05-30" attr={'data-analytics': 'blog-card', 'aria-label': 'Release roundup'} %}
A self-generating CLI reference, a faster dev loop, and the best of the 0.8 line.
{% endArticleCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% articleCard variant="plain" title="vark 0.9 release roundup" href="/blog/vark-0-9-release-roundup/" date="2026-05-30" attr={'data-analytics': 'blog-card', 'aria-label': 'Release roundup'} %}
A self-generating CLI reference, a faster dev loop, and the best of the 0.8 line.
{% endArticleCard %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'articleCard', variant='plain', title='vark 0.9 release roundup',
          href='/blog/vark-0-9-release-roundup/', date='2026-05-30',
          children='A self-generating CLI reference, a faster dev loop, and the '
                   'best of the 0.8 line.',
          attr={'data-analytics': 'blog-card', 'aria-label': 'Release roundup'})
```
{% endAccordionSection %}
{% endAccordion %}

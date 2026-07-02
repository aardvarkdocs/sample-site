---
title: "Banner"
description: "Banner — a full-width announcement row across the top of the page, in your site's primary color. Set it site-wide in config, or per page in front matter."
banner: "**New:** follow the [quickstart](/getting-started/quickstart/) to ship your first docs site in minutes."
---

# Banner

A **banner** is a full-width announcement row pinned across the very top of the page, above the
header, filled with your site's **primary color**. The colored row at the very top of *this* page
is a live banner. Its text is ordinary **Markdown**, so **bold**, `code`, and [links](/) all work.

Unlike the other built-ins, the banner isn't a tag you write in the body — there's nothing to
place inside your content. You turn it on from **configuration**: once site-wide, or per page in
front matter.

## Site-wide

Set a `banner:` string in `aardvark.config.yaml` and it shows on every page:

{% raw %}
```yaml
banner: "**Heads up:** scheduled maintenance this Saturday. [Status page](/status/)."
```
{% endraw %}

## Per page

A page can set its own `banner:` in front matter. It **overrides** the site-wide banner on that
page only:

{% raw %}
```markdown
---
title: "Release notes"
banner: "**Version 2.0** is out — see what changed below."
---
```
{% endraw %}

To **hide** the site-wide banner on a single page, set `banner: false`:

{% raw %}
```markdown
---
title: "Checkout"
banner: false
---
```
{% endraw %}

## Behavior

- **Color** is always your theme's primary color, in both light and dark mode.
- **Markdown**, rendered inline — **bold**, *italics*, `code`, and links. (It's plain text, not a
  place for tags or other components.)
- **Dismissible** — a × button closes it; it stays closed for that visitor until you change the
  text. Editing the announcement brings it back for everyone.
- **Scrolls away** — the banner sits at the top and scrolls off as the reader moves down the page,
  while the header stays pinned.

## CSS Selectors

The banner is rendered straight into the theme markup (it isn't a hydrated island), so target its own class names — the bar, its inner content row, and the dismiss button.

{% raw %}
```css
.aardvark-banner        /* the full-width bar */
.aardvark-banner-inner  /* the centered content row */
.aardvark-banner-close  /* the × dismiss button */
```
{% endraw %}

## Injecting Attributes

The banner isn't a body tag — there's no `{% raw %}{% banner %}{% endraw %}` invocation to take a raw `attr={…}` channel. It's turned on from configuration (`banner:` in `aardvark.config.yaml` or page front matter), and styled through the CSS classes above.

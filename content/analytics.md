---
description: Wire up Google Analytics and capture page-rating feedback as gtag events.
icon: fa-solid fa-chart-line
menu: docs
title: Analytics & ratings
weight: 52
---

# Analytics & page ratings

## Google Analytics

Add your Measurement ID:

```yaml
integrations:
  analytics:
    measurementId: "G-XXXXXXXXXX"
```

aardvark injects the standard `gtag.js` snippet. Empty = disabled (the default here).

## Page ratings

The default theme adds a **"Was this page helpful?"** widget at the bottom of every
page — the built-in `PageFeedback` island. A visitor picks a star rating (they can
adjust it — the value they settle on is what's recorded); the widget thanks them and
reveals an optional comment box (a Mantine `Textarea` + a **Submit** button). Two
Google Analytics events fire, each once per page:

```js
// once, after the reader settles on a star (re-picks within ~600ms are debounced)
gtag('event', 'page_rating', {
  event_label: location.pathname,   // which page was rated
  value: 4,                         // the chosen number of stars (1–5)
});

// when the optional comment is submitted
gtag('event', 'page_rating_comment', {
  event_label: location.pathname,                // which page the comment is about
  comment: 'the search box was hard to find',    // capped at ~100 chars
  value: 4,                                       // the star rating they gave
});
```

The widget always renders; the events only fire when Analytics is configured (so
`gtag` exists). The page URL rides in its own `event_label` param so it's always
captured in full, and the comment is a separate `comment` param — GA4 caps each
parameter value at ~100 characters, so the box stops accepting input at 100 (with a
live counter) and the value is trimmed defensively before sending.

The reader can change their pick before it's recorded — re-picks are debounced, so a
3 → 5 correction sends a single `page_rating` with the final 5; once recorded, the
stars lock so the visible rating always matches what was sent.

To customize the wiring — send the events elsewhere (your own endpoint, PostHog, …),
change the copy, or restyle the box — drop a `snippets/PageFeedback.jsx` into your
project; a project snippet of that name overrides the built-in island. To drop the
widget entirely, set `pageFeedback: false` in `aardvark.config.yaml`. (The standalone
[`{% rating %}`](/components/rating/) component is still available for star ratings
anywhere in your content.)

> **Privacy:** the comment is free-form text sent to Google Analytics, so the widget
> shows a *"Please don't include personal information."* notice under the box by default
> (and comments only leave the browser when Analytics is configured). If you operate
> under GDPR/CCPA or similar and need an explicit disclosure, a privacy-policy link, or
> consent before capture, change the `commentNotice` string or gate the widget via
> `snippets/PageFeedback.jsx`.

> **GA4 setup:** `comment` and `event_label` are *custom* event parameters — GA4
> collects them (visible in DebugView and the BigQuery export) but won't show them in
> standard reports or Explore until you register each as a **custom dimension** (Admin →
> Custom definitions → Custom dimensions, scope: **Event**, parameter names `comment`
> and `event_label`). Without that, comments are still captured but never appear in the
> GA4 UI. `value` is built in and needs no setup.

> **Note:** GA4 treats `value` as its built-in (monetary) metric. We reuse it for the
> star count — it records and averages fine in reports, but if that collides with your
> own use of `value`, rename it to a custom parameter in `snippets/PageFeedback.jsx`.

> **Upgrading?** The page-feedback widget changed from a 👍/👎 pair to a 1–5 star
> rating, and the `page_rating` event payload changed with it — the old
> `{ rating: 'up'|'down', value: 1|0, page_path }` is now
> `{ event_label: <path>, value: 1–5 }`. Update any GA dashboards, custom dimensions,
> or alerts that filtered on `rating`, `value == 1`, or `page_path`. The
> `page_rating_comment` event is new.

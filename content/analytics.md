---
description: Drop in any of 16 analytics platforms from config, and capture page-rating feedback as events.
icon: fa-solid fa-chart-line
menu: docs
title: Analytics & ratings
weight: 52
---

# Analytics & page ratings

aardvark ships native support for the same analytics platforms as Mintlify. Add a block
under `integrations:` with your platform's id or key and aardvark injects that vendor's
official `<script>` on every page — no template editing. The config keys and field names
**match Mintlify's `docs.json` exactly**, so an existing Mintlify analytics block ports
over unchanged.

```yaml
integrations:
  ga4:
    measurementId: "G-XXXXXXXXXX"     # Google Analytics 4
  plausible:
    domain: "docs.example.com"        # any number of platforms can run at once
  posthog:
    apiKey: "phc_XXXXXXXX"
```

A block whose required field is empty (e.g. `measurementId: ""`) is treated as *off* — leave it
empty to keep that platform silent, and set it to your real id to switch it on. (This sample
site wires a real GA4 id so its live demo records analytics — see `integrations.analytics` in
`aardvark.config.yaml`.) If you set a block but misspell its required field, the build prints a
one-line warning so the mistake isn't silent.

> **Not a secret.** Every analytics id ships in the page's HTML by design, so committing it is
> fine. For per-deploy values, a build-time env var is still cleaner — see the `AARDVARK_KEY`
> note under [the AI assistant](/ai-assistant/) for that pattern.

## Supported platforms

Each platform is a block under `integrations:`. Set the **required** field(s) and you're done.

| Platform | Config key | Required | Notes |
| --- | --- | --- | --- |
| Google Analytics 4 | `ga4` | `measurementId` | Also accepts the legacy `analytics.measurementId` key |
| Google Tag Manager | `gtm` | `tagId` | Injects the head loader **and** the `<noscript>` fallback |
| Plausible | `plausible` | `domain` | Optional `src` to point at a self-hosted instance |
| Fathom | `fathom` | `siteId` | |
| PostHog | `posthog` | `apiKey` | Optional `apiHost` (default `https://us.i.posthog.com`; use `https://eu.i.posthog.com` or a proxy) |
| Mixpanel | `mixpanel` | `projectToken` | Tracks pageviews by default |
| Amplitude | `amplitude` | `apiKey` | Browser SDK 2 with autocapture + remote config; network-request capture is left **off** so request URLs/bodies aren't sent to Amplitude. Session Replay ships on by default — optional `sessionReplaySampleRate` (0–1, default `1` = every session) caps how much is recorded (use `0` to load the plugin but record nothing; *omit* the key for the full-rate default — leaving it empty/`null` warns rather than recording everything) |
| Microsoft Clarity | `clarity` | `projectId` | |
| Heap | `heap` | `appId` | |
| Hotjar | `hotjar` | `hjid`, `hjsv` | `hjsv` is the snippet version (defaults to `6`) |
| LogRocket | `logrocket` | `appId` | |
| Pirsch | `pirsch` | `id` | The site's identification code |
| Segment | `segment` | `key` | The source write key |
| Clearbit | `clearbit` | `publicApiKey` | Now HubSpot Breeze Intelligence |
| Hightouch | `hightouch` | `writeKey` | Optional `apiHost` (default `us-east-1.hightouch-events.com`) |
| Adobe Analytics | `adobe` | `launchUrl` | The full Adobe Launch / AEP Tags embed URL |

A fuller example mixing several:

```yaml
integrations:
  fathom:
    siteId: "ABCDEFGH"
  hotjar:
    hjid: 1234567
    hjsv: 6
  segment:
    key: "wk_live_XXXXXXXX"
  posthog:
    apiKey: "phc_XXXXXXXX"
    apiHost: "https://eu.i.posthog.com"   # optional override
  plausible:
    domain: "docs.example.com"
    src: "https://plausible.example.com/js/script.js"   # optional self-host
```

> **Migrating from Mintlify?** Copy the `analytics`/integration entries from your `docs.json`
> straight into `integrations:` (YAML instead of JSON). The keys and fields are identical, with
> two name fixes Mintlify itself uses: Segment's field is `key`, Hightouch's is `writeKey`.
> Mintlify's `cookies` and `telemetry` entries aren't analytics platforms — `telemetry` is
> Mintlify-internal, and for a cookie-consent banner use a [custom snippet](#anything-else-inject-any-snippet).

## Anything else? Inject any snippet

For a tracker not in the table above — or any other third-party tag — paste its snippet into
`integrations.custom`. The `head` value is emitted verbatim into every page's `<head>`, and
`body` just before the closing `</body>`:

```yaml
integrations:
  custom:
    head: |
      <script defer src="https://cdn.example-analytics.com/tag.js"
              data-site="my-site"></script>
    body: |
      <noscript><img src="https://example-analytics.com/noscript.gif"></noscript>
```

This content is injected **raw** (it isn't escaped — that's the point), so treat it like the
theme template: only put trusted markup there. It's injected **after** the built-in integrations
(the analytics platforms above), so a `custom` snippet can reference them.

## Google Analytics

GA4 is the one platform with deeper integration: the page-rating and reader-survey widgets
below record their results as `gtag` events, so they light up automatically once GA is
configured (under either `ga4.measurementId` or the legacy `analytics.measurementId`).

```yaml
integrations:
  ga4:
    measurementId: "G-XXXXXXXXXX"
```

aardvark injects the standard `gtag.js` snippet. An empty id disables it; this sample site sets
a real id, so GA is active here.

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
[`{% rating %}`](/components/inputs/rating/) component is still available for star ratings
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

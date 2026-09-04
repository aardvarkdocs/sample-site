---
description: See which sections of each page readers actually reach, how long each holds the reader's position, and which controls they use — without cookies, coordinates, or any record of who anyone is.
icon: fa-solid fa-chart-column
menu: docs
title: Content Reach
weight: 51
---

# Content Reach

Page views tell you a page was opened. They don't tell you whether anyone got as far as
the install command. **Content Reach** answers that: for every page, which of its
sections came into view, how long each held the reader's position, and which controls
readers actually used.

It reports on your page's own **sections** — the headings you already wrote, plus any
region you mark yourself — and never on screen coordinates. There is no cookie, no
fingerprint, no visitor id, and nothing that survives closing a browser tab.

> **Content Reach is available on the Business and Enterprise plans**, and needs the
> [AI assistant](/ai-assistant/) configured (it shares that gateway key). It is **off by
> default** even then — turn it on deliberately. The plan is checked by the gateway, not the
> build: on any other plan the first beacon is refused, the client stops for the rest of that
> browser tab, and nothing on the page is affected.

## Turn it on

```yaml
contentReach:
  enabled: true
```

Rebuild, and the Content Reach tab in your Aardvark cloud dashboard starts filling in.
The full set of options:

| Key | Default | What it does |
| --- | --- | --- |
| `enabled` | `false` | Turns the whole feature on. |
| `requireConsent` | `false` | Wait for an explicit consent signal before recording anything. See [Consent](#consent). |
| `sampleRate` | `1.0` | Record this fraction of browser tabs (`0.0`–`1.0`). The draw happens once per tab, so a sampled reader's whole journey is kept together. |
| `targetsOnly` | `false` | Track only the regions you [mark yourself](#mark-a-high-value-region), skipping the automatic heading sections. |

An unknown key under `contentReach` warns at build time, and a `sampleRate` outside `0`–`1`
(say `50`, meant as a percentage) warns and falls back to `1.0` rather than being clamped.

Measurement happens inside the theme's `.aardvark-content` element (or `#aardvark-main` as a
fallback). A fully custom theme that renders neither measures nothing — and says so with a
console warning on every page, since an empty dashboard would otherwise look exactly like a page
nobody visited.

## What gets measured

Five things, and it is worth being precise about each — the numbers are only useful if
you know exactly what they count.

### Visible time

How long the page was in the **foreground** of a visible tab. Time stops when the reader
switches tabs or minimizes the window, and stops again after 60 seconds with no scroll,
click, keypress, or focus. Capped at one hour per page view.

### Sections reached

A section counts as **reached** when it is at least half visible for at least one
continuous second. "Half visible" means either half of the section, or half of the
screen — the second case matters, because a section longer than the viewport can never
be half of *itself* while filling the reader's entire screen.

Sections inside a collapsed accordion or an inactive tab are never reached, which is
correct: nobody could see them.

### Section dwell

How long each section spent as the one the reader was positioned on — the same
"you are here" rule that highlights an entry in the **On this page** sidebar. Exactly
one section is current at a time, so the per-section times always add up to no more than
the page's visible time. Capped at ten minutes per section per page view, and the
dashboard reports the **median** rather than the average so one tab left open overnight
can't define a section's number.

Time spent above the first heading is credited to a synthetic **intro** section, so a
page's opening paragraphs aren't silently attributed to the first heading below them.

By default Content Reach measures **h2 and h3** anchors (the same band the table of
contents uses). If you enable [`search.sections`](/search/#section-api-symbol-results) with a
wider or narrower heading band, Reach uses that band too — so the heat strip denominator
agrees with the anchors search indexes. A page view carries at most **40 bands**: the intro
plus the first 39 headings and targets in document order (40 targets under `targetsOnly`).
Anything below that is unmeasured — no reach, no dwell, no actions — and is left out of the
completion denominator, so a reader who covers every tracked band can still reach 100%.

A section can be **reached with zero dwell**, and that isn't a bug — the two measures
answer different questions. A long section can fill a reader's screen (so it is reached)
while its heading is still below the top of the viewport, in which case the reader is
still positioned in the section *above* it and the time belongs there. Expect the
sections a reader stopped short of to show reach without dwell.

Once a reader is at the bottom of the page, the time goes to the **last** section, since
that is what they are looking at and what the *On this page* sidebar highlights. On a
short page whose final sections all fit on screen at once, that means the last one
absorbs the tail of the visit. Dwell is most informative on pages long enough that
sections scroll past one at a time.

### Last section reached

The furthest section each page view got to. This is a **proxy**, and the dashboard
labels it as one: a reader who jumps to the bottom of the page from the table of
contents sets it exactly like one who read all the way down. It is where readers got to,
not where they gave up.

### Deliberate actions

Five fixed kinds, counted per section:

- **Copy code** — the copy button on a code block was pressed. Never what was copied.
- **CTA clicks** — a link or button inside a region you [marked](#mark-a-high-value-region).
- **TOC jumps** — an "On this page" link was clicked, counted against the section it points *to*.
- **Search arrivals** — the reader landed on this section from your site's search box. No query text crosses over.
- **Expansions** — an accordion or tab control in this section was used.

The list is closed. Adding a sixth kind takes a new Aardvark release; nothing your pages
contain can invent one.

## What it is not

Content Reach measures **visibility and deliberate interaction**. That is all it can
measure, and the wording throughout the product reflects it:

- A section being on screen is not evidence anyone **read** it — a reader can scroll past with their eyes closed.
- Dwell time is not **attention**. Someone can leave a section on screen while doing something else; the idle cutoff removes the worst of that, not all of it.
- Nothing here measures **comprehension**, **gaze**, or **emotion**, and no combination of these numbers can be turned into such a claim.
- "Last section reached" is not a **drop-off point**.

If you need to know whether people understood something, ask them —
[reader surveys](/survey/) and [page ratings](/analytics/#page-ratings) are the tools for
that.

## Privacy

The design constraint is that Content Reach must be useful without knowing anything
about who anyone is.

**Never collected:** cursor or scroll coordinates, screen recordings, page snapshots,
element or clipboard text, form values, search terms, referrers, user agents, IP-derived
data, or any identifier that outlives a browser tab.

**Collected:** the page path, the ids of the sections that came into view, how long each
held the reader's position, and counts for the five actions above.

Readers are grouped by a random **tab session id** held in `sessionStorage`. It is minted
per tab, dies when the tab closes, and is deliberately separate from the one
[search analytics](/search/#search-analytics-dashboard-ai-enabled-sites) uses, so no
identifier links a Content Reach session to a search session. There is no "unique visitors"
number anywhere in the dashboard, because there is nothing to count.

No query text ever reaches Content Reach — a search arrival hands over the fact that it
happened and nothing else. What the two do share is the page path and roughly the time,
because both are per-page analytics and neither is useful without them. On a quiet page,
someone who can read both datasets could therefore line a search up with a Content Reach session
even though nothing joins them. If that inference matters for your site, keep the terms out
of storage with `search.analytics.store_terms: false` — the funnel still works, and there is
then no query text on either side to line up.

Readers with **Do Not Track** or **Save-Data** enabled send nothing at all.

Data is deleted after **90 days** by default. Nothing derived outlives it — there are no
long-lived summaries that keep a copy after the raw rows expire.

Ingest is bounded per account: **5,000 page views in any rolling 24 hours** by default, each
carrying its 40 bands at most. Past that, further page views are acknowledged but not stored, so
a very busy site sees a plateau rather than an error. `sampleRate` is the lever for staying under
it — a sampled fraction of tabs still gives the dashboard an unbiased picture.

### Consent

Content Reach uses your site's **existing** consent signal; Aardvark ships no cookie
banner of its own. With `requireConsent: true`, nothing is recorded until your banner
sets `window.aardvarkConsent` and dispatches an event:

```js
window.aardvarkConsent = true;
window.dispatchEvent(new Event('aardvark-consent'));
```

This is the same contract [reader surveys](/survey/) use. Set `aardvarkConsent` to a
function if the answer can change. Until then the gate **fails closed** — no signal means
no recording — and a reader who accepts partway down a page is measured from that moment
on, never retroactively.

Whether you need this depends on your jurisdiction and your own legal advice. Content
Reach sets no cookies and stores no personal data, but "no consent needed" is not a
conclusion Aardvark can reach on your behalf. Wire up a banner with
[`integrations.custom`](/analytics/#anything-else-inject-any-snippet) and turn
`requireConsent` on if in doubt.

## Mark a high-value region

Headings become sections automatically. For the blocks that matter most but aren't
headings — an install command, an auth step, a "Try it now" — wrap them in
`{% raw %}{% target %}{% endraw %}`:

{% raw %}
````aardvark
{% target id="install-cli" %}
```bash
brew install aardvarkdocs/tap/aardvark
```
{% endTarget %}
````
{% endraw %}

The id is a lowercase slug, in the same namespace as a heading anchor, so the dashboard
shows one ordered list of sections rather than two. A malformed id warns at build time
and renders the content unwrapped — you lose the measurement, never the content.

For a single component instead of a region, no new syntax is needed:

{% raw %}
```aardvark
{% button url="/signup" attr={"data-aardvark-target": "signup-cta"} %}Start free{% endButton %}
```
{% endraw %}

Section discovery is a single snapshot taken once the page has mounted, so the marked
element has to exist by then. That holds for `{% raw %}{% target %}{% endraw %}` and for any
component that renders a real element — but a handful of Mantine components apply `attr`
several frames after mounting, and a target on one of those can miss the snapshot and go
unmeasured. Nothing breaks and no warning fires; the region simply never appears in the
dashboard. If a marked region doesn't show up, wrap it in `{% raw %}{% target %}{% endraw %}`
instead of marking the component.

Full reference: [Target](/components/extras/target/).

## Reading the dashboard

The **Content Reach** tab opens on the aggregate for a window you pick — the last 24 hours,
7, 30, or 90 days: page views, tab sessions, average visible time, and average sections
reached, followed by the five action totals and a table of the 50 busiest pages with a
reach-completion bar. Export it as CSV from the header; when the window has more than 50
pages with activity, the button and the filename both say the export is the top 50 shown.

Click any page for its **section heat strip** — one band per section in document order,
shaded by either reach or median dwell (a toggle switches between them), with the action
counts beside it. Every band prints its own number and carries a screen-reader label, so the
strip reads correctly in greyscale and with assistive technology.

If you rename or remove a heading, its recorded history stays for the rest of the
retention window — those numbers really happened. The strip keeps showing them, but they
are counted separately and called out as no longer part of the page, so a heading you
renamed last week never reads as a section of today's page that nobody reached.

It is a *section* strip rather than a pixel heatmap by design. Aardvark knows which
section of your page a reader reached; it deliberately does not know where anything was
on their screen, and a pixel map would require exactly the coordinate tracking this
feature refuses to do.

## Turning it off

Remove the `contentReach` block (or set `enabled: false`) and rebuild. The client stops
shipping with your site immediately, and existing data ages out on the normal 90-day
window.

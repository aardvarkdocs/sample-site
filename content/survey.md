---
description: Ask readers a short, Google-Surveys-style question and record the answers to Google Analytics.
icon: fa-solid fa-square-poll-horizontal
menu: docs
title: Reader surveys
weight: 53
---

# Reader surveys

A reader **survey** is a small, dismissible prompt — modeled on the discontinued Google
Surveys product — that asks site visitors a short question and records their answers to
**Google Analytics**. It appears inline at the end of the page once a reader has browsed a
little, asks one question at a time, and never bothers anyone who skips it.

It's off by default. Turn it on with a `survey:` block:

```yaml
survey:
  enabled: true
  title: "Quick question"     # the card heading
  showAfterPageviews: 3       # withhold until the reader's 3rd page of the visit
  sampleRate: 1.0             # fraction of visitors who ever see it (1.0 = everyone)
  reaskAfterDays: 0           # 0 = never re-ask someone who dismissed or finished
  questions:
    - type: single            # multiple choice — pick one
      text: "What brought you here?"
      choices: ["Reference", "Tutorial", "Troubleshooting"]
      randomize: true         # shuffle the answer order
    - type: rating            # a 1..max star scale
      text: "How easy was it to find what you needed?"
      max: 5
    - type: multi             # checkboxes — pick several
      text: "Which sections have you used?"
      choices: ["Guides", "API", "Changelog"]
      noneOfTheAbove: true    # adds a pinned, exclusive "None of the above"
    - type: text              # open-ended; capped at 100 characters
      text: "Anything we could improve?"
      placeholder: "Up to 100 characters"
```

## Survey options

These keys go directly under `survey:`.

| Option | Default | What it does |
|--------|---------|--------------|
| `enabled` | `false` | Turns the survey on. It's opt-in, so it stays off until this is truthy. |
| `questions` | — | The list of questions, asked one at a time — see **Question options** below. At least one valid question is required, or the prompt doesn't render. |
| `title` | `Quick question` | The card's heading. |
| `showAfterPageviews` | `3` | Withhold the prompt until the reader's Nth pageview of the visit (see **When it shows**). |
| `sampleRate` | `1.0` | Fraction of visitors (`0`–`1`) who ever see it. |
| `reaskAfterDays` | `0` | Re-ask a reader who dismissed or finished after this many days; `0` never re-asks. |
| `requireConsent` | `false` | Gate the prompt and its GA events behind analytics consent (see **Consent gating** below). |
| `id` | content hash | The suppression key (the per-survey `localStorage` key). Defaults to a hash of the questions; set it explicitly to pin the key or force a re-prompt (see **It won't nag**). |

## Question types

| `type` | Renders | Recorded to GA as |
|--------|---------|-------------------|
| `single` | radio group (pick one) | the chosen label |
| `multi` | checkbox group (pick several); `noneOfTheAbove: true` adds a pinned, exclusive option | the chosen labels, comma-joined |
| `rating` | a 1–`max` star scale (default 5) | a numeric `value` (1–`max`) |
| `text` | a short textarea | the typed text, capped at 100 characters |

## Question options

Each entry in `questions` is a mapping. `type` and `text` apply to every question; the rest
depend on the type (an option set on a type that ignores it is simply unused).

| Option | Applies to | Default | What it does |
|--------|-----------|---------|--------------|
| `type` | all | `single` | The control to render: `single`, `multi`, `text`, or `rating` (see **Question types** above). |
| `text` | all | — *(required)* | The question shown to the reader. A question with no `text` is dropped with a build warning rather than rendered broken. |
| `choices` | `single`, `multi` | — *(required)* | The answer options, as a list of strings. Each label is capped at 100 characters. A `single`/`multi` question with no `choices` is dropped (with a warning). |
| `randomize` | `single`, `multi` | `false` | Shuffle the answer order each time it's shown; a `noneOfTheAbove` option stays pinned last. |
| `noneOfTheAbove` | `multi` | `false` | Add a pinned, exclusive "None of the above" checkbox — picking it clears the other selections, and picking a real option clears it. |
| `required` | all | `false` | Require an answer before **Submit** is enabled for that question (otherwise it can be left blank and skipped). |
| `max` | `rating` | `5` | The number of stars; the scale runs `1`–`max` (minimum 2). |
| `placeholder` | `text` | — | Hint text shown in the empty textarea. |
| `maxLength` | `text` | `100` | Maximum characters. Hard-capped at 100 (GA4's per-parameter limit), so a larger value is clamped down; the field stops accepting input at the limit and shows a live counter. |
| `id` | all | `q1`, `q2`, … | The GA `question_id` for this question. Defaults to the question's surviving position; set an explicit value for a stable label that won't shift if you reorder or add questions. |

## When it shows

- **Not before the *N*th page.** `showAfterPageviews` (default `3`) withholds the prompt
  until the reader has viewed that many pages this visit — so it greets engaged readers, not
  first-time landers. The tally lives in `sessionStorage` and resets each visit.
- **Sampling.** `sampleRate` (0–1, default `1.0`) shows it to only a stable fraction of
  visitors: one roll is stored per visitor, so the same person is consistently in or out
  across pages.

## It won't nag

Once a reader **dismisses** ("No thanks") or **finishes** the survey, it never shows them
that survey again — the choice is remembered in `localStorage`. The key is a content hash of
*what's asked*, so changing a question's **wording, type, or choices — or adding, removing, or
reordering questions — re-prompts** everyone (it's effectively a new survey). Presentation-only
changes do **not** re-prompt: the `title`, the answer order (`randomize`), a `noneOfTheAbove`
option, whether an answer is `required`, or a per-question `id` (a positional GA label by
default). To control the key directly — evolve the questions *without* re-prompting, or force a
re-prompt on demand — set an explicit top-level `id` on the `survey` block; it's used verbatim
instead of the hash. Set `reaskAfterDays` to a positive number to re-ask after that many days
instead of never.

## What gets recorded

Answers ride `gtag` events, so they're only recorded when [Analytics](/analytics/) is
configured (and `gtag` therefore exists):

```js
gtag('event', 'survey_impression', { survey_id });                        // first shown
gtag('event', 'survey_response',   { survey_id, question_id, answer });    // per answer
gtag('event', 'survey_response',   { survey_id, question_id, value: 4, answer: '4' }); // rating
gtag('event', 'survey_dismiss',    { survey_id, question_id });            // "No thanks"
gtag('event', 'survey_complete',   { survey_id });                         // finished
```

`answer` is always capped at 100 characters (GA4's per-parameter limit): open-ended text
stops at 100 with a live counter, and a multi-select joins whole labels up to that cap.

> **Privacy:** open-ended (`text`) answers are free-form text sent to Google Analytics, which
> prohibits storing personally identifying information. The box shows a *"Please don't include
> personal information."* notice by default; prefer `single` / `multi` / `rating` where you
> can, and review your GA data-retention settings. Under GDPR/CCPA, set `requireConsent` to gate
> the prompt and its events behind your consent flow — see **Consent gating** below.

> **GA4 setup:** `survey_id`, `question_id`, and `answer` are *custom* event parameters — GA4
> collects them (visible in DebugView and the BigQuery export) but won't show them in standard
> reports until you register each as a **custom dimension** (Admin → Custom definitions, scope:
> **Event**). `value` is GA4's built-in numeric metric and needs no setup.

## Consent gating

By default the survey shows and records as soon as a reader is eligible. Where you need consent
*before* any analytics — GDPR/CCPA, say — set `requireConsent: true`: until the page signals that
analytics consent was granted, the prompt stays hidden, **no** gtag event fires, and **nothing** is
written to session/local storage — not even the pageview counter. (So the `showAfterPageviews` gate
counts from when consent is granted, not from the start of the visit.)

The signal is a global your consent banner controls — a boolean, or a function for live state:

```js
// after the reader accepts analytics:
window.aardvarkConsent = true;
// …or a function, to read a consent manager on demand:
window.aardvarkConsent = () => myCMP.hasConsent('analytics');

// then tell a survey that's already on the page to re-check — no reload needed:
window.dispatchEvent(new Event('aardvark-consent'));
```

The gate **fails closed**: with `requireConsent: true` and no clear `true` signal, the prompt never
shows. Withdrawing consent (set it falsy and dispatch the event again) hides a visible prompt and
resets it, so a later re-grant reopens it fresh at the first question. Since gating the prompt also
gates every event, nothing reaches GA until consent is granted — point `aardvarkConsent` at the same
state your site's `gtag` Consent Mode already manages.

> **Impression counting:** `survey_impression` fires once each time the prompt is *shown* — normally
> once per visit, but a withdraw-then-re-grant toggle reopens it (fresh, from question 1) and so
> records another impression. If you compute a response rate as responses ÷ impressions, note that a
> consent toggle can push impressions above one per visitor.

## Accessibility

The prompt is an inline card, never a focus-trapping modal. Every control is a standard
labelled input; the **Submit** and **No thanks** / **Close** controls carry distinct
accessible names; and as the survey advances, the new question — and the closing thank-you —
are announced through an `aria-live` region. See the [Accessibility](/accessibility/) page.

## Customizing

The survey is the built-in `Survey` island. To change the flow, restyle the card, or send
answers somewhere other than Google Analytics (your own endpoint, PostHog, …), drop a
`snippets/Survey.jsx` into your project — a project snippet of that name overrides the
built-in island. To turn the prompt off, set `survey: false` (or `enabled: false`).

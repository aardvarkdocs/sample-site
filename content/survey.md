---
description: Ask readers a short, Google-Surveys-style question and record the answers to Google Analytics.
icon: fa-solid fa-square-poll-horizontal
menu: docs
title: Reader surveys
weight: 53
---

# Reader surveys

A reader **survey** is a small inline prompt — modeled on the discontinued Google
Surveys product — that asks site visitors a short question and records their answers to
**Google Analytics**. It appears at the end of every page and asks one question at a time.

It's off by default. Turn it on with a `survey:` block:

```yaml
survey:
  enabled: true
  title: "Quick question"     # the card heading
  sampleRate: 1.0             # fraction of visitors who ever see it (1.0 = everyone)
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
| `title` | `Quick question` | The card heading when the survey asks **more than one** question. With a single question, only the question's `text` is shown (the heading would duplicate it). |
| `sampleRate` | `1.0` | Fraction of visitors (`0`–`1`) who ever see it. |
| `requireConsent` | `false` | Gate the prompt and its GA events behind analytics consent (see **Consent gating** below). |
| `id` | content hash | The GA `survey_id` label. Defaults to a hash of the questions; set it explicitly for a stable label when you edit the wording (see **Survey identity** below). |

## Question types

| `type` | Renders | Recorded to GA as |
|--------|---------|-------------------|
| `single` | radio group (pick one) | the chosen label |
| `multi` | checkbox group (pick several); `noneOfTheAbove: true` adds a pinned, exclusive option | the chosen labels, comma-joined |
| `rating` | a 1–`max` star scale (default 5) | a numeric `value` (1–`max`) |
| `text` | a short textarea | the typed text, capped at 100 characters in GA (the full text is also stored in the gateway when the [AI assistant](#full-comments-with-the-ai-assistant) is on) |

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
| `maxLength` | `text` | `100` (`2000` with the assistant on) | Maximum characters in the box (a live counter shows usage; the field stops input at the limit). Clamped to 100 — GA4's per-parameter limit — normally. When the [AI assistant](#full-comments-with-the-ai-assistant) is enabled the ceiling rises to 2000 (the gateway stores the full comment; GA still keeps the first 100), and an unset `maxLength` defaults to 2000. A smaller value you set is honored either way. |
| `id` | all | `q1`, `q2`, … | The GA `question_id` for this question. Defaults to the question's surviving position; set an explicit value for a stable label that won't shift if you reorder or add questions. |

## Invalid config

At build time each question is validated before the prompt renders. Broken entries are **dropped
with a warning** rather than shown to readers — the rest of the survey still runs, and surviving
questions are renumbered (`q1`, `q2`, …) so GA `question_id` values have no gaps. If nothing valid
remains, the survey prompt doesn't render at all.

| Problem | What happens |
|---------|--------------|
| Missing or blank `text:` | Question dropped (warning names its position in the list). |
| `single` / `multi` with no `choices:` | Question dropped. |
| Unknown `type:` | Question dropped. Valid types: `single`, `multi`, `text`, `rating`. |

Common synonyms are accepted silently and mapped to the canonical type:

| You write | Maps to |
|-----------|---------|
| `textarea`, `open`, `comment` | `text` |
| `select`, `radio` | `single` |
| `checkbox`, `checkboxes` | `multi` |
| `stars`, `scale` | `rating` |

Omitting `type:` defaults to `single` — you only need to set it when you want something else.

## When it shows

The prompt appears on **every page**, as soon as the reader is eligible — there's no
"browse a few pages first" delay.

- **Per-page opt-out.** Set `survey: false` in a page's front matter to suppress the
  prompt on that page while keeping it enabled site-wide. A page that says nothing
  inherits the site setting. Surveys must be enabled in `aardvark.config.yaml` first —
  front matter cannot turn them on for a site where they are off.
- **Sampling.** `sampleRate` (0–1, default `1.0`) shows it to only a stable fraction of
  visitors: one roll is stored per visitor, so the same person is consistently in or out
  across pages.

## Survey identity

Every GA event carries a `survey_id`. By default it's a short content hash of *what's asked*
(question type, wording, choices, rating scale) — so editing the substance creates a new id in
reports. Presentation-only changes (`title`, `randomize`, `noneOfTheAbove`, `required`, per-question
`id`, etc.) do **not** change the hash. Set an explicit top-level `id` on the `survey` block when
you want a stable GA label across edits.

Completing the survey on one page does **not** hide it on the next — the prompt is meant for
page-specific feedback (`response_page_url` in each event identifies where the answer was left).
Use per-page `survey: false` front matter to omit it from pages where it doesn't belong.

## What gets recorded

Answers ride `gtag` events, so they're only recorded when [Analytics](/analytics/) is
configured (and `gtag` therefore exists):

```js
gtag('event', 'survey_impression', { survey_id });                        // first shown
gtag('event', 'survey_response',   { survey_id, question_id, answer, response_page_url: window.location.pathname.slice(0, 100) });    // per answer
gtag('event', 'survey_response',   { survey_id, question_id, value: 4, answer: '4', response_page_url: window.location.pathname.slice(0, 100) }); // rating
gtag('event', 'survey_complete',   { survey_id });                         // finished
```

`answer` is always capped at 100 characters (GA4's per-parameter limit): open-ended text
stops at 100 with a live counter, and a multi-select joins whole labels up to that cap.

> **Privacy:** open-ended (`text`) answers are free-form text sent to Google Analytics, which
> prohibits storing personally identifying information. The box shows a *"Please don't include
> personal information."* notice by default; prefer `single` / `multi` / `rating` where you
> can, and review your GA data-retention settings. Under GDPR/CCPA, set `requireConsent` to gate
> the prompt and its events behind your consent flow — see **Consent gating** below.

> **GA4 setup:** `survey_id`, `question_id`, `answer`, and `response_page_url` are *custom* event parameters — GA4
> collects them (visible in DebugView and the BigQuery export) but won't show them in standard
> reports until you register each as a **custom dimension** (Admin → Custom definitions, scope:
> **Event**). `value` is GA4's built-in numeric metric and needs no setup. `response_page_url`
> is `window.location.pathname` — the path only, no origin or query string (avoids PII in query params), capped at 100 characters.

## Full comments with the AI assistant

GA4 caps every event parameter at 100 characters, which truncates a real comment. When your site
has the [AI assistant](/ai-assistant/) enabled (`ai.assistant`), the survey **also** posts each
open-ended **`text`** answer to your aardvark **gateway** at full length — up to **2000
characters** — so the whole comment survives. This is automatic; there's nothing extra to
configure beyond enabling the assistant.

- **What's sent:** the comment text (full), the page it was left on (`page_url`, pathname only —
  same path-only, no-query rule as the GA event), and the `survey_id` / `question_id`. It rides the
  same baked public key and origin allowlist as the assistant's chat and feedback calls, so no new
  credentials are involved. It's best-effort and never blocks the reader.
- **What still goes to GA:** everything above — the `survey_response` event still fires with the
  first 100 characters of the answer and the page. GA keeps the aggregate view; the gateway keeps
  the full text.
- **Where to read them:** open your gateway **dashboard**, paste your secret key, and scroll to
  **Page comments** — the most recent 50, each with its page and full comment text.
- **Scope:** only `text` answers go to the gateway (that's where the 100-char cap is lossy).
  `single` / `multi` / `rating` answers are short and stay GA-only. With the assistant **off**, the
  survey behaves exactly as documented above — GA only, `text` capped at 100.

> **Privacy:** the same caution as the GA path applies, and more so since the gateway keeps the
> *full* text — readers see the *"Please don't include personal information."* notice, but review
> your gateway's data handling and retention before enabling it on sensitive sites.

## Consent gating

By default the survey shows and records as soon as a reader is eligible. Where you need consent
*before* any analytics — GDPR/CCPA, say — set `requireConsent: true`: until the page signals that
analytics consent was granted, the prompt stays hidden, **no** gtag event fires, and **nothing** is
written to local storage (the sampling roll only).

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
labelled input and a **Submit** button; as the survey advances, the new question — and the
closing thank-you — are announced through an `aria-live` region. See the [Accessibility](/accessibility/) page.

## Customizing

The survey is the built-in `Survey` island. To change the flow, restyle the card, or send
answers somewhere other than Google Analytics (your own endpoint, PostHog, …), drop a
`snippets/Survey.jsx` into your project — a project snippet of that name overrides the
built-in island. To turn the prompt off site-wide, set `survey.enabled: false` in
`aardvark.config.yaml` (or `survey: false` to disable the whole block). To hide it on
individual pages, set `survey: false` in that page's front matter.

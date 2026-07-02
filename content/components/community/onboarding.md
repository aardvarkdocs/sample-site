---
title: "Onboarding"
description: "The built-in onboarding tag — a guided, step-by-step product tour that
  spotlights elements behind a dimming overlay. A Community Component wrapping
  @gfazioli/mantine-onboarding-tour, with the body fully usable under SSR / no-JS."
menu: components
parent: community
weight: 92
---

# Onboarding

`{% raw %}{% onboarding %}{% endraw %}` is a guided **product tour** — it dims the page,
spotlights one element at a time behind a cutout, and walks the reader through your UI with a
popover (a title and some content) per step. The body of the tag is the content the tour runs
over; each target carries a `data-onboarding-tour-id` matching a step's `id`.

A **Community Component** — wraps [Onboarding](https://gfazioli.github.io/mantine-onboarding-tour/)
by **gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-onboarding-tour`.

A tour needs a "start" trigger and controlled state, which a static page can't wire up on its
own, so the tag renders a **Start tour** button (relabel it with `triggerLabel`) that begins
the tour and resets when it ends. The overlay, focus management, and element measurement are
browser-only, so under server-side rendering or with JavaScript off the body content stays
fully usable and the trigger is simply inert — nothing is hidden behind a tour that can't run.

Use it as `{% raw %}{% onboarding %} … {% endOnboarding %}{% endraw %}` in Markdown, or — for
a tour built from Python data — call `component('aardvark', 'onboarding', tour=[…], children=…)`.

## Demonstrations

### A two-step tour

Define the steps with `tour`, a JSON array of `{id, title, content}` objects. Mark each target
in the body with a matching `data-onboarding-tour-id` using `attr={…}`. Click **Start tour** to
run it.

{% onboarding tour='[{"id": "save", "title": "Save your work", "content": "This button saves the current document."}, {"id": "share", "title": "Share it", "content": "Invite teammates to collaborate."}]' %}
{% group %}
{% button attr={'data-onboarding-tour-id': 'save'} %}Save{% endButton %}
{% button variant='light' attr={'data-onboarding-tour-id': 'share'} %}Share{% endButton %}
{% endGroup %}
{% endOnboarding %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% onboarding tour='[{"id": "save", "title": "Save your work", "content": "This button saves the current document."}, {"id": "share", "title": "Share it", "content": "Invite teammates to collaborate."}]' %}
{% group %}
{% button attr={'data-onboarding-tour-id': 'save'} %}Save{% endButton %}
{% button variant='light' attr={'data-onboarding-tour-id': 'share'} %}Share{% endButton %}
{% endGroup %}
{% endOnboarding %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'onboarding',
          tour=[
              {'id': 'save', 'title': 'Save your work',
               'content': 'This button saves the current document.'},
              {'id': 'share', 'title': 'Share it',
               'content': 'Invite teammates to collaborate.'},
          ],
          children='…the UI the tour runs over…')
```
{% endAccordionSection %}
{% endAccordion %}

### Custom trigger label and hiding the stepper

`triggerLabel` sets the button text. The popover shows a step indicator by default; pass
`withStepper=false` to hide it.

{% onboarding triggerLabel='Take the tour' withStepper=false tour='[{"id": "edit", "title": "Edit inline", "content": "Click any field to edit it in place."}]' %}
{% button attr={'data-onboarding-tour-id': 'edit'} %}Edit profile{% endButton %}
{% endOnboarding %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% onboarding triggerLabel='Take the tour' withStepper=false tour='[{"id": "edit", "title": "Edit inline", "content": "Click any field to edit it in place."}]' %}
{% button attr={'data-onboarding-tour-id': 'edit'} %}Edit profile{% endButton %}
{% endOnboarding %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

The tour runs over whatever you put in its body, so it composes with any built-in. Here it
spotlights cards in a [CardGrid](/components/data-display/card/).

{% onboarding triggerLabel='Tour the dashboard' tour='[{"id": "metrics", "title": "Your metrics", "content": "Live numbers update here."}, {"id": "activity", "title": "Recent activity", "content": "See what changed lately."}]' %}
{% cardGrid cols=2 %}
{% card title='Metrics' withBorder=true attr={'data-onboarding-tour-id': 'metrics'} %}Usage and trends.{% endCard %}
{% card title='Activity' withBorder=true attr={'data-onboarding-tour-id': 'activity'} %}The latest events.{% endCard %}
{% endCardGrid %}
{% endOnboarding %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% onboarding triggerLabel='Tour the dashboard' tour='[{"id": "metrics", "title": "Your metrics", "content": "Live numbers update here."}, {"id": "activity", "title": "Recent activity", "content": "See what changed lately."}]' %}
{% cardGrid cols=2 %}
{% card title='Metrics' withBorder=true attr={'data-onboarding-tour-id': 'metrics'} %}Usage and trends.{% endCard %}
{% card title='Activity' withBorder=true attr={'data-onboarding-tour-id': 'activity'} %}The latest events.{% endCard %}
{% endCardGrid %}
{% endOnboarding %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. The popover controls are all on by default; turn one
off with `=false` (e.g. `withStepper=false`).

| Attribute | Valid values | Description |
| --- | --- | --- |
| `tour` | A JSON array of `{id, title, content}` objects | The tour steps; each `id` matches a target's `data-onboarding-tour-id`. A malformed value warns at build time and the tour renders with no steps. |
| `triggerLabel` | A string (default `Start tour`) | The opener button's text. |
| `withSkipButton` | `true` / `false` (default `true`) | Show a "skip" control in the popover. |
| `withPrevButton` | `true` / `false` (default `true`) | Show the "previous step" control. |
| `withNextButton` | `true` / `false` (default `true`) | Show the "next step" control. |
| `withStepper` | `true` / `false` (default `true`) | Show a step indicator in the popover. Set `=false` to hide it. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered wrapper (see below). |

For tours built from data — or to pass the full upstream API (lifecycle callbacks, per-step
`cutoutPadding` / `cutoutRadius`, …) — call `component('aardvark', 'onboarding', tour=[…], …)`
from Python; every extra keyword is forwarded straight to the underlying component.

## CSS Selector

The island wrapper carries a stable hook you can target from your own CSS:

```css
[data-aardvark-onboarding] {
  /* your overrides */
}
```

The overlay, the focus cutout, and the popover are portaled to `document.body` and styled by
the upstream `@gfazioli/mantine-onboarding-tour` stylesheet (bundled automatically via a CSS
`@import`), so its own Mantine-style class names apply too.

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered wrapper — anything Mantine
doesn't model as a prop (ARIA, `data-*`, analytics hooks). It rides a separate channel from the
component props, so it never collides with them.

The same `attr={…}` channel is how you mark a **tour target**: put `data-onboarding-tour-id`
on any element inside the body so a step's `id` can find it.

{% onboarding tour='[{"id": "cta", "title": "Get started", "content": "Click here to begin."}]' attr={'data-section': 'hero-tour'} %}
{% button attr={'data-onboarding-tour-id': 'cta'} %}Get started{% endButton %}
{% endOnboarding %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% onboarding tour='[{"id": "cta", "title": "Get started", "content": "Click here to begin."}]' attr={'data-section': 'hero-tour'} %}
{% button attr={'data-onboarding-tour-id': 'cta'} %}Get started{% endButton %}
{% endOnboarding %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'onboarding',
          tour='[{"id": "cta", "title": "Get started", "content": "Click here to begin."}]',
          attr={'data-section': 'hero-tour'},
          children=component('aardvark', 'button', children='Get started',
                             attr={'data-onboarding-tour-id': 'cta'}))
```
{% endAccordionSection %}
{% endAccordion %}

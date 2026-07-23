---
title: "Audio"
description: "The built-in audio tag — a Mantine-native audio player (play/pause, scrubbable
  timeline, volume and speed). A Community Component wrapping @gfazioli/mantine-audio, with a
  native <audio> fallback for SSR / no-JS / screen readers."
menu: components
parent: community
weight: 90
---

# Audio

`{% raw %}{% audio %}{% endraw %}` is a Mantine-native **audio player** — a play/pause
transport, a scrubbable timeline, and volume and speed controls, built on the Web Audio API.
Point it at a file with `src` and pick a `variant` and `size`.

A **Community Component** — wraps [Audio](https://gfazioli.github.io/mantine-audio/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-audio`.

The live player needs the Web Audio API, which only exists in a browser, so under
server-side rendering, with JavaScript off, or for a screen reader it degrades to a plain,
fully-functional native `<audio controls>` element using the same source — nothing is lost.

Use it as `{% raw %}{% audio %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'audio', …)`.

## Demonstrations

### Basic player

Set `src` to the audio file URL. Everything else takes the component's defaults.

{% audio src='/media/sample.mp3' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% audio src='/media/sample.mp3' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'audio', src='/media/sample.mp3')
```
{% endAccordionSection %}
{% endAccordion %}

### Variants and size

`variant` (`overlay`, `minimal`, `floating`, `bordered`) changes the layout; `size` (`xs`,
`sm`, `md`, `lg`, `xl`) scales the whole player.

{% audio src='/media/sample.mp3' variant='bordered' size='lg' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% audio src='/media/sample.mp3' variant='bordered' size='lg' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'audio', src='/media/sample.mp3', variant='bordered', size='lg')
```
{% endAccordionSection %}
{% endAccordion %}

### Fallback source

`fallbackSrc` is used when the primary `src` can't be played (e.g. an unsupported codec).

{% audio src='/media/sample.mp3' fallbackSrc='/media/sample.ogg' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% audio src='/media/sample.mp3' fallbackSrc='/media/sample.ogg' %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## With other components

Drop a player into a [Card](/components/data-display/card/) to frame a downloadable sample
alongside its description.

{% card title='Episode 12 — Static Sites' withBorder=true %}
A walkthrough of the build pipeline.

{% audio src='/media/sample.mp3' variant='minimal' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Episode 12 — Static Sites' withBorder=true %}
A walkthrough of the build pipeline.

{% audio src='/media/sample.mp3' variant='minimal' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `asBackground`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `src` | An audio file URL (string) | The audio source to play. |
| `variant` | `overlay` / `minimal` / `floating` / `bordered` | The player layout style. |
| `size` | `xs` / `sm` / `md` / `lg` / `xl` | Scales the whole player. |
| `radius` | A Mantine radius token or any CSS length | Corner rounding. |
| `asBackground` | `true` / `false` (default `false`) | Render as an ambient background track. |
| `shortcuts` | `true` / `false` (default `true`) | Enable keyboard transport controls. |
| `fallbackSrc` | An audio file URL (string) | Played if the primary `src` fails. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see below). |

## CSS Selector

The island wrapper carries a stable hook you can target from your own CSS:

```css
[data-aardvark-audio] {
  /* your overrides */
}
```

The player's inner chrome is styled by the upstream `@gfazioli/mantine-audio` stylesheet
(bundled automatically via a CSS `@import`), so its own Mantine-style class names apply too.

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered element — anything Mantine
doesn't model as a prop (ARIA, `data-*`, analytics hooks). It rides a separate channel from the
component props, so it never collides with them.

A common use is tagging the player with a `data-onboarding-tour-id` so the [Onboarding](/components/community/onboarding/)
tour can spotlight it:

{% audio src='/media/sample.mp3' attr={'data-onboarding-tour-id': 'player', 'aria-label': 'Episode 12 audio'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% audio src='/media/sample.mp3' attr={'data-onboarding-tour-id': 'player', 'aria-label': 'Episode 12 audio'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'audio', src='/media/sample.mp3',
          attr={'data-onboarding-tour-id': 'player', 'aria-label': 'Episode 12 audio'})
```
{% endAccordionSection %}
{% endAccordion %}

---
title: "Audio"
description: "The built-in audio tag — a Mantine-native audio player (play/pause, scrubbable
  timeline, volume and speed). A Community Component wrapping @gfazioli/mantine-audio."
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

The live player needs the Web Audio API, which only exists in a browser, so the player is
built in the browser: the page ships an empty mount point, the client's first paint is a
plain, fully-functional native `<audio controls>` on the same source, and the full player
replaces it on mount. A reader with JavaScript turned off sees nothing in its place.

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
| `size` | `xs` / `sm` / `md` / `lg` / `xl` | Scales the player's controls. |
| `radius` | A Mantine radius token, a number of px, or any CSS length | Corner rounding of the player container. |
| `asBackground` | `true` / `false` (default `false`) | Turn the player into an ambient background track — see *Good to know*. |
| `shortcuts` | `true` / `false` | Keyboard transport controls (Space/K play-pause, J/L and ←/→ seek, ↑/↓ volume, M mute, `<`/`>` speed) while the player has focus. On by default, off under `asBackground`. |
| `fallbackSrc` | An audio file URL (string) | Played if the primary `src` fails to load at runtime. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see below). |

{% callout severity="info" title="Good to know" %}
`asBackground` is a preset, not just a style: it positions the player absolutely to fill its
parent, drops the control bar and the keyboard shortcuts, and leaves a small floating mute
toggle. Give the surrounding block a size and `position: relative`, and pass
`shortcuts=true` if you want the keys back.

Each player downloads its file **twice**: once for playback, and once in full to decode the
Web Audio peaks. It also requests the audio element with `crossOrigin="anonymous"`. Keep that
in mind for a long track, and note that a file served from another origin needs permissive
CORS headers — without them playback still works, but the second fetch fails. Files under
`static/` are same-origin and need nothing extra.
{% endCallout %}

## CSS Selector

The wrapper carries a stable attribute hook, and every part of the player chrome carries a
`mantine-Audio-*` class you can target from `custom.css`:

| Selector | Targets |
| --- | --- |
| `[data-aardvark-audio]` | The wrapper around the player — the safest place to set width or margins. |
| `[data-aardvark-audio] .aardvark-audio-fallback` | The plain native `<audio>` rendered for the first client paint, before the live player mounts. |
| `.mantine-Audio-root` | The player container. |
| `.mantine-Audio-controlBar` / `.mantine-Audio-controls` | The transport bar and the button group inside it. |
| `.mantine-Audio-playButton` / `.mantine-Audio-muteButton` | The play/pause and mute buttons. |
| `.mantine-Audio-timeline` / `.mantine-Audio-timeDisplay` | The scrubbable timeline and the elapsed/total readout. |
| `.mantine-Audio-volumeSlider` / `.mantine-Audio-speedControl` | The volume slider and the playback-speed control. |

The player's colors come from CSS variables on the root (`--audio-color`, `--audio-bg`,
`--audio-text-color`, `--audio-timeline-color`, …), so a theme tweak is usually a variable
override rather than a rule on the chrome itself.

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

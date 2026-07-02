---
title: "Video"
description: "The built-in video tag — a Mantine-native video player with Picture-in-Picture,
  a scrubbable timeline, captions, keyboard shortcuts, and fullscreen. A Community Component
  wrapping @gfazioli/mantine-video, with a native <video> fallback for SSR / no-JS / screen
  readers."
menu: components
parent: community
weight: 91
---

# Video

`{% raw %}{% video %}{% endraw %}` is a Mantine-native **video player** built on the native
`<video>` element — a play/pause transport, a scrubbable **timeline**, a mute toggle and
volume slider, captions, **Picture-in-Picture**, keyboard shortcuts, and a fullscreen
control. Point it at a file with `src`, set a `poster` thumbnail, and frame it with
`aspectRatio`.

A **Community Component** — wraps [Video](https://gfazioli.github.io/mantine-video/) by
**gfazioli**, **MIT** licensed, npm `@gfazioli/mantine-video`.

The live player wires up browser-only media APIs (Picture-in-Picture, fullscreen,
MediaSession), so under server-side rendering, with JavaScript off, or for a screen reader it
degrades to a plain, fully-functional native `<video controls>` element using the same source
and poster — nothing is lost.

Use it as `{% raw %}{% video %}{% endraw %}` in Markdown, or call it from Python logic
(loops, snippets) via `component('aardvark', 'video', …)`.

## Demonstrations

### Basic player

Set `src` to the video URL and `poster` to a thumbnail shown before playback.

{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'video', src='/media/sample.mp4', poster='/media/sample-poster.jpg')
```
{% endAccordionSection %}
{% endAccordion %}

### Aspect ratio

`aspectRatio` sizes the frame — pass a number such as `1.777` for 16:9 or `1.333` for 4:3.
The fallback box keeps the same ratio so the layout never jumps when the live player loads.

{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' aspectRatio=1.777 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' aspectRatio=1.777 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'video', src='/media/sample.mp4',
          poster='/media/sample-poster.jpg', aspectRatio=16 / 9)
```
{% endAccordionSection %}
{% endAccordion %}

### Variants and auto-hiding controls

`variant` (`overlay`, `minimal`, `floating`, `bordered`) sets the layout; `autoHideControls`
takes a number of milliseconds — the control bar fades after that much inactivity during
playback so it stays out of the way (use `0` to disable auto-hide).

{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' variant='bordered' autoHideControls=3000 %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' variant='bordered' autoHideControls=3000 %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'video', src='/media/sample.mp4',
          poster='/media/sample-poster.jpg', variant='bordered', autoHideControls=3000)
```
{% endAccordionSection %}
{% endAccordion %}

## With other components

Frame a clip in a [Card](/components/data-display/card/) with a heading and description.

{% card title='Product tour' withBorder=true %}
A two-minute walkthrough of the editor.

{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' aspectRatio=1.777 variant='minimal' %}
{% endCard %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% card title='Product tour' withBorder=true %}
A two-minute walkthrough of the editor.

{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' aspectRatio=1.777 variant='minimal' %}
{% endCard %}
```
{% endraw %}
{% endAccordionSection %}
{% endAccordion %}

## Attributes

Omit any attribute to take its default. Bare flags (e.g. `asBackground`) become `=True`.

| Attribute | Valid values | Description |
| --- | --- | --- |
| `src` | A video file URL (string) | The video source to play. |
| `poster` | An image URL (string) | Thumbnail shown before playback. |
| `aspectRatio` | A positive number (e.g. `1.777`) | Frame aspect ratio (width ÷ height). |
| `variant` | `overlay` / `minimal` / `floating` / `bordered` | The player layout style. |
| `radius` | A Mantine radius token or any CSS length | Corner rounding. |
| `controls` | `true` / `false` (default `true`) | Show or hide the control bar. |
| `shortcuts` | `true` / `false` (default `true`) | Enable keyboard controls (Space, arrows, M, F, P). |
| `autoHideControls` | A number of milliseconds (e.g. `3000`; `0` disables) | Inactivity delay before the control bar fades during playback. |
| `asBackground` | `true` / `false` (default `false`) | Render as a section-background video. |
| `fallbackSrc` | A video file URL (string) | Played if the primary `src` fails. |
| `attr={…}` | An object of HTML attributes | Forwards raw HTML attributes onto the rendered element (see below). |

## CSS Selector

The island wrapper carries a stable hook you can target from your own CSS:

```css
[data-aardvark-video] {
  /* your overrides */
}
```

The player's inner chrome is styled by the upstream `@gfazioli/mantine-video` stylesheet
(bundled automatically via a CSS `@import`), so its own Mantine-style class names apply too.

## Injecting Attributes

`attr={…}` forwards raw HTML attributes straight onto the rendered element — anything Mantine
doesn't model as a prop (ARIA, `data-*`, analytics hooks). It rides a separate channel from the
component props, so it never collides with them.

A common use is tagging the player with a `data-onboarding-tour-id` so the [Onboarding](/components/community/onboarding/)
tour can spotlight it:

{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' attr={'data-onboarding-tour-id': 'player', 'aria-label': 'Product tour video'} %}

<br>

{% accordion %}
{% accordionSection title="Source: Markdown" %}
{% raw %}
```aardvark
{% video src='/media/sample.mp4' poster='/media/sample-poster.jpg' attr={'data-onboarding-tour-id': 'player', 'aria-label': 'Product tour video'} %}
```
{% endraw %}
{% endAccordionSection %}
{% accordionSection title="Source: Python" %}
```python
component('aardvark', 'video', src='/media/sample.mp4', poster='/media/sample-poster.jpg',
          attr={'data-onboarding-tour-id': 'player', 'aria-label': 'Product tour video'})
```
{% endAccordionSection %}
{% endAccordion %}

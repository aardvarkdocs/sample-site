---
name: video
description: A Mantine-native video player with Picture-in-Picture, a scrubbable timeline,
  captions, keyboard shortcuts, and fullscreen (a Community Component wrapping
  @gfazioli/mantine-video). Set `src` to the video URL and `poster` to a thumbnail shown
  before playback; `aspectRatio` (e.g. 1.777 for 16:9) sizes the frame. Choose a `variant`
  (overlay, minimal, floating, bordered). `controls` shows/hides the control bar,
  `shortcuts` toggles keyboard controls, `autoHideControls` is the inactivity delay in
  milliseconds before the controls fade during playback (0 disables auto-hide), and
  `asBackground` renders a section-background video. The player is built in the browser, so a
  reader with JavaScript turned off sees nothing in its place.
params:
  src: string
  poster: string
  aspectRatio: float
  variant: string
  fallbackSrc: string
  controls: { type: bool, default: true }
  shortcuts: { type: bool, default: true }
  autoHideControls: int
  asBackground: { type: bool, default: false }
  radius: string
body: python
---
```python
# Renders the Video island (Video.jsx), which wraps @gfazioli/mantine-video's <Video> and
# owns the client-only / native-<video>-fallback split (Picture-in-Picture / fullscreen /
# MediaSession are browser-only). Every prop passes straight through to the upstream
# component (which validates the values); unset props are omitted so the component's own
# defaults apply. `src`/`poster` ride the JSON props channel (they're URLs the island hands
# to the player, NOT body text), so there's no children.
props = {}
if src: props['src'] = src
if poster: props['poster'] = poster
# aspectRatio: a positive float (16/9 ≈ 1.777). Drop 0 / negative (a meaningless ratio).
if aspectRatio is not None and aspectRatio > 0: props['aspectRatio'] = aspectRatio
if variant: props['variant'] = variant
if fallbackSrc: props['fallbackSrc'] = fallbackSrc
if radius: props['radius'] = radius
# Booleans: `controls`/`shortcuts` default to True upstream, so only forward an explicit
# `=false`; the opt-in flags forward only when set. (Sending the upstream default every time
# would be redundant; we keep props minimal and let the component's defaults stand.)
if controls is False: props['controls'] = False
if shortcuts is False: props['shortcuts'] = False
# autoHideControls: the inactivity delay (ms) before the control bar fades during playback;
# upstream types it as a number (0 disables auto-hide). Forward any explicit value — including
# 0 (an explicit "never auto-hide") — and omit it only when unset so the upstream default holds.
if autoHideControls is not None: props['autoHideControls'] = autoHideControls
if asBackground: props['asBackground'] = True
print(component('Video', attr=attr, **props))
```

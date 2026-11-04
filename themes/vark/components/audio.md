---
name: audio
description: A Mantine-native audio player (a Community Component wrapping
  @gfazioli/mantine-audio). Set `src` to the audio
  file URL. Choose a `variant` (overlay, minimal, floating, bordered) and a `size` (xs, sm,
  md, lg, xl). `fallbackSrc` is used if the primary source fails; `asBackground` renders it
  as an ambient background track; `shortcuts` toggles keyboard controls (on by default, off
  under `asBackground`). The player is built in the browser — the client's first paint is a
  plain native <audio controls> that the full player replaces on mount, and a reader with
  JavaScript turned off sees nothing in its place.
params:
  src: string
  variant: string
  size: string
  fallbackSrc: string
  asBackground: { type: bool, default: false }
  shortcuts: bool
  radius: string
body: python
---
```python
# Renders the Audio island (Audio.jsx), which wraps @gfazioli/mantine-audio's <Audio>
# and owns the client-only / native-<audio>-fallback split (the Web Audio API is
# browser-only). Every prop passes straight through to the upstream component (which
# validates the values); unset props are omitted so the component's own defaults
# apply. `src` rides the JSON props channel (it's a URL the island hands to the
# player, NOT body text), so there's no children for this self-contained player.
props = {}
if src: props['src'] = src
if variant: props['variant'] = variant
if size: props['size'] = size
if fallbackSrc: props['fallbackSrc'] = fallbackSrc
if radius: props['radius'] = radius
# Booleans: a bare flag (e.g. `asBackground`) or `=true` arrives truthy; emit only when set
# so the upstream default applies otherwise. `shortcuts` has NO param default, so an unset
# value is None and is omitted — upstream then applies its own default, which is on for a
# normal player but OFF under asBackground. Forward BOTH an explicit true and an explicit
# false: dropping `shortcuts=true` would leave a background player's shortcuts off with no
# way for an author to turn them on.
if asBackground: props['asBackground'] = True
if shortcuts is not None: props['shortcuts'] = bool(shortcuts)
print(component('Audio', attr=attr, **props))
```

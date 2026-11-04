---
name: map
description: An embedded OpenFreeMap / MapLibre map with one marker per pin line in its body —
  placed by `address` (geocoded once at build time) or by `lat` and `lng` — each with an optional
  `label`, `description` and `color`. `style`, `zoom`, `center` (a "lat,lng" pair or an address),
  `height` and `interactive` set the view.
body: python
close: required
children: raw
passthrough: true
---
```python
# Renders the Map island (Map.jsx): an embedded OpenFreeMap / MapLibre map with one marker per pin.
#
# The body is taken verbatim (`children: raw`) — a pin is not a rendered tag but a self-closing
# pin line (address="…", or lat=… lng=…) parsed out here with av.parse_pin_tags. Each address is
# geocoded once at build time through the build's shared geocoder (av.geocode); a pin that can't be
# resolved is dropped with a build warning, so one bad address never fails the build. Baking the
# coordinates into the island props means the client never geocodes — it only loads the basemap
# and drops the markers.
#
# `map: false` switches the whole widget off, rendering nothing. Map-level attributes (`style`,
# `zoom`, `center`, `height`, `interactive`) ride through as island props; `center` may itself be
# an address. Mantine Map's JavaScript/CSS and its MapLibre renderer worker are emitted as local
# build assets by the islands bundler, so only map content/view props are passed here: the
# runtime's own asset URLs are deliberately not author-configurable. `style` picks the basemap.
import aardvark.components as av

# OpenFreeMap's free, keyless basemaps. A name resolves to its public style URL; any other value is
# treated as a full MapLibre style URL and passed straight through.
_OPENFREEMAP_STYLES = {"liberty", "bright", "positron"}


def _resolve_pin(pin_attrs):
    # One pin → {lat, lng, label?, description?, color?, address?}. Explicit lat+lng win (no
    # network); otherwise `address` is geocoded. A pin with neither, or an address that won't
    # resolve, returns None (dropped by the caller).
    raw_lat = pin_attrs.get("lat")
    raw_lng = pin_attrs.get("lng") if pin_attrs.get("lng") is not None else pin_attrs.get("lon")
    lat = av.as_float(raw_lat)
    lng = av.as_float(raw_lng)
    address = str(pin_attrs.get("address") or "").strip()

    if lat is not None and lng is not None:
        if not av.coords_in_range(lat, lng):
            av.warn(
                f"Aardvark: {{% pin %}} lat/lng ({lat}, {lng}) is out of range "
                "(latitude -90..90, longitude -180..180) — skipping a pin"
            )
            return None
        coords = (lat, lng)
    elif address:
        coords = av.geocode(globals(), address, kind="pin")
        if coords is None:
            return None
    elif raw_lat is not None or raw_lng is not None:
        # Coordinates were supplied but didn't form a finite pair — a non-finite value (lat=nan) or
        # only one of the two. Name that specifically rather than the generic "needs an address or
        # lat/lng", which misleadingly implies none were given.
        av.warn(
            f"Aardvark: {{% pin %}} lat/lng isn't a finite pair (lat={raw_lat!r}, lng={raw_lng!r}) "
            "— skipping a pin"
        )
        return None
    else:
        av.warn("Aardvark: {% pin %} needs an `address`, or `lat` and `lng` as finite numbers — skipping a pin")
        return None

    pin = {"lat": coords[0], "lng": coords[1]}
    label = str(pin_attrs.get("label") or pin_attrs.get("title") or "").strip()
    description = str(pin_attrs.get("description") or "").strip()
    color = str(pin_attrs.get("color") or "").strip()
    if label:
        pin["label"] = label
    if description:
        pin["description"] = description
    if color:
        # Mantine Map's Marker sets the color as its inline --marker-color style var, so it gets the
        # shared inline-style guard that card and icon apply to their colors.
        if av.css_color_is_safe(color):
            pin["color"] = color
        else:
            av.warn(
                f"Aardvark: {{% pin %}} ignoring color {color!r} — only a plain CSS colour "
                "(hex, a named colour, or rgb()/hsl()) is allowed; using the default marker colour"
            )
    if address:
        pin["address"] = address
    return pin


def _resolve_center(value):
    # A `center` attribute → {lat, lng}. Accepts a "lat,lng" numeric pair or an address (geocoded).
    # None when absent or unresolvable — the client then fits the view to the pins.
    if value is None:
        return None
    text = str(value).strip()
    if not text:
        return None
    if "," in text:
        first, _, second = text.partition(",")
        lat, lng = av.as_float(first), av.as_float(second)
        if lat is not None and lng is not None:
            if not av.coords_in_range(lat, lng):
                av.warn(
                    f"Aardvark: {{% map %}} — center ({lat}, {lng}) is out of range "
                    "(latitude -90..90, longitude -180..180); the map fits the pins instead"
                )
                return None
            return {"lat": lat, "lng": lng}
        parts = [p for p in text.split(",") if p.strip()]
        if parts and all(av.looks_like_number(p) for p in parts):
            # Every comma-separated piece is numeric-looking but the whole didn't parse as a clean
            # lat,lng pair — a doubled dot ("48.8, 2.3.4"), or a fat-fingered third part
            # ("48.8, 2.3, 0"); partition() only splits the first comma, so check them all. That's a
            # typo'd coordinate, not an address: warn pointing at the real problem and bail. This
            # does NOT fire on an address that merely leads with a house number ("123, Baker
            # Street", "221, 45th Street") — a piece there contains letters, so it falls through to
            # the geocoder untouched instead of being silently dropped.
            av.warn(
                f"Aardvark: {{% map %}} — center {value!r} looks like a coordinate pair but one "
                "value isn't a finite number; ignoring it (the map fits the pins instead)"
            )
            return None
    coords = av.geocode(globals(), text, kind="center")
    return {"lat": coords[0], "lng": coords[1]} if coords else None


def _style_url(style):
    # An OpenFreeMap style name → its public URL; any other value is a full style URL.
    if style in _OPENFREEMAP_STYLES:
        return f"https://tiles.openfreemap.org/styles/{style}"
    return style


def _map_props(settings):
    # The Map island props from the open-tag attributes, falling back to the site's `map:` settings,
    # then to built-in defaults.
    get = settings.get
    props = {"style": _style_url(str(attrs.get("style") or get("style") or "liberty").strip())}
    zoom = av.as_float(attrs.get("zoom"))
    if zoom is not None:
        props["zoom"] = zoom
    height = av.as_int(attrs.get("height") if attrs.get("height") is not None else get("height"))
    # A non-positive height would render an invisible (0-height) map, so fall back to the default.
    props["height"] = height if (height is not None and height > 0) else 400
    interactive = attrs.get("interactive")
    # Lock the map on a bare `interactive=false` (the tag grammar reads it as bool False) or a
    # quoted `interactive="false"` (which stays a string, so an identity check alone would miss it).
    if interactive is False or str(interactive).strip().lower() == "false":
        props["interactive"] = False
    return props


if av.map_enabled(globals()):  # `map: false` switches the widget off site-wide: render nothing
    pins = []
    for pin_attrs in av.parse_pin_tags(children):
        pin = _resolve_pin(pin_attrs)
        if pin is not None:
            pins.append(pin)

    props = _map_props(av.map_settings(globals()))
    if pins:
        props["pins"] = pins
    center = _resolve_center(attrs.get("center"))
    if center is not None:
        props["center"] = center
    # Native Map is absent from the SSR registry because Mantine Map imports MapLibre's browser-only
    # runtime, so the no-JavaScript fallback (the pins as plain links) is passed as explicit
    # children; the collector falls back to the same helper only when a direct component('Map')
    # call omits children.
    print(component("Map", children=av.map_fallback_html(pins), attr=attr, **props))
```

// Pure map helpers behind Map.jsx, split into an underscore-prefixed sibling so they are
// unit-testable in the node (vitest) environment without importing React, Mantine Map, or CSS.
// Popup text is rendered as ordinary React children in Map.jsx, so React owns escaping and there
// is intentionally no HTML-string helper or dangerouslySetInnerHTML path.

const MAX_MERCATOR_LATITUDE = 85.051129;
const MAPLIBRE_WORLD_SIZE = 512;
const FIT_PADDING = 48;
const MIN_ZOOM = -2;
const MAX_ZOOM = 15;

export function wrapLongitude(longitude) {
  const wrapped = ((longitude + 180) % 360 + 360) % 360 - 180;
  return wrapped === -180 ? 180 : wrapped;
}

function mercatorY(latitude) {
  const clamped = Math.max(
    -MAX_MERCATOR_LATITUDE,
    Math.min(MAX_MERCATOR_LATITUDE, latitude),
  );
  const radians = (clamped * Math.PI) / 180;
  return (1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2;
}

function latitudeFromMercatorY(y) {
  return (Math.atan(Math.sinh(Math.PI * (1 - 2 * y))) * 180) / Math.PI;
}

// Return the smallest longitude arc containing every pin. The east edge is deliberately allowed
// above 180 degrees: 179 / -179 becomes 179 / 181 instead of a 358-degree box. This is the same
// unwrapped representation MapLibre's adjustAntiMeridian path uses for a crossing bounds pair.
export function pinBounds(pins) {
  const valid = pins
    .map((pin) => ({ lat: Number(pin.lat), lng: Number(pin.lng) }))
    .filter((pin) => Number.isFinite(pin.lat) && Number.isFinite(pin.lng));
  if (!valid.length) return null;

  const longitudes = valid
    .map((pin) => ((pin.lng % 360) + 360) % 360)
    .sort((left, right) => left - right);
  let largestGap = -1;
  let gapIndex = 0;
  for (let index = 0; index < longitudes.length; index += 1) {
    const next = index + 1 < longitudes.length
      ? longitudes[index + 1]
      : longitudes[0] + 360;
    const gap = next - longitudes[index];
    if (gap > largestGap) {
      largestGap = gap;
      gapIndex = index;
    }
  }

  const startIndex = (gapIndex + 1) % longitudes.length;
  const unwrappedWest = longitudes[startIndex];
  let unwrappedEast = longitudes[gapIndex];
  if (unwrappedEast < unwrappedWest) unwrappedEast += 360;
  const west = wrapLongitude(unwrappedWest);
  const east = west + (unwrappedEast - unwrappedWest);
  let south = valid[0].lat;
  let north = valid[0].lat;
  for (const pin of valid.slice(1)) {
    south = Math.min(south, pin.lat);
    north = Math.max(north, pin.lat);
  }
  return [
    [west, south],
    [east, north],
  ];
}

// Reproduce MapLibre's bearing-0 cameraForBounds calculation before Mantine Map constructs the
// map. Map.jsx measures the real map box first, so the first style/tile request already uses the
// final fitted camera instead of briefly loading the world view and reframing after `load`.
export function fitPinsView(pins, viewport) {
  const bounds = pinBounds(pins);
  const width = Number(viewport?.width);
  const height = Number(viewport?.height);
  if (!bounds || !Number.isFinite(width) || !Number.isFinite(height)
    || width <= 0 || height <= 0) {
    return null;
  }

  // Keep the ordinary 48px inset, but scale it down for compact maps so padding can never
  // consume the whole viewport. Reserving at least half of each dimension for the bounds lets
  // every positive measured map receive its final fitted camera before Mantine Map mounts.
  const padding = Math.min(FIT_PADDING, width / 4, height / 4);
  const availableWidth = width - padding * 2;
  const availableHeight = height - padding * 2;

  const [[west, south], [east, north]] = bounds;
  const westX = (west + 180) / 360;
  const eastX = (east + 180) / 360;
  const northY = mercatorY(north);
  const southY = mercatorY(south);
  const widthAtZoomZero = Math.abs(eastX - westX) * MAPLIBRE_WORLD_SIZE;
  const heightAtZoomZero = Math.abs(southY - northY) * MAPLIBRE_WORLD_SIZE;
  const scaleX = widthAtZoomZero === 0 ? Infinity : availableWidth / widthAtZoomZero;
  const scaleY = heightAtZoomZero === 0 ? Infinity : availableHeight / heightAtZoomZero;
  const scale = Math.min(scaleX, scaleY);
  if (!(scale > 0)) return null;

  const calculatedZoom = scale === Infinity ? MAX_ZOOM : Math.log2(scale);
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, calculatedZoom));
  return {
    longitude: wrapLongitude((west + east) / 2),
    latitude: latitudeFromMercatorY((northY + southY) / 2),
    zoom,
  };
}

// The same spot on openstreetmap.org — how the accessible fallback list "shows the map"
// without JavaScript. pin.lat/lng are always finite here: the Python side (av.as_float) rejects
// NaN/inf/non-numbers before they ever reach island props, so the guard below is UNREACHABLE in
// practice. It stays purely as defense-in-depth, keeping the helper self-contained. A finite
// number needs no encoding (only digits, '.', '-', 'e').
export function osmUrl(pin) {
  const lat = Number(pin.lat);
  const lng = Number(pin.lng);
  // Defensive only (see above): unreachable while props come from av.as_float. The fallback <a> is
  // target=_blank, so the worst this degenerate '#' could do is open the current page in a stray
  // tab — still preferable to emitting a malformed mlat/mlon URL that points somewhere wrong.
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '#';
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;
}

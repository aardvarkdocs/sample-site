import { Popover } from '@mantine/core';
import { Map as MantineMap } from 'mantine-map';
import { Component, forwardRef, useCallback, useLayoutEffect, useRef, useState } from 'react';
import './Map.css';
import { fitPinsView, osmUrl, pinBounds, wrapLongitude } from './_mapHelpers';

// The sole native island behind {% map %} / {% pin %} and direct component('Map') calls.
// Mantine Map owns
// the MapLibre instance, marker portals, popovers, resize handling, and controls; Aardvark only
// adapts the existing build-time-geocoded pin/view contract. The bundler imports the exact
// package stylesheet, publishes MapLibre's v6 worker as one content-hashed same-origin module,
// and calls Mantine Map's setWorkerUrl export before any island mounts.
//
// Native Map is deliberately client-only in the SSR registry: neither this static mantine-map
// import nor MapLibre enters the Node renderer. On the client, the accessible location list is
// the first render and remains visible until Mantine Map reports a loaded map; it then moves
// off-screen while staying available to assistive technology.

const DEFAULT_STYLE = 'https://tiles.openfreemap.org/styles/liberty';
const OPENFREEMAP_STYLE_PREFIX = 'https://tiles.openfreemap.org/styles/';

function isOpenFreeMapStyle(style) {
  return typeof style === 'string' && style.startsWith(OPENFREEMAP_STYLE_PREFIX);
}

function coordinatesOf(pins) {
  if (!Array.isArray(pins)) return [];
  return pins.filter((pin) => (
    pin !== null
    && typeof pin === 'object'
    && Number.isFinite(pin.lat)
    && Number.isFinite(pin.lng)
  ));
}

function initialView(center, zoom, pins, viewport) {
  const hasCenter = !!center && Number.isFinite(center.lat) && Number.isFinite(center.lng);
  const hasZoom = Number.isFinite(zoom);
  if (hasCenter) {
    return { longitude: center.lng, latitude: center.lat, zoom: hasZoom ? zoom : 12 };
  }
  if (pins.length === 1) {
    return { longitude: pins[0].lng, latitude: pins[0].lat, zoom: hasZoom ? zoom : 14 };
  }
  if (pins.length > 1) {
    const [[west, south], [east, north]] = pinBounds(pins);
    if (hasZoom) {
      return {
        longitude: wrapLongitude((west + east) / 2),
        latitude: (south + north) / 2,
        zoom,
      };
    }
    return fitPinsView(pins, viewport);
  }
  return { longitude: 0, latitude: 20, zoom: 1 };
}

function SvgIcon({ children }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

function ZoomInIcon() {
  return <SvgIcon><path d="M12 5v14M5 12h14" /></SvgIcon>;
}

function ZoomOutIcon() {
  return <SvgIcon><path d="M5 12h14" /></SvgIcon>;
}

function CompassIcon() {
  return <SvgIcon><path d="m12 3 4 9-4-2-4 2 4-9ZM12 10v11" /></SvgIcon>;
}

function FullscreenIcon({ active }) {
  return active ? (
    <SvgIcon>
      <path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" />
    </SvgIcon>
  ) : (
    <SvgIcon>
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
    </SvgIcon>
  );
}

// The one map failure a reader is better served by degrading than by losing the island to.
// MapLibre v6.7 reports a browser that cannot give it a WebGL2 context by throwing this error out
// of the map constructor (through v6.6 it fired an event and returned a half-built map), and
// Mantine Map runs that constructor in its mount effect — so with no boundary here the throw
// unmounts this subtree, taking the accessible location list below with it and leaving that
// reader nothing at all where they used to keep the addresses beside a blank map. Matched by
// name because the island resolves MapLibre through Mantine Map and never imports it.
const GPU_INITIALIZATION_ERROR = 'GPUInitializationError';

class MapRuntime extends Component {
  constructor(props) {
    super(props);
    this.state = { caught: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { caught: true, error };
  }

  componentDidCatch(error) {
    // Only reached when render below returned the fallback: a rethrow makes this commit fail, and
    // React reports that error itself on its way to the root.
    console.error('Aardvark: the map runtime could not start; showing the location list', error);
  }

  render() {
    if (!this.state.caught) return this.props.children;
    // Everything else — a markup defect, a missing provider, a broken control — is a bug, and
    // dressing it up as a working fallback would hide it. Hand it back to the root handler.
    if (this.state.error?.name !== GPU_INITIALIZATION_ERROR) throw this.state.error;
    return this.props.fallback;
  }
}

function PinMarker({ pin }) {
  const hasPopup = !!(
    pin.label
    || pin.description
    || (pin.address && pin.address !== pin.label)
  );
  const label = pin.label || pin.address || `${pin.lat}, ${pin.lng}`;
  const marker = (
    <MantineMap.Marker
      longitude={pin.lng}
      latitude={pin.lat}
      color={pin.color}
      {...(hasPopup
        ? {
            component: 'button',
            type: 'button',
            className: 'aardvark-map-marker',
            'aria-label': `Show details for ${label}`,
          }
        : {})}
    />
  );
  if (!hasPopup) return marker;
  return (
    <Popover position="top" withArrow shadow="md" withinPortal={false}>
      <Popover.Target>{marker}</Popover.Target>
      <Popover.Dropdown>
        <div className="aardvark-map-popup">
          {pin.label ? <strong className="aardvark-map-popup-title">{pin.label}</strong> : null}
          {pin.description ? (
            <span className="aardvark-map-popup-desc">{pin.description}</span>
          ) : null}
          {pin.address && pin.address !== pin.label ? (
            <span className="aardvark-map-popup-addr">{pin.address}</span>
          ) : null}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

const Map = forwardRef(function Map(
  {
    pins = [],
    style = DEFAULT_STYLE,
    zoom,
    center,
    height = 400,
    interactive = true,
    children,
  },
  ref,
) {
  const [ready, setReady] = useState(false);
  const [viewport, setViewport] = useState(null);
  const rootRef = useRef(null);
  const mergedRootRef = useCallback((node) => {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }, [ref]);
  const validPins = coordinatesOf(pins);
  const hasExplicitCenter =
    !!center && Number.isFinite(center.lat) && Number.isFinite(center.lng);
  const hasExplicitZoom = Number.isFinite(zoom);
  const needsMeasuredView = !hasExplicitCenter && !hasExplicitZoom && validPins.length > 1;
  const view = initialView(center, zoom, validPins, viewport);
  const usesOpenFreeMap = isOpenFreeMapStyle(style);

  useLayoutEffect(() => {
    if (!needsMeasuredView) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const measure = () => {
      const width = root.clientWidth;
      const measuredHeight = root.clientHeight;
      if (width <= 0 || measuredHeight <= 0) return false;
      setViewport((current) => (
        current?.width === width && current?.height === measuredHeight
          ? current
          : { width, height: measuredHeight }
      ));
      return true;
    };

    if (measure() || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(() => {
      if (measure()) observer.disconnect();
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [needsMeasuredView]);

  const handleMapLoad = () => setReady(true);

  const heightStyle = typeof height === 'number' ? `${height}px` : height;
  const label = validPins.length
    ? `Map showing ${validPins.length} location${validPins.length === 1 ? '' : 's'}`
    : 'Map';
  const fallback = children != null ? children : (
    <div className="aardvark-map-fallback">
      {validPins.length ? (
        <ul className="aardvark-map-locations">
          {validPins.map((pin, index) => (
            <li key={index}>
              <a href={osmUrl(pin)} target="_blank" rel="noopener noreferrer">
                {pin.label || pin.address || `${pin.lat}, ${pin.lng}`}
              </a>
              {pin.description ? (
                <span className="aardvark-map-loc-desc"> — {pin.description}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="aardvark-map-empty">Interactive map</p>
      )}
    </div>
  );

  return (
    <div
      ref={mergedRootRef}
      data-aardvark-map=""
      data-openfreemap={usesOpenFreeMap ? '' : undefined}
      data-ready={ready ? '' : undefined}
      className="aardvark-map"
      style={{ height: heightStyle }}
      role="region"
      aria-label={label}
    >
      {view ? (
        <MapRuntime fallback={fallback}>
          <MantineMap
            className="aardvark-map-canvas"
            mapStyle={style}
            initialViewState={view}
            interactive={interactive}
            onMapLoad={handleMapLoad}
          >
            {validPins.map((pin, index) => <PinMarker key={index} pin={pin} />)}
            {interactive ? (
              <MantineMap.Controls position="top-right">
                <MantineMap.ControlGroup>
                  <MantineMap.ZoomInControl><ZoomInIcon /></MantineMap.ZoomInControl>
                  <MantineMap.ZoomOutControl><ZoomOutIcon /></MantineMap.ZoomOutControl>
                </MantineMap.ControlGroup>
                <MantineMap.CompassControl><CompassIcon /></MantineMap.CompassControl>
                <MantineMap.FullscreenControl>
                  {(active) => <FullscreenIcon active={active} />}
                </MantineMap.FullscreenControl>
              </MantineMap.Controls>
            ) : null}
            {fallback}
            {usesOpenFreeMap ? (
              <div className="aardvark-map-attribution" aria-label="Map attribution">
                <a href="https://maplibre.org/" target="_blank" rel="noopener noreferrer">MapLibre</a>
                {' | '}
                <a href="https://openfreemap.org/" target="_blank" rel="noopener noreferrer">OpenFreeMap</a>
                {' © '}
                <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a>
                {' | © '}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
                  OpenStreetMap contributors
                </a>
              </div>
            ) : null}
          </MantineMap>
        </MapRuntime>
      ) : fallback}
    </div>
  );
});

export default Map;

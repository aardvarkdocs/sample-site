import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Tabs as MantineTabs } from '@mantine/core';
import './Tabs.css';

// The island behind the built-in {% tabs %}/{% tab %} block components.
// Mantine's Tabs provides the structure, ARIA roles, and keyboard navigation; this
// wrapper adds the two things Mantine's default Tabs lack:
//
//   1. A sliding underline indicator — a single accent bar that animates to the
//      clicked tab instead of the active underline jumping instantly. Its geometry
//      is measured from the active tab's DOM box (Mantine draws a per-tab border we
//      hide via CSS), so it always lands exactly under the tab even as the strip
//      reflows (resize, late webfont swap).
//   2. A crossfade — the active panel's body fades/rises in on switch.
//
// Authoring shape: each {% tab %} emits an TabsTab carrier holding value/label/
// (color/disabled) props and the Markdown-rendered panel body as children. We read
// those carriers out of `children` and build the real MantineTabs.List/MantineTabs.Tab + MantineTabs.Panel
// tree. Every other prop ({...rest}: variant, orientation, color, radius, grow,
// keepMounted, …) flows straight to Mantine <MantineTabs>, so the full Tabs API is exposed.
//
// SSR note: renderToString runs neither effects nor refs, so the baked HTML shows the
// active panel with no measured indicator. aardvark hydrates that same initial tree.
// Indicator geometry is applied by the mount effect; reading it during render would
// make the client disagree with the server.

// useLayoutEffect on the client (measure before paint → no flicker), useEffect on
// the server (avoids React's "useLayoutEffect does nothing on the server" warning
// during the build-time prerender).
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

// The line-style variants are the ones with an underline to slide; pills/etc. are
// self-indicating, so the custom bar stays off for them.
const UNDERLINE_VARIANTS = new Set(['default', 'outline']);

const Tabs = forwardRef(function Tabs(
  {
    value: valueProp,
    defaultValue,
    onChange,
    orientation = 'horizontal',
    variant = 'default',
    className,
    children,
    ...rest
  },
  ref,
) {
  // Tab descriptors come from the carrier children — props only; the carriers
  // themselves are never rendered. Tolerate stray text/elements between blocks.
  const items = Children.toArray(children)
    .filter((child) => isValidElement(child) && child.type && child.type.isTabItem)
    .map((child) => child.props);

  // Controlled value, defaulting to the first enabled tab. Honor an explicit
  // `value` (controlled, e.g. from a snippet); otherwise own the state. Authors
  // pick the initial tab with `defaultValue` — `value` without external state
  // management would leave the tabs stuck, same as Mantine itself.
  const isControlled = valueProp !== undefined;
  const firstEnabled = (items.find((it) => !it.disabled) || items[0] || {}).value ?? null;
  const [internal, setInternal] = useState(valueProp ?? defaultValue ?? firstEnabled);
  const current = isControlled ? valueProp : internal;

  const [userSwitched, setUserSwitched] = useState(false);
  const handleChange = useCallback(
    (next) => {
      setUserSwitched(true);
      if (!isControlled) setInternal(next);
      if (onChange) onChange(next);
    },
    [isControlled, onChange],
  );

  // --- sliding underline geometry ---
  const vertical = orientation === 'vertical';
  const showIndicator = UNDERLINE_VARIANTS.has(variant);
  const listRef = useRef(null);
  const tabNodes = useRef(new Map()); // value -> tab button DOM node
  const [bar, setBar] = useState(null); // {pos, size} | null (null = nothing to show)

  // Keep the latest active value / orientation in refs so `measure` can have empty
  // deps and stay a stable reference. Otherwise it would be recreated on every tab
  // switch, re-running the ResizeObserver effect below (tearing down and recreating
  // the observer, re-observing every tab) on each click.
  const currentRef = useRef(current);
  currentRef.current = current;
  const verticalRef = useRef(vertical);
  verticalRef.current = vertical;

  const measure = useCallback(() => {
    const list = listRef.current;
    const cur = currentRef.current;
    const node = cur != null ? tabNodes.current.get(cur) : null;
    if (!list || !node) {
      setBar(null);
      return;
    }
    const lr = list.getBoundingClientRect();
    const tr = node.getBoundingClientRect();
    if (verticalRef.current) {
      setBar({ pos: tr.top - lr.top + list.scrollTop, size: tr.height });
    } else {
      setBar({ pos: tr.left - lr.left + list.scrollLeft, size: tr.width });
    }
  }, []);

  // Re-measure synchronously before paint on mount and whenever the active tab or
  // orientation changes (measure is stable, so these drive it). A freshly-rendered
  // element doesn't run CSS transitions, and the bar is rendered only once measured —
  // so it appears in place (no slide-in on load); only later changes (a click, a
  // resize, a late webfont) animate via the CSS transition.
  useIsoLayoutEffect(() => {
    measure();
  }, [current, vertical, measure]);

  // Realign as the strip reflows: window resize, any tab/list box change, and the
  // late webfont swap that shifts tab widths after first layout.
  useEffect(() => {
    if (!showIndicator) return undefined;
    const list = listRef.current;
    let cancelled = false;
    let ro;
    if (list && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => measure());
      ro.observe(list);
      tabNodes.current.forEach((node) => node && ro.observe(node));
    }
    if (typeof window !== 'undefined') window.addEventListener('resize', measure);
    const fonts = typeof document !== 'undefined' ? document.fonts : null;
    if (fonts && fonts.ready && typeof fonts.ready.then === 'function') {
      // Guard against unmount: fonts may resolve after this instance is gone.
      fonts.ready.then(() => {
        if (!cancelled) measure();
      });
    }
    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (typeof window !== 'undefined') window.removeEventListener('resize', measure);
    };
  }, [measure, showIndicator]);

  const setTabNode = useCallback(
    (val) => (node) => {
      if (node) tabNodes.current.set(val, node);
      else tabNodes.current.delete(val);
    },
    [],
  );

  // The crossfade plays only after a real switch — never on initial load / SSR
  // re-render. prefers-reduced-motion is honored in the CSS (it zeroes both the
  // indicator transition and the fade animation).
  const fade = userSwitched;

  return (
    <MantineTabs
      ref={ref}
      value={current}
      onChange={handleChange}
      orientation={orientation}
      variant={variant}
      keepMounted={false}
      className={className || undefined}
      data-aardvark-tabs=""
      data-indicator={showIndicator ? '' : undefined}
      {...rest}
    >
      <MantineTabs.List ref={listRef}>
        {items.map((it) => (
          <MantineTabs.Tab
            key={it.value}
            value={it.value}
            leftSection={it.leftSection}
            rightSection={it.rightSection}
            color={it.color}
            disabled={it.disabled}
            ref={setTabNode(it.value)}
          >
            {it.label}
          </MantineTabs.Tab>
        ))}
        {showIndicator && bar && (
          <span
            aria-hidden="true"
            className="aardvark-tabs-indicator"
            data-orientation={orientation}
            style={
              vertical
                ? { transform: `translateY(${bar.pos}px)`, height: `${bar.size}px` }
                : { transform: `translateX(${bar.pos}px)`, width: `${bar.size}px` }
            }
          />
        )}
      </MantineTabs.List>

      {items.map((it) => (
        <MantineTabs.Panel key={it.value} value={it.value} className="aardvark-tabs-panel">
          {/* Key the active panel's body by `active-${current}` so it remounts on each
              switch and the entry animation replays. Inactive panels keep their stable
              `it.value` key — so if an author opts into keepMounted={true}, the hidden
              panels aren't needlessly remounted (state preserved); only the newly active
              one does. With the default keepMounted={false} only the active panel exists,
              so this is identical to keying on `current`. */}
          <div
            className="aardvark-tabs-fade"
            key={it.value === current ? `active-${current}` : it.value}
            data-animate={fade ? '' : undefined}
          >
            {it.children}
          </div>
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
});

export default Tabs;

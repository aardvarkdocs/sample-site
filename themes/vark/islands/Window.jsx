import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Window as CommunityWindow } from '@gfazioli/mantine-window';
import './Window.css';

// The island behind the built-in {% window %} tag (window.md).
// It registers under the native name `Window` — distinct from the Mantine-core wrapper
// builtin `FloatingWindow` (FloatingWindow.jsx), which is a different,
// trigger-opened titled Paper. This one wraps the community @gfazioli/mantine-window: a
// full draggable + resizable window with a header, title, and close/collapse/tools controls.
// A **Community Component**.
// Client-only, by its Community Component marker: ../components/README.md (The React components).
//
// The block body is the window content (children). `title` rides the header; `draggable`
// ('none'|'window'|'header'|'both'), `resizable' ('none'|'vertical'|'horizontal'|'both'),
// `color`, `radius`, `shadow`, and the various with* toggles flow straight through via
// {...rest}, so the full Window API stays available.
//
// withinPortal default: Mantine's Window defaults to withinPortal=true, which positions the
// window `fixed` over the whole VIEWPORT — disruptive for an in-page docs demo. So this
// wrapper defaults it to false (the window then positions `absolute` within a relative host),
// and renders it inside a relative, fixed-height host div so the absolutely-positioned window
// has somewhere to live and the surrounding page text isn't shoved around. An author can pass
// withinPortal=true to opt into the viewport-floating behavior.
//
// `opened` seeds the package's visibility state, which starts CLOSED (use-window-state.mjs:
// `useState(opened ?? false)`) and renders null while it is. A window placed in a page has no
// separate opener to flip it, so this wrapper opens it by default; the package only re-syncs
// when the prop CHANGES, so the header's close button still works. Passing opened={false}
// (component('Window', opened=False)) keeps a window shut.
// Tall enough to hold a default-sized window (the package sizes one 400x400) dropped at
// defaultY below, so an open window can't spill over the text that follows it.
// Reserved ONLY while an inline window is actually on screen. The height exists so an open
// window can't spill over the following text — but holding it unconditionally left a blank gap in
// three states that render nothing here: opened={false}, after the header's close button fires,
// and withinPortal (where the window mounts on document.body, not in this host).
//
// It is DERIVED, not a constant: `{% window height=700 %}` forwards defaultHeight=700, and a fixed
// 432 (the package's own 400 default plus twice the 16px offset) would have let any taller window
// overlay the text below. A non-numeric DimensionValue ('50%') falls back to the package default,
// since the host cannot resolve a percentage of a height it is itself defining.
const PACKAGE_DEFAULT_HEIGHT = 400;
const HOST_BASE = { position: 'relative', marginBlock: 'var(--mantine-spacing-md)' };

function reservedHeight(defaultHeight, defaultY) {
  const h = Number(defaultHeight);
  const offset = Number(defaultY);
  return (Number.isFinite(h) && h > 0 ? h : PACKAGE_DEFAULT_HEIGHT)
    + 2 * (Number.isFinite(offset) && offset > 0 ? offset : 0);
}

const Window = forwardRef(function Window(
  {
    opened = true,
    withinPortal = false,
    defaultX = 16,
    defaultY = 16,
    // Read, not consumed: the package still needs it, and the host sizes itself from it.
    defaultHeight,
    children,
    onClose,
    ...rest
  },
  ref,
) {
  // The package owns visibility after mount (it seeds its own state from `opened` and only
  // re-syncs when that prop CHANGES), so the wrapper mirrors it to know whether to hold space.
  const [visible, setVisible] = useState(opened);
  useEffect(() => setVisible(opened), [opened]);
  const handleClose = useCallback((...args) => {
    setVisible(false);
    if (typeof onClose === 'function') onClose(...args);
  }, [onClose]);
  return (
    <div
      className="aardvark-window-host"
      style={
        visible && !withinPortal
          ? { ...HOST_BASE, minHeight: reservedHeight(defaultHeight, defaultY) }
          : HOST_BASE
      }
    >
      <CommunityWindow
        ref={ref}
        opened={opened}
        withinPortal={withinPortal}
        defaultX={defaultX}
        defaultY={defaultY}
        defaultHeight={defaultHeight}
        onClose={handleClose}
        {...rest}
      >
        {children}
      </CommunityWindow>
    </div>
  );
});

export default Window;

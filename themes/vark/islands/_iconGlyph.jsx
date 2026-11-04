// Shared icon-spec -> React-node resolver for the button islands (ActionIcon / CloseButton).
// The `_` prefix keeps it out of the component registry (it's a helper, not an author-facing
// island), while aardvark still stages it with the rest of the theme's islands folder, so the
// button islands can import it.
//
// It mirrors Icon.jsx's `glyphFor`: an icon spec is one of an inline <svg> (author-trusted
// escape hatch), an image URL/path, an emoji, a Font Awesome class, or a bare Tabler name (lazily
// fetched from a CDN). Unlike Icon it returns the bare glyph (no ThemeIcon wrapper) sized to
// the host button via currentColor + a className, since ActionIcon / CloseButton own their own
// chrome. An unrecognized / blocked spec returns null + a dev console.warn (rather than a sentinel),
// so the callers stay tiny.

import { classifyIcon, sanitizeSvg, LazyTablerIcon } from '@aardvark/islands/tabler-icons';
import { sanitizeHref } from '@aardvark/islands/safe-href';

const DEFAULT_CDN = 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.44.0/icons';

// Resolve an icon spec to a React node, or null (empty / unrecognized / blocked spec). `iconCdn`
// repoints the Tabler CDN (CSP / self-host); `filled` picks the filled Tabler style. `where` names
// the calling tag in the console warning so the author knows which directive to fix.
export function iconGlyph(icon, { iconCdn = DEFAULT_CDN, filled = false, where = 'icon' } = {}) {
  const value = typeof icon === 'string' ? icon.trim() : '';
  switch (classifyIcon(value)) {
    case 'svg': {
      // AUTHOR-TRUSTED ONLY — sanitizeSvg rebuilds author-written template SVG from an allowlist;
      // do NOT wire this path to user-submitted input (see @aardvark/islands/tabler-icons).
      const safe = sanitizeSvg(value);
      if (safe) {
        return (
          <span
            className="aardvark-button-glyph aardvark-button-glyph-svg"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: safe }}
          />
        );
      }
      break;
    }
    case 'image': {
      // sanitizeHref is a WHITELIST — only http(s) + relative paths pass; data:/javascript:/
      // protocol-relative are rejected (matches Icon's image case).
      const src = sanitizeHref(value);
      if (src) {
        return <img className="aardvark-button-glyph aardvark-button-glyph-img" src={src} alt="" />;
      }
      break;
    }
    case 'emoji':
      return (
        <span className="aardvark-button-glyph aardvark-button-glyph-emoji" aria-hidden="true">
          {value}
        </span>
      );
    case 'fa':
      // Font Awesome classes pass through verbatim; the <i> inherits currentColor. Needs the FA
      // stylesheet (theme.fontawesome: true) to show.
      return <i className={`aardvark-button-glyph aardvark-button-glyph-fa ${value}`} aria-hidden="true" />;
    case 'tabler':
      return (
        <LazyTablerIcon
          name={value}
          iconCdn={iconCdn}
          style={filled ? 'filled' : 'outline'}
          className="aardvark-button-glyph aardvark-button-glyph-tabler"
        />
      );
    case 'none':
      return null; // empty spec — nothing to render, no warning
    default:
      break; // 'unknown' — fall through to the warn below
  }
  // An empty spec already returned above; reaching here means an unrecognized token ('unknown') or
  // a recognized svg/image the sanitizer rejected (those `break` out of their case). Warn the author
  // and render nothing — matching Icon's glyphFor / resolveCardIcon.
  if (value && typeof console !== 'undefined') {
    console.warn(
      `Aardvark: {% ${where} %} unrecognized or blocked icon "${value}" — use a Tabler name ` +
        `(https://tabler.io/icons), a Font Awesome class, a relative path or https:// image URL, ` +
        `an emoji, or inline <svg>`,
    );
  }
  return null;
}

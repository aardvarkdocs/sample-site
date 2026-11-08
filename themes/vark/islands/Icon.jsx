/* @aardvark-island {"urlProps": ["icon"], "iconImageProps": ["icon"], "implements": ["Icon@1"]} */
import { ThemeIcon, Tooltip } from '@mantine/core';
import { classifyIcon, sanitizeSvg, LazyTablerIcon } from '@aardvark/islands/tabler-icons';
import { sanitizeHref } from '@aardvark/islands/safe-href';
import './Icon.css';

// The island behind the built-in inline {% icon %} tag. It renders any icon
// source inside a Mantine ThemeIcon — exposing ThemeIcon's full surface (variant / color / size /
// radius / gradient / autoContrast) — and wraps it in a Mantine Tooltip when `label` is set. It
// mounts as an INLINE island (the collector emits a <span> wrapper; ThemeIcon is rendered as
// component="span") so it flows inside a heading or mid-sentence as valid phrasing content rather
// than a block <div> that would break the enclosing paragraph.
//
// Default look: variant="transparent" with no explicit size. Icon.css then renders that as
// a bare ~1em glyph that inherits the surrounding text's size and color (so `{% icon "rocket" %}`
// reads like inline text, not a chip). Pass variant=/color=/size=/radius= to get the full ThemeIcon
// chip. Icon sources mirror the {% card %} classifier (@aardvark/islands/tabler-icons): a bare Tabler name (lazily
// fetched from the CDN), a Font Awesome class, an image URL/path, an emoji, or inline <svg>.
//
// SSR note: pure composition except the lazily-fetched Tabler glyph, whose effect is client-only —
// so renderToString bakes everything but a Tabler icon verbatim (Tabler bakes a reserved
// empty box that the client fills on mount).

// Resolve an icon spec to the inner glyph node (no ThemeIcon wrapper). Returns the React node to
// render, or a string SENTINEL that Icon turns into an accurate console warning:
//   'blocked' — a recognized image/SVG that sanitizeHref/sanitizeSvg rejected (a protocol-relative,
//               javascript:, or data: URL, or malformed <svg>): the author wrote a valid-looking
//               spec, so "unrecognized icon" would mislead them;
//   'unknown' — an unrecognized token (classifyIcon couldn't place it at all).
// null means an empty spec (nothing to render, no warning). Mirrors resolveCardIcon's routing but
// returns the bare glyph so Icon owns the ThemeIcon props.
function glyphFor(icon, iconCdn, filled) {
  const value = typeof icon === 'string' ? icon.trim() : '';
  switch (classifyIcon(value)) {
    case 'svg': {
      // AUTHOR-TRUSTED ONLY — never wire this path to user-submitted input. The inline-<svg> escape
      // hatch is author-written template content (same trust level as raw HTML in Markdown);
      // sanitizeSvg rebuilds it from an allowlist before the dangerouslySetInnerHTML below.
      const safe = sanitizeSvg(value);
      return safe ? (
        <span className="aardvark-themeicon-svg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: safe }} />
      ) : 'blocked';
    }
    case 'image': {
      // Run every src through sanitizeHref (classifyIcon also routes bare/relative paths and image
      // extensions here). It's a WHITELIST — only http(s) and relative paths pass, so every other
      // scheme (data:/javascript:/blob:/vbscript:/file:/protocol-relative //…) is rejected, matching
      // the {% icon %} tag's build-time scheme check.
      const src = sanitizeHref(value);
      return src ? <img className="aardvark-themeicon-img" src={src} alt="" /> : 'blocked';
    }
    case 'emoji':
      return (
        <span className="aardvark-themeicon-emoji" aria-hidden="true">
          {value}
        </span>
      );
    case 'fa':
      // Font Awesome classes pass through verbatim; the <i> inherits the ThemeIcon's currentColor.
      // Needs the FA stylesheet (theme.fontawesome: true) to show.
      return <i className={`aardvark-themeicon-fa ${value}`} aria-hidden="true" />;
    case 'tabler':
      return (
        <LazyTablerIcon
          name={value}
          iconCdn={iconCdn}
          style={filled ? 'filled' : 'outline'}
          className="aardvark-themeicon-glyph"
        />
      );
    case 'unknown':
      return 'unknown';
    default:
      return null; // 'none' — empty spec, nothing to render
  }
}

export default function Icon({
  icon,
  variant = 'transparent',
  color,
  size,
  radius,
  gradient,
  label,
  filled,
  iconCdn,
  autoContrast,
  // Mantine margin/padding style props (m/mt/mb/mx/my/p/… — for nudging an inline icon) are the
  // only extra props the directive forwards, so spreading `rest` onto ThemeIcon (a Box) just applies
  // them: a bare number is px, so `{% icon "star" mt=-2 %}` lifts the glyph 2px.
  ...rest
}) {
  const glyph = glyphFor(icon, iconCdn, filled);
  // A recognized image/SVG that the URL/SVG sanitizer rejected — tell the author *why* rather than
  // sending them to tabler.io hunting for a misspelling. (console is always defined in the browser
  // and the SSR/Node runtime, so no guard.)
  if (glyph === 'blocked') {
    console.warn(
      `Aardvark: {% icon %} image/SVG "${icon}" was blocked — use a relative path ` +
        `(/icons/logo.svg) or an https:// URL; protocol-relative (//…), javascript:, and data: URLs are rejected`,
    );
    return null;
  }
  if (glyph === 'unknown') {
    console.warn(
      `Aardvark: {% icon %} unrecognized icon "${icon}" — use a Tabler name ` +
        `(https://tabler.io/icons), a Font Awesome class, an image URL, an emoji, or inline <svg>`,
    );
    return null;
  }
  if (!glyph) return null; // empty spec — nothing to render

  // No explicit `size` => a bare glyph sized to the surrounding text (1em). Setting the ThemeIcon
  // CSS vars inline beats Mantine's size var so the box tracks the text instead of a fixed chip
  // size; an explicit `size` hands sizing back to ThemeIcon. With the default transparent variant
  // and no `color`, the glyph also inherits the text color (currentColor) rather than the theme's
  // primary — so a plain {% icon %} matches its surroundings exactly.
  const bare = size == null;
  const isChip = variant !== 'transparent';
  const inheritColor = variant === 'transparent' && color == null;
  const style = {};
  if (bare) {
    style['--ti-size'] = '1em';
    // A transparent glyph fills the 1em cell (reads like inline text); a chip variant insets the
    // glyph so it has the usual padding inside the chip rather than touching its edges.
    style['--ti-fz'] = isChip ? '0.72em' : '1em';
    style.minWidth = 0;
  }
  if (inheritColor) {
    style['--ti-color'] = 'currentColor';
  }

  // A labelled icon gets role=img + its name AND tabIndex=0 so it's keyboard-focusable — otherwise
  // the Tooltip's focus trigger can never fire (a <span> isn't in the tab order on its own). This
  // assumes a STANDALONE icon: a labelled icon nested in an <a>/<button> would be a second tab stop
  // and a doubled SR announcement, so the docs steer authors to leave an icon-as-link decorative and
  // name the outer element (aria-label on the <a>) instead — see content/components/icon.md.
  const a11y = label ? { role: 'img', 'aria-label': label, tabIndex: 0 } : { 'aria-hidden': 'true' };
  const themeIcon = (
    <ThemeIcon
      component="span"
      className="aardvark-themeicon"
      {...rest}
      data-bare={bare ? '' : undefined}
      variant={variant}
      color={color}
      radius={radius}
      gradient={gradient}
      autoContrast={autoContrast}
      style={style}
      {...(size == null ? {} : { size })}
      {...a11y}
    >
      {glyph}
    </ThemeIcon>
  );

  // A `label` is the icon's accessible name AND, on hover/focus, a Mantine Tooltip. `events` adds
  // keyboard focus (a11y) and touch to the default hover trigger.
  if (!label) return themeIcon;
  return (
    <Tooltip label={label} withArrow events={{ hover: true, focus: true, touch: true }}>
      {themeIcon}
    </Tooltip>
  );
}

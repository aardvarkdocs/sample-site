import { forwardRef } from 'react';
import { Anchor, BackgroundImage, Badge, Box, Button, Card as MantineCard, Group, Image, Text, Tooltip } from '@mantine/core';
import { resolveCardIcon, LazyTablerIcon, classifyIcon } from '@aardvark/islands/tabler-icons';
import { sanitizeHref } from '@aardvark/islands/safe-href';
import './Card.css';

// The island behind the built-in {% card %} block. It composes a Mantine Card
// from a flat prop set so authors get the full card surface — shadow/radius/withBorder/
// padding, a cover OR full-bleed background image, any Tabler icon (lazily loaded), badges,
// an accent color, gradient/glass/stat variants, and a whole-card outbound link — without
// writing JSX. Works standalone or as a child of {% cardGrid %} (which lays cards out in a
// responsive SimpleGrid).
//
// `variant` is OUR enum (not Mantine's — Card has no variant prop): elevated (the flashy
// out-of-box DEFAULT) | plain (a bare bordered card, no shadow/lift) | gradient | glass | image |
// stat. (No `"default"` value — aardvark's component conventions never make an author write a
// literal `default` attribute value, and it would also be confusing next to the real default,
// `elevated`.) It rides as a data-variant attribute that MantineCard.css styles; the individual
// props still override pieces.
//
// Whole-card links use the stretched-link pattern, NOT Mantine's polymorphic
// `component="a"`: the card stays a <div> and exactly ONE inner anchor (the title, or a
// labelled full-card overlay when there's no title) carries a `::after` that covers the
// card. That keeps a single, well-named link in the a11y tree while still allowing inner
// body links — a card-wide <a> would forbid them (nested interactive content is invalid).
//
// SSR note: pure composition of @mantine/core primitives — no effects, no window — except
// the lazily-fetched icon, whose effect is client-only. So the build-time prerenderer
// (renderToString) bakes the card verbatim (icon as a reserved empty box) and the
// client hydrateRoots that markup — then the icon's effect fills it in (createRoot only when the
// island wasn't prerendered).

const MANTINE_COLOR_RE = /^[a-z]+$/i;

// Resolve a card color to a CSS value. A bare alphabetic token might be a Mantine palette name (a
// default like `teal`, or a theme-registered one like `primary`) OR a plain CSS named color
// (`white`, `navy`). Emit the Mantine shade-6 var with the lowercased name itself as the CSS
// fallback: a real Mantine color resolves via the palette, and a CSS named color still works when
// that var is undefined (e.g. `var(--mantine-color-white-6, white)` → `white`). Lowercasing also
// matches Mantine's lowercase-only vars, so `accent="Blue"` works. Non-alpha values (#hex,
// rgb()/hsl(), var()) pass through unchanged. Exported for unit tests.
export function colorToken(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const v = value.trim();
  if (MANTINE_COLOR_RE.test(v)) {
    const name = v.toLowerCase();
    return `var(--mantine-color-${name}-6, ${name})`;
  }
  return v;
}

// The destination domain shown in an outbound link card's hover tooltip (e.g. "mantine.dev"), or
// null. ONLY an absolute http(s) href has a real domain: a relative href returns null so the
// URL-parse base ("aardvark.invalid") can never leak into the label — `external=true` can force a
// relative href to be treated as external, but it still has no domain to display. Exported for tests.
export function externalDomain(href) {
  if (typeof href !== 'string' || !/^https?:\/\//i.test(href)) return null;
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function buildGradientCss(gradient) {
  if (!gradient || typeof gradient !== 'object') {
    // No explicit gradient on a gradient card -> derive a tasteful one from the theme accent.
    return 'linear-gradient(135deg, var(--mantine-primary-color-filled), var(--mantine-primary-color-filled-hover, var(--mantine-primary-color-filled)))';
  }
  const fromToken = colorToken(gradient.from);
  const from = fromToken || 'var(--mantine-primary-color-filled)';
  // With only one color (`gradient="indigo"`), derive a lighter second stop so it's still a real
  // gradient rather than a flat block.
  const to =
    colorToken(gradient.to) ||
    (fromToken ? `color-mix(in srgb, ${from} 72%, #fff)` : null) ||
    'var(--mantine-primary-color-filled-hover, var(--mantine-primary-color-filled))';
  const deg = typeof gradient.deg === 'number' ? gradient.deg : 135;
  return `linear-gradient(${deg}deg, ${from}, ${to})`;
}

// The external-link affordance (Tabler `external-link`, outline). Inlined rather than imported
// from @tabler/icons-react so the islands bundle stays icon-free — consistent with the rationale
// for CDN-loading the card icons (see @aardvark/islands/tabler-icons). Decorative (aria-hidden); renders
// instantly with no import or fetch.
function ExternalLinkGlyph() {
  return (
    <svg
      className="aardvark-card-ext"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" />
      <path d="M11 13l9 -9" />
      <path d="M15 4h5v5" />
    </svg>
  );
}

const Card = forwardRef(function Card(props, ref) {
  const {
    title,
    subtitle,
    children,
    href,
    target,
    rel,
    external = false,
    icon,
    iconColor,
    iconVariant = 'transparent',
    iconStyle = 'outline',
    iconCdn,
    image,
    imageHeight = 160,
    alt = '',
    badge,
    badges,
    badgeColor,
    badgeVariant = 'light',
    variant = 'elevated',
    color,
    accent,
    gradient,
    shadow,
    radius = 'md',
    withBorder,
    padding = 'lg',
    accentBar,
    sheen,
    align = 'left',
    minHeight,
    cta,
    ctaVariant = 'button',
    buttonVariant,
    watermark,
    ...rest
  } = props;

  const accentColor = accent || color || undefined;
  const safeHref = sanitizeHref(href);
  const clickable = Boolean(safeHref);
  // External = an absolute http(s) URL. sanitizeHref already rejects protocol-relative `//host`
  // (and non-http(s) schemes), so safeHref is only ever an absolute http(s) URL or a rooted/
  // relative path — the latter is internal. External cards get target=_blank + rel="noopener…".
  const ext = clickable && (external === true || /^https?:\/\//i.test(safeHref));
  const linkTarget = target || (ext ? '_blank' : undefined);
  const linkRel = rel || (ext ? 'noopener noreferrer' : undefined);
  // For an outbound link card, surface the destination domain as a hover tooltip on the whole card
  // so readers see they're leaving the site (e.g. "mantine.dev"). externalDomain returns null for a
  // relative href (even one forced external via external=true), so the URL-parse base never leaks.
  const extDomain = ext ? externalDomain(safeHref) : null;

  const isImage = variant === 'image';
  const isGradient = variant === 'gradient';
  // Run the cover/background image through sanitizeHref, exactly as the icon-image path does: it
  // reaches <Image src>/<BackgroundImage src>, so a `data:image/svg+xml,…` (whose inner <image href>
  // can fetch externally) or other non-http(s) URI must be rejected. An unsafe value becomes
  // undefined here, so every `image` use below degrades to "no image" rather than a raw src.
  const safeImage = sanitizeHref(image);
  // variant="image" only yields a dark surface when an `image` is actually supplied (the
  // BackgroundImage branch below renders only then). Without it the card stays on the normal
  // light surface, so light text would be invisible — gate lightText AND the zero padding on the
  // image being present, so a stray variant="image" with no (usable) image degrades to a normal card.
  const imageBg = isImage && Boolean(safeImage);
  const lightText = imageBg || isGradient;

  // Sheen sweeps on clickable cards by default (max-flashy); opt out with sheen=false.
  const showSheen = sheen === undefined ? clickable : Boolean(sheen);

  const resolvedWithBorder =
    withBorder !== undefined ? withBorder : variant === 'plain' || variant === 'glass';
  const resolvedShadow = shadow !== undefined ? shadow : variant === 'elevated' ? 'md' : 'sm';

  const iconNode = icon
    ? resolveCardIcon(icon, {
        iconCdn,
        // On a photo/gradient surface a bare (transparent) accent-colored glyph can wash out —
        // use white there. Authors can still override with iconColor.
        color: iconColor || (lightText ? 'white' : accentColor),
        variant: iconVariant,
        style: iconStyle,
        gradient: iconVariant === 'gradient' ? gradient : undefined,
      })
    : null;

  // `badges` arrives as an array (the template layer splits the comma-separated shorthand, so a
  // single label with a comma uses the singular `badge` instead). A stray non-array string is
  // treated as one badge — never split here.
  const badgeList = (
    Array.isArray(badges) ? badges : badges ? [badges] : badge ? [badge] : []
  )
    .map((b) => String(b).trim())
    .filter(Boolean);
  const badgeNodes =
    badgeList.length > 0 ? (
      <Group gap={6} wrap="wrap" className="aardvark-card-badges">
        {badgeList.map((b, i) => (
          <Badge
            key={i}
            variant={badgeVariant}
            color={badgeColor || accentColor}
            radius="sm"
            {...(badgeVariant === 'gradient' && gradient ? { gradient } : {})}
          >
            {b}
          </Badge>
        ))}
      </Group>
    ) : null;

  // The whole-card link lives on the title when there is one; otherwise a labelled overlay
  // anchor (rendered below) covers the card. Either way there is exactly one link.
  const extAffordance = ext ? (
    <>
      <ExternalLinkGlyph />
      <span className="aardvark-visually-hidden"> (opens in a new tab)</span>
    </>
  ) : null;

  let titleNode = null;
  if (title) {
    titleNode = clickable ? (
      <Anchor
        href={safeHref}
        target={linkTarget}
        rel={linkRel}
        underline="never"
        className="aardvark-card-title aardvark-card-link"
      >
        {title}
        {extAffordance}
      </Anchor>
    ) : (
      <Text component="span" className="aardvark-card-title">
        {title}
      </Text>
    );
  }

  // Clickable but no title to host the link: a visually-hidden, full-card overlay anchor. The
  // accessible name describes the ACTION, so fall back through subtitle → cta → "Open" — never
  // the image `alt` (that describes the picture, not where the link goes).
  const overlayLabel =
    [subtitle, typeof cta === 'string' ? cta : null, 'Open'].find((t) => t && String(t).trim()) ||
    'Open';
  const overlayLink =
    clickable && !title ? (
      <Anchor
        href={safeHref}
        target={linkTarget}
        rel={linkRel}
        underline="never"
        className="aardvark-card-link aardvark-card-overlaylink"
        aria-label={ext ? `${overlayLabel} (opens in a new tab)` : overlayLabel}
      />
    ) : null;

  const subtitleNode = subtitle ? (
    <Text component="span" className="aardvark-card-subtitle">
      {subtitle}
    </Text>
  ) : null;

  // The CTA is a non-interactive visual cue — the card's single link (title/overlay) drives
  // navigation, so a second <a>/<button> here would duplicate it in the a11y tree. The button
  // form is a real Mantine Button rendered as a <span> (component="span"): it gets every Button
  // variant via `buttonVariant` (filled/light/outline/subtle/white/gradient/…) and reacts on
  // hover, without becoming a second focusable control. Default: a readable `white` on a
  // photo/colored surface, else a subtle `light`.
  const resolvedButtonVariant = buttonVariant || (lightText ? 'white' : 'light');
  // When there's a button CTA, the hover feedback moves to the button: the card doesn't lift or
  // sheen on hover; the button lifts on its own hover and fires the card sheen (see the CSS).
  const hasCtaButton = Boolean(cta) && ctaVariant === 'button';
  const ctaNode = cta
    ? ctaVariant === 'button'
      ? (
        <Button
          component="span"
          className="aardvark-card-cta-btn"
          variant={resolvedButtonVariant}
          color={accentColor}
          size="sm"
          radius="md"
          // A decorative MOUSE affordance, never a second link. Rendering it as a plain <span>
          // (not a polymorphic <a>) keeps the card to exactly ONE link in the a11y tree — the
          // title/overlay link — and avoids `aria-hidden` on a focusable element (ARIA 1.2 §6.6.7),
          // which JAWS/NVDA still surface in their links list. It sits at z-index 2 ABOVE the
          // stretched-link ::after overlay (CSS) so it still receives :hover (lift + card sheen) —
          // which also means it would swallow the overlay's click, so on click it forwards to the
          // card's real link. `aria-hidden` is valid here (a <span> isn't focusable) and hides this
          // duplicate visual cue from AT, which reaches the destination via the title/overlay link.
          aria-hidden="true"
          onClick={
            clickable
              ? (e) => {
                  const link = e.currentTarget
                    .closest('[data-aardvark-card]')
                    ?.querySelector('a.aardvark-card-link');
                  if (link) link.click();
                }
              : undefined
          }
          {...(resolvedButtonVariant === 'gradient' && gradient ? { gradient } : {})}
        >
          {cta}
        </Button>
      )
      : (
        <span className="aardvark-card-cta-link">
          {cta}{' '}
          <span aria-hidden="true" className="aardvark-card-cta-arrow">
            →
          </span>
        </span>
      )
    : null;

  // A `watermark` card shows its icon once, oversized and translucent, as a design motif (for the
  // gradient/image surfaces). Only the lazily-loaded Tabler form is supported as a watermark; the
  // normal small inline icon is then suppressed so the glyph isn't shown twice. The watermark layer
  // sits behind the content (z-index in the CSS) — purely decorative, so aria-hidden.
  const watermarkName =
    watermark && typeof icon === 'string' && classifyIcon(icon.trim()) === 'tabler'
      ? icon.trim()
      : null;
  const headerIcon = watermarkName ? null : iconNode;

  const header =
    headerIcon || titleNode || subtitleNode || badgeNodes ? (
      <div className="aardvark-card-header">
        {headerIcon}
        {(titleNode || subtitleNode) && (
          <div className="aardvark-card-heading">
            {titleNode}
            {subtitleNode}
          </div>
        )}
        {badgeNodes}
      </div>
    ) : null;

  const inner = (
    <div className="aardvark-card-body">
      {overlayLink}
      {header}
      {children && <div className="aardvark-card-content">{children}</div>}
      {ctaNode && <div className="aardvark-card-footer">{ctaNode}</div>}
    </div>
  );

  const cardStyle = {
    // `!= null` not `||` so an author's `minHeight=0` (to cancel the variant="image" 220px floor)
    // isn't dropped as falsy.
    minHeight: minHeight != null ? minHeight : undefined,
    ...(isGradient ? { backgroundImage: buildGradientCss(gradient) } : null),
    ...(accentColor ? { '--aardvark-card-accent': colorToken(accentColor) } : null),
  };

  const cardEl = (
    <MantineCard
      ref={ref}
      // Spread author props FIRST so the island's own structural/state props below always win:
      // a stray attribute must never override the data-* attributes the CSS keys off (variant,
      // state) or the resolved shadow/padding/style.
      {...rest}
      data-aardvark-card=""
      data-variant={variant}
      data-clickable={clickable ? '' : undefined}
      data-align={align}
      data-light-text={lightText ? '' : undefined}
      data-accent-bar={accentBar || undefined}
      data-cta-button={hasCtaButton ? '' : undefined}
      data-watermark={watermarkName ? '' : undefined}
      shadow={resolvedShadow}
      radius={radius}
      withBorder={resolvedWithBorder}
      padding={imageBg ? 0 : padding}
      style={cardStyle}
    >
      {safeImage && !isImage && (
        <MantineCard.Section className="aardvark-card-media">
          <Image src={safeImage} alt={alt} height={imageHeight} fit="cover" className="aardvark-card-img" />
        </MantineCard.Section>
      )}

      {imageBg ? (
        <BackgroundImage src={safeImage} radius={radius} className="aardvark-card-bg">
          <span className="aardvark-card-scrim" aria-hidden="true" />
          <Box p={padding} className="aardvark-card-bg-inner">
            {inner}
          </Box>
        </BackgroundImage>
      ) : (
        inner
      )}

      {/* Watermark + sheen are LAST (not first): both are position:absolute + z-index, so DOM
          order doesn't change what they cover, but rendering before a cover-image MantineCard.Section
          would make that section no longer the Card's :first-child and lose its flush-to-top
          negative margin (a gap above the image). The watermark sits behind the content via its
          z-index (CSS); the content is lifted above it for [data-watermark] cards. */}
      {watermarkName && (
        <LazyTablerIcon
          name={watermarkName}
          iconCdn={iconCdn}
          style={iconStyle === 'filled' ? 'filled' : 'outline'}
          className="aardvark-card-watermark"
        />
      )}
      {showSheen && <span className="aardvark-card-sheen" aria-hidden="true" />}
    </MantineCard>
  );

  // Outbound link cards: a styled Mantine tooltip with the destination domain on hover/focus, so
  // readers see they're leaving the site (replaces the plain native title=). The card forwards its
  // ref, which Tooltip merges with its own. Internal/non-link cards render the card bare.
  return ext && extDomain ? (
    <Tooltip
      label={extDomain}
      position="top"
      withArrow
      openDelay={350}
      offset={6}
      events={{ hover: true, focus: true, touch: false }}
    >
      {cardEl}
    </Tooltip>
  ) : (
    cardEl
  );
});

export default Card;

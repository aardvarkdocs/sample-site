import { forwardRef, useEffect, useRef, useState } from 'react';
import { useMergedRef } from '@mantine/hooks';
import { Image, Modal, Tooltip } from '@mantine/core';

// The island behind the built-in {% image %} tag (image.md) and the auto-upgrade of
// standalone Markdown images (the theme's `image` Markdown hook, hooks/image.md). It wraps
// Mantine's Image with the two things Mantine's Image lacks on its own: a no-upscale
// default width and a click-to-zoom lightbox.
//
// Sizing: Mantine's Image bakes `width: 100%`, which would stretch a small
// screenshot to the full column. We default `w="auto"` + `maw="100%"` instead, so
// an image renders at its natural size but never wider than the content column.
// `size` (e.g. '50%') sets an explicit width — a percentage of the content column;
// height stays auto so the aspect ratio is preserved. Both are plain Mantine
// props placed before {...rest}, so an author can still override them with raw
// `w`/`maw` via the tag.
//
// Zoom: clicking opens a centered Mantine Modal over a dimmed, slightly blurred
// backdrop (a classic lightbox), showing the full image with fit="contain" capped
// to the viewport. The dialog is labeled by the image's alt text and carries a close
// button; backdrop-click or Esc also close it. Zoom is offered ONLY when the image
// is actually being shown smaller than its natural size — an image already at full
// size has nothing more to reveal, so it isn't clickable. That's measured on the
// client (image load + a ResizeObserver) so it stays correct as the column reflows.
// `zoom={false}` opts out entirely.
//
// Tooltip: a non-empty `tooltip` shows on hover/focus via Mantine's Tooltip. The
// auto-upgrade fills it with the Markdown title, or the alt text when there's no title
// (the `image` hook); the {% image %} tag fills it with `alt`. It wraps
// the <img> in place (Mantine clones the child + portals the bubble) so the layout below
// is untouched. Suppressed when it would only repeat a visible caption.
//
// Caption: a non-empty `caption` (the {% image %} tag's opt-in `caption`, never a Markdown
// image) wraps the image in a <figure> with a visible <figcaption> below it. The <figure>
// shrink-wraps the image (or takes `size`) so the caption's measure tracks the image width,
// and owns the left/center/right alignment via data-align (theme.css). No caption → a bare
// <img>, exactly as before.
//
// forwardRef so an optional `attr={...}` reaches the rendered <img> — mirrors the
// Callout.jsx / snippets convention.

// null-proto: an author-controlled `align` key can't resolve to an inherited Object.prototype member.
const ALIGN_MARGIN = { __proto__: null, center: '0 auto', right: '0 0 0 auto' };

const ZoomImage = forwardRef(function ZoomImage(
  { src, alt = '', tooltip, caption, size, zoom = true, align = 'left', fallbackSrc, style, ...rest },
  ref,
) {
  const [opened, setOpened] = useState(false);
  // Whether the image is currently rendered narrower than its natural width — the
  // only case where a lightbox shows anything more than what's already on the page.
  const [shrunk, setShrunk] = useState(false);
  const imgRef = useRef(null);

  // Merge our measuring ref with the forwarded ref (which carries `attr={...}`).
  // useMergedRef memoizes on the refs, so its identity stays stable and React doesn't cycle
  // the forwarded ref through null on every re-render (e.g. each setShrunk).
  const setImgRef = useMergedRef(imgRef, ref);

  useEffect(() => {
    if (!zoom) {
      setShrunk(false);
      return undefined;
    }
    const el = imgRef.current;
    // Clear any stale value from a previous src/size before re-measuring, so an image
    // that was zoomable doesn't briefly show the zoom cursor for a new, full-size one
    // while the async retry runs.
    setShrunk(false);
    if (!el) return undefined;
    let timer = 0;
    let tries = 0;
    const measure = () => {
      clearTimeout(timer);
      const natural = el.naturalWidth || 0;
      const displayed = el.getBoundingClientRect().width;
      if (natural > 0 && displayed > 0) {
        // Shrunk = shown narrower than the image really is, so a lightbox reveals more.
        setShrunk(displayed < natural - 0.5);
      } else if (tries++ < 20) {
        // Not ready yet: the image is still loading, or layout hasn't settled (e.g. an
        // SVG reflows to its intrinsic size only on load, and a backgrounded tab may not
        // have laid out). Retry briefly rather than concluding "full size" from a 0.
        // After this ~1s budget we stop polling; the 'load' listener and ResizeObserver
        // below still re-run measure(), so the only stuck case is an image in a hidden
        // container in a browser without ResizeObserver — it stays non-zoomable, an
        // acceptable fallback.
        timer = setTimeout(measure, 50);
      }
    };
    measure();
    el.addEventListener('load', measure);
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => {
      clearTimeout(timer);
      el.removeEventListener('load', measure);
      if (ro) ro.disconnect();
    };
  }, [zoom, src, size]);

  const interactive = zoom && shrunk;
  const open = () => setOpened(true);
  const margin = ALIGN_MARGIN[align];
  // A non-empty caption turns the image into a <figure>; the wrapper then owns sizing
  // and alignment so the <figcaption> spans the image's width, not the whole column.
  const captioned = caption != null && caption !== '';
  // Show the hover tooltip unless it would only echo a visible caption.
  const hasTooltip = tooltip != null && tooltip !== '' && tooltip !== caption;
  // The image's best human label, in priority order, for the zoom button + lightbox title:
  // a visible caption, else the tooltip (Markdown title / alt), else the bare alt.
  const label = caption || tooltip || alt;

  let image = (
    <Image
      // Captioned: fill the <figure> (which carries `size`/fit-content). Uncaptioned:
      // size the image itself, exactly as before.
      w={captioned ? (size ? '100%' : 'auto') : size ?? 'auto'}
      maw="100%"
      src={src}
      // If a visible caption repeats the alt verbatim, the <figcaption> below already IS
      // the image's text alternative — empty the img's alt so a screen reader doesn't
      // announce the same words twice. Otherwise keep the real alt: it's the description,
      // and the caption (when present) is a separate visible label. The lightbox's <Image>
      // keeps the full alt regardless (it has no caption beside it).
      alt={captioned && caption === alt ? '' : alt}
      fallbackSrc={fallbackSrc}
      {...rest}
      ref={setImgRef}
      onClick={interactive ? open : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
              }
            }
          : undefined
      }
      role={interactive ? 'button' : undefined}
      // Name the action for AT users (sighted users get the zoom-in cursor). Use `label`
      // — the same string the lightbox titles itself with (the Modal below) — so the
      // button and the dialog it opens announce one consistent name. Undefined when not
      // interactive, so a plain image keeps its own alt as its accessible name.
      aria-label={interactive ? (label ? `Zoom: ${label}` : 'Open full image') : undefined}
      tabIndex={interactive ? 0 : undefined}
      style={{
        // Uncaptioned images carry their own alignment margin; a captioned image lets
        // its <figure> handle alignment instead (see the figure's data-align in CSS).
        ...(!captioned && margin ? { display: 'block', margin } : null),
        ...(interactive ? { cursor: 'zoom-in' } : null),
        ...style,
      }}
    />
  );

  // The hover tooltip. Mantine clones the <img> to attach it and portals the bubble, so this
  // adds no DOM wrapper and leaves the <figure> sizing below intact. It opens on hover for
  // everyone; it also opens on keyboard focus ONLY when it adds something past the alt (a
  // Markdown title). When the tooltip is just the alt repeated, focus-opening it would make a
  // screen reader announce the alt twice (it's already the image's accessible name), so we
  // leave focus off there. Touch is off too — on a zoomable image a tap is the zoom gesture.
  if (hasTooltip) {
    image = (
      <Tooltip
        label={tooltip}
        withArrow
        multiline
        maw={300}
        events={{ hover: true, focus: tooltip !== alt, touch: false }}
      >
        {image}
      </Tooltip>
    );
  }

  return (
    <>
      {captioned ? (
        <figure
          className="aardvark-figure"
          // Only center/right have a CSS rule (margin-inline); left is the default block
          // layout, so omit the attribute there rather than emit a no-op data-align="left".
          data-align={align !== 'left' ? align : undefined}
          style={{ width: size ?? 'fit-content', maxWidth: '100%' }}
        >
          {image}
          <figcaption className="aardvark-figcaption">{caption}</figcaption>
        </figure>
      ) : (
        image
      )}
      {/* Keep `|| opened`, don't simplify to `interactive &&`: `interactive` can flip
          to false mid-session — e.g. widen the window so the image is no longer scaled
          down, or a rapid shrink-then-widen (false→true→false) — which would unmount an
          open Modal and abort its close animation. `|| opened` keeps it mounted until the
          user actually dismisses it, regardless of how `interactive` flips. */}
      {(interactive || opened) && (
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title={label || 'Image'}
          centered
          size="auto"
          overlayProps={{ backgroundOpacity: 0.8, blur: 2 }}
          styles={{ body: { display: 'flex', lineHeight: 0 } }}
        >
          <Image src={src} alt={alt} fallbackSrc={fallbackSrc} fit="contain" mah="85vh" maw="90vw" />
        </Modal>
      )}
    </>
  );
});

export default ZoomImage;

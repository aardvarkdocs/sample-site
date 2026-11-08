/* @aardvark-island {"urlProps": ["images[].src"], "imageProps": ["images[].src"]} */
import { forwardRef, useState } from 'react';
import { Image, SimpleGrid, UnstyledButton } from '@mantine/core';
import { Lightbox as BitesLightbox } from '@mantine-bites/lightbox';
import './Lightbox.css';
import { sanitizeHref } from '@aardvark/islands/safe-href';

// The island behind the {% lightbox %} community tag
// (lightbox.md). It wraps @mantine-bites/lightbox
// (https://rilrom.github.io/mantine-bites/lightbox/ — MIT, by rilrom), a full-screen
// image lightbox built on Embla Carousel.
//
// The library's <Lightbox> is *controlled* (opened / onClose / images / initialSlide),
// so this island owns that state: it renders a responsive thumbnail grid, and clicking a
// thumbnail opens the lightbox at that image. `images` is an array of plain objects parsed
// in the macro from the `images` JSON param — each `{ src, alt }`. Image `src` values are
// sanitized (the same sanitizeHref the link-bearing islands use) so a malicious
// javascript:/data: URL can't ride the thumbnail or slide.
//
// `cols` controls the thumbnail grid width (default 3); every other prop ({...rest}) flows
// to the underlying <Lightbox>, and the forwarded ref (carrying an optional attr={…}) goes
// on the grid wrapper, the real DOM node authors would target.
//
// SSR note: the lightbox overlay is portalled and closed by default, so the baked HTML is
// just the thumbnail grid. Aardvark hydrates those thumbnails in place; the overlay opens on
// the client after interaction.

const Lightbox = forwardRef(function Lightbox(
  { images = [], cols = 3, children, ...rest },
  ref,
) {
  const [opened, setOpened] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  // Drop any image whose src can't be made safe, so the lightbox and thumbnails agree on the
  // same trusted list (indices line up).
  const safeImages = images
    .map((img) => {
      const src = img && img.src ? sanitizeHref(img.src) : undefined;
      return src ? { src, alt: (img && img.alt) || '' } : null;
    })
    .filter(Boolean);

  const open = (index) => {
    setInitialSlide(index);
    setOpened(true);
  };

  // Clamp the grid width to a positive integer: SimpleGrid renders a degenerate
  // (collapsed/empty) grid for cols <= 0 or a non-number, so fall back to the default 3.
  const gridCols = Number.isInteger(cols) && cols > 0 ? cols : 3;

  return (
    <div ref={ref} className="aardvark-lightbox" data-aardvark-lightbox="">
      <SimpleGrid cols={gridCols} spacing="sm">
        {safeImages.map((img, index) => (
          <UnstyledButton
            key={img.src}
            onClick={() => open(index)}
            className="aardvark-lightbox-thumb"
            aria-label={img.alt ? `Open ${img.alt}` : `Open image ${index + 1}`}
          >
            <Image src={img.src} alt={img.alt} radius="md" />
          </UnstyledButton>
        ))}
      </SimpleGrid>
      <BitesLightbox
        images={safeImages}
        opened={opened}
        onClose={() => setOpened(false)}
        initialSlide={initialSlide}
        {...rest}
      />
    </div>
  );
});

export default Lightbox;

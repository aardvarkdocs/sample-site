/* @aardvark-island {
  "urlProps": ["src", "poster", "fallbackSrc", "sources[].src"],
  "imageProps": ["poster"]
} */
import { forwardRef, useEffect, useState } from 'react';
import { Video as MantineVideo } from '@gfazioli/mantine-video';
import './Video.css';

// The island behind the built-in {% video %} tag (video.md).
// It wraps @gfazioli/mantine-video's <Video> — a Mantine-native video player built on the
// native <video> element, with Picture-in-Picture, a scrubbable timeline, keyboard
// shortcuts, captions, and a fullscreen control.
//
// A **Community Component**: a third-party Mantine extension (gfazioli) bundled as a
// built-in React/Mantine island bundled locally with its package. `src`, `poster`, `aspectRatio`, and the full
// prop surface ride the JSON props channel; `{...rest}` keeps the whole upstream API reachable.
//
// Client-only: the live player wires up DOM/media APIs (Picture-in-Picture, fullscreen,
// MediaSession) that only exist in a browser. Carrying the Community Component marker keeps this
// wrapper OUT of the build's SSR bundle, so the build bakes no player markup.
// The {% video %} tag supplies no children and leaves an empty placeholder; direct component
// calls can retain authored placeholder children.
// aardvark mounts the player client-side with createRoot. The mount flag below only governs
// the first client render, where the plain <video controls> stands in for one
// tick until the effect runs. Do not describe it as an SSR or no-JS fallback.

const Video = forwardRef(function Video(
  { src, sources, poster, aspectRatio, fallbackSrc, ...rest },
  ref,
) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // CSS aspect-ratio for the wrapper so the fallback box matches the live player's frame and the
  // layout doesn't jump when the live player takes over. aspectRatio may be a number (16/9) or a
  // string ("16 / 9"); both are valid CSS `aspect-ratio` values.
  const ratioStyle =
    aspectRatio != null ? { aspectRatio: String(aspectRatio).replace('/', ' / ') } : undefined;

  // The pre-mount stand-in: a plain native player using the same source(s) and poster, shown for
  // the first client render only. This native-player fallback is not baked by SSR.
  const fallbackSources = Array.isArray(sources) ? sources : null;
  const nativeFallback = (
    <video
      controls
      src={fallbackSources ? undefined : src}
      poster={poster || undefined}
      className="aardvark-video-fallback"
      style={ratioStyle}
    >
      {fallbackSources
        ? fallbackSources.map((s, i) =>
            s && s.src ? <source key={i} src={s.src} type={s.type || undefined} /> : null,
          )
        : null}
      {fallbackSrc ? <source src={fallbackSrc} /> : null}
      Your browser does not support the video element.
    </video>
  );

  return (
    <div ref={ref} data-aardvark-video="" className="aardvark-video" style={ratioStyle}>
      {mounted ? (
        <MantineVideo
          src={src}
          sources={sources}
          poster={poster}
          aspectRatio={aspectRatio}
          fallbackSrc={fallbackSrc}
          {...rest}
        />
      ) : (
        nativeFallback
      )}
    </div>
  );
});

export default Video;

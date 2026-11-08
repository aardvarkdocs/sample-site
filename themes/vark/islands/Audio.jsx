/* @aardvark-island {"urlProps": ["src", "fallbackSrc", "sources[].src"]} */
import { forwardRef, useEffect, useState } from 'react';
import { Audio as MantineAudio } from '@gfazioli/mantine-audio';
import './Audio.css';

// The island behind the built-in {% audio %} tag (audio.md).
// It wraps @gfazioli/mantine-audio's <Audio> — a Mantine-native audio player with a
// waveform visualization and a live spectrum analyzer, built on the Web Audio API.
//
// A **Community Component**: a third-party Mantine extension (gfazioli) bundled as a
// built-in. This React/Mantine component is bundled locally into the islands bundle like every
// other built-in. Its `src` and the full prop surface ride the JSON props channel; `{...rest}`
// keeps the whole upstream API reachable from the tag.
//
// Client-only, with a first-paint fallback: the live player drives the Web Audio API
// (AudioContext, AnalyserNode), which exists only in a browser, so a mount flag renders a plain,
// fully-functional <audio controls> until an effect flips it to the live player on the client.
// aardvark renders the island with createRoot rather than hydrating, so the swap reconciles
// nothing and cannot mismatch.
//
// That fallback is NOT what a reader without JavaScript gets. The marker in the paragraph above
// keeps this island out of the build's SSR bundle entirely, so the
// build bakes an empty <div> — the prerender does not run this component at all. The <audio>
// element therefore exists only in a browser, for the one render before `mounted` turns true.

const Audio = forwardRef(function Audio({ src, sources, fallbackSrc, ...rest }, ref) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // The native-element fallback: a real, working player for the first client paint (see above —
  // the island is SSR-excluded, so this is not what a no-JS reader gets). It uses the same
  // source(s) the live player would, so nothing is lost across the swap.
  const fallbackSources = Array.isArray(sources) ? sources : null;
  const nativeFallback = (
    <audio
      controls
      src={fallbackSources ? undefined : src}
      className="aardvark-audio-fallback"
    >
      {fallbackSources
        ? fallbackSources.map((s, i) =>
            s && s.src ? <source key={i} src={s.src} type={s.type || undefined} /> : null,
          )
        : null}
      {fallbackSrc ? <source src={fallbackSrc} /> : null}
      Your browser does not support the audio element.
    </audio>
  );

  return (
    <div ref={ref} data-aardvark-audio="" className="aardvark-audio">
      {mounted ? (
        <MantineAudio src={src} sources={sources} fallbackSrc={fallbackSrc} {...rest} />
      ) : (
        nativeFallback
      )}
    </div>
  );
});

export default Audio;

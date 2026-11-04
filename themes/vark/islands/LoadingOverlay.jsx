import { forwardRef } from 'react';
import { Box, LoadingOverlay as MantineLoadingOverlay } from '@mantine/core';

// The island behind the built-in {% loadingoverlay %} tag (loadingoverlay.md).
// Mantine's <MantineLoadingOverlay> fills its nearest positioned ancestor, so on
// its own (with nothing positioned around it) it has no box to cover. This
// wrapper supplies that box: a `position: relative` <Box> holding the
// Markdown-rendered body, with the LoadingOverlay layered over it — exactly the
// documented usage, made visible inline on a static page.
//
// `visible` toggles the spinner+veil (default true so the doc demo shows it).
// `overlayProps`, `loaderProps`, `zIndex` and every other prop ({...rest}: transitionProps,
// Styles API, system props) ride the JSON props channel to Mantine's LoadingOverlay, so the
// full API is exposed — this builtin shadows Mantine's, so component('LoadingOverlay', …) has
// no other route to it. className/style/system props land on its root layer (spinner +
// veil), overlayProps on the veil, loaderProps on the spinner; the positioned Box takes only
// the ref (so `attr` covers the whole area). `children` is the covered content.
//
// SSR note: LoadingOverlay is a pure render, so the build-time prerender bakes
// exactly what the client produces; aardvark hydrates that markup in place.
const LoadingOverlay = forwardRef(function LoadingOverlay(
  { visible = true, overlayProps, loaderProps, zIndex, children, ...rest },
  ref,
) {
  const props = { ...rest };
  if (overlayProps) props.overlayProps = overlayProps;
  if (loaderProps) props.loaderProps = loaderProps;
  if (zIndex !== undefined && zIndex !== null) props.zIndex = zIndex;
  return (
    <Box ref={ref} pos="relative" p="xl" mih={120}>
      <MantineLoadingOverlay visible={visible} {...props} />
      {children}
    </Box>
  );
});

export default LoadingOverlay;

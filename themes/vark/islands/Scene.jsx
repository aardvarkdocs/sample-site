import { forwardRef } from 'react';
import { Scene as MantineScene } from '@gfazioli/mantine-scene';
import './Scene.css';

// The island behind the built-in {% scene %} tag
// (scene.md). A Community Component wrapping @gfazioli/mantine-scene — a decorative
// background that layers effects (gradients, glow blobs, dot grids, noise grain, …)
// behind its content.
//
// Mantine's Scene is a COMPOUND component: its effects are children
// (<Scene.Gradient/>, <Scene.Glow/>, <Scene.DotGrid/>, <Scene.Noise/>, …). A build-time
// macro can't construct React children, so the island takes a flat `layers` array — each
// entry is `{ kind: 'gradient' | 'glow' | 'dotGrid' | 'noise', ...props }` — and maps it
// to the matching Scene sub-component here. `kind` (not `type`) names the layer so a
// layer's own `type` prop (e.g. Gradient's radial/linear/conic) still rides through. The
// block body (`children`) is the foreground content rendered over the scene. Every base
// Scene prop (fullscreen, zIndex, interactive, reducedMotion, lazy, the Mantine style
// system, …) flows through via {...rest}.
//
// Authors needing effect types beyond the four mapped here (beams, globe, aurora, snow,
// …) can compose the package's sub-components in a React snippet. Python component()
// props are JSON-serializable; this tag exposes only the four mapped layer kinds.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).

// Map a layer `kind` to its Scene sub-component. Unknown kinds are dropped (the macro
// already restricts the set, but guard against a stray value reaching React).
const LAYER_COMPONENTS = {
  __proto__: null, // null-proto: an author-controlled layer `kind` can't resolve to an inherited Object.prototype member (which would defeat the !LayerComponent guard below)
  gradient: MantineScene.Gradient,
  glow: MantineScene.Glow,
  dotGrid: MantineScene.DotGrid,
  noise: MantineScene.Noise,
};

const Scene = forwardRef(function Scene({ layers, children, ...rest }, ref) {
  const layerNodes = Array.isArray(layers)
    ? layers
        .map((layer, i) => {
          if (!layer || typeof layer !== 'object') return null;
          const { kind, ...layerProps } = layer;
          const LayerComponent = LAYER_COMPONENTS[kind];
          if (!LayerComponent) return null;
          return <LayerComponent key={i} {...layerProps} />;
        })
        .filter(Boolean)
    : null;

  return (
    <MantineScene ref={ref} {...rest}>
      {layerNodes}
      {children}
    </MantineScene>
  );
});

export default Scene;

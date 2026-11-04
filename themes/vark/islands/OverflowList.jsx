import { forwardRef } from 'react';
import { OverflowList as MantineOverflowList, Badge, Tooltip } from '@mantine/core';

// The island behind the built-in {% overflowlist %} tag (overflowlist.md). Registered under the
// native name OverflowList — intentionally shadowing the raw Mantine export the way
// ActionIcon.jsx / Splitter.jsx do — so component('OverflowList') is this Badge-styled form. A
// flat build-time macro can't pass the render-prop functions Mantine's OverflowList needs
// (renderItem / renderOverflow), so this thin wrapper supplies them — a Badge per item and a
// "+N" counter (optionally tooltip-wrapped over the hidden labels) for the overflow — while
// DELEGATING the measure-and-fit to the native component.
//
// `items` is a plain array of label strings (parsed in the macro); variant/color/size style the
// badges, `gap` spaces them, `withTooltip` toggles the counter's hover tooltip. forwardRef carries
// an optional attr={...} to the OverflowList root (a factory component that forwards ref).
//
// SSR note: Mantine's OverflowList measures in a client-only effect. renderToString bakes
// its initial layout and aardvark hydrates the same state; responsive fitting starts after
// mount, so measurements must not affect the first client render.
const OverflowList = forwardRef(function OverflowList(
  { items = [], gap = 'xs', variant = 'light', color, size = 'md', withTooltip = true, ...rest },
  ref,
) {
  const list = (Array.isArray(items) ? items : []).map((it) => String(it));
  const renderItem = (label) => (
    <Badge variant={variant} color={color} size={size}>
      {label}
    </Badge>
  );
  const renderOverflow = (hidden) => {
    const counter = (
      <Badge variant={variant} color={color} size={size}>
        +{hidden.length}
      </Badge>
    );
    return withTooltip ? (
      <Tooltip label={hidden.join(', ')} withArrow>
        {counter}
      </Tooltip>
    ) : (
      counter
    );
  };
  return (
    <MantineOverflowList
      ref={ref}
      data={list}
      gap={gap}
      renderItem={renderItem}
      renderOverflow={renderOverflow}
      {...rest}
    />
  );
});

export default OverflowList;

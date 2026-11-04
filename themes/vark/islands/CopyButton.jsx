import { forwardRef } from 'react';
import { CopyButton as MantineCopyButton, Button, Tooltip } from '@mantine/core';
import './ActionIcon.css';

// The island behind the built-in {% copybutton %} tag (copybutton.md).
// Mantine's CopyButton is a RENDER-PROP component — children is a `({ copied, copy }) => node`
// function, which can't be authored from a build-time Markdown macro — so this island supplies a
// sensible default render: a Button (with a Tooltip) that copies `value` to the clipboard and swaps
// its label to a "copied" confirmation. `label` / `copiedLabel` customize the two states; the rest
// (variant / color / size / radius) style the Button.
//
// forwardRef so `attr={...}` reaches the rendered root DOM node.
const CopyButton = forwardRef(function CopyButton(
  { value = '', label = 'Copy', copiedLabel = 'Copied', timeout = 1500, variant, color, size, radius, ...rest },
  ref,
) {
  return (
    <MantineCopyButton value={value} timeout={timeout}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? copiedLabel : label} withArrow events={{ hover: true, focus: true, touch: true }}>
          <Button
            ref={ref}
            color={copied ? 'teal' : color}
            variant={variant}
            size={size}
            radius={radius}
            onClick={copy}
            {...rest}
          >
            {copied ? copiedLabel : label}
          </Button>
        </Tooltip>
      )}
    </MantineCopyButton>
  );
});

export default CopyButton;

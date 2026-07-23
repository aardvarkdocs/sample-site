import { forwardRef } from 'react';
import { Card, Code, Divider, Text } from '@mantine/core';

// A gallery cell: a title, a live preview of the component, and the
// instantiation code. The preview wrapper sets `transform` so that any
// force-open overlay rendered inside (Modal/Drawer/Overlay/Affix with
// withinPortal=false) is positioned relative to THIS card instead of the
// whole viewport — keeping the gallery usable.
//
// forwardRef so `attr={...}` reaches the root Card's DOM node (see Callout.jsx).
const DemoCard = forwardRef(function DemoCard({ title, code, children }, ref) {
  const hasPreview = children !== undefined && children !== null && children !== '';
  return (
    <Card ref={ref} withBorder radius="md" padding="md" mb="md">
      {title && (
        <Text fw={600} mb="xs">
          {title}
        </Text>
      )}
      {hasPreview && (
        <div
          style={{
            // Block flow (not flex) so block-level components — inputs, sliders,
            // progress — fill the card width instead of shrinking to content.
            // Inline components (buttons, badges) keep their natural size.
            position: 'relative',
            transform: 'translateZ(0)',
            minHeight: 72,
            padding: '12px 0',
          }}
        >
          {children}
        </div>
      )}
      {hasPreview && <Divider mb="sm" />}
      <Code block>{code}</Code>
    </Card>
  );
});

export default DemoCard;

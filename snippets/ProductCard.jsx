import { forwardRef } from 'react';
import { Card, Group, Badge, Button } from '@mantine/core';

// Demonstrates blending plain HTML (<div>, <h3>, <p>) with Mantine components
// (Card, Group, Badge, Button) inside a single custom snippet. forwardRef so
// `attr={...}` reaches the rendered root DOM node (see Callout.jsx/DemoCard.jsx).
const ProductCard = forwardRef(function ProductCard(
  { product, tagline, badge = 'New', href = '#' },
  ref,
) {
  return (
    <Card ref={ref} withBorder radius="md" padding="lg" maw={360}>
      <Group justify="space-between" align="flex-start" mb="md">
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{product}</h3>
          <p style={{ margin: '4px 0 0', color: 'var(--mantine-color-dimmed)' }}>{tagline}</p>
        </div>
        <Badge color="primary">{badge}</Badge>
      </Group>
      <Button component="a" href={href} fullWidth>
        Learn more
      </Button>
    </Card>
  );
});

export default ProductCard;

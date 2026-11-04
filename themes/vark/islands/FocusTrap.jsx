import { forwardRef } from 'react';
import { FocusTrap as MantineFocusTrap } from '@mantine/core';
import { useMergedRef } from '@mantine/hooks';

// Mantine FocusTrap is not forwardRef-based; it exposes `innerRef`. Aardvark's
// attr channel writes through a forwarded ref, so bridge that ref to the trapped
// child element while preserving an explicit innerRef if one is ever supplied.
const FocusTrap = forwardRef(function FocusTrap({ innerRef, ...props }, ref) {
  const mergedRef = useMergedRef(ref, innerRef);

  return <MantineFocusTrap {...props} innerRef={mergedRef} />;
});

FocusTrap.InitialFocus = MantineFocusTrap.InitialFocus;

export default FocusTrap;

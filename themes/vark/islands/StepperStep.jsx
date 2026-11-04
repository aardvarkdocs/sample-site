import { forwardRef } from 'react';

// Data carrier for one item of a Markdown ordered list that Aardvark auto-converts
// to Steps (the Markdown renderer's list-item rule). Like TabsTab, it
// never renders as itself: the parent Stepper reads each carrier's `number`
// prop (markdown-it's display ordinal) and its children (the Markdown-rendered <li>
// body) and builds the real Mantine Timeline.Item from them. The static `isStepItem`
// marker is how Stepper picks carriers out of its children.
//
// It still renders its children (rather than null) as defense-in-depth: a stray
// carrier rendered directly shows its body inertly instead of vanishing. forwardRef
// keeps an optional attr={...} viable, mirroring the TabsTab/Callout convention.
const StepperStep = forwardRef(function StepperStep({ children }, ref) {
  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {children}
    </div>
  );
});

StepperStep.isStepItem = true;

export default StepperStep;

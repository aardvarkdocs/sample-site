import { forwardRef } from 'react';

// Data carrier for the built-in {% tab %} block. It never renders as
// itself: the parent Tabs reads each carrier's props (value, label,
// color, disabled, …) and its children (the Markdown-rendered panel body) and
// builds the real Mantine Tabs.Tab / Tabs.Panel structure from them. The static
// `isTabItem` marker is how Tabs picks carriers out of its children.
//
// It still renders its children (rather than null) as defense-in-depth: if a
// carrier is ever rendered directly — a stray {% tab %} outside {% tabs %}, or a
// future refactor — the panel body shows inertly instead of vanishing. forwardRef
// keeps an optional attr={...} viable, mirroring the Callout/ZoomImage convention.
const TabsTab = forwardRef(function TabsTab({ children }, ref) {
  return (
    <div ref={ref} style={{ display: 'contents' }}>
      {children}
    </div>
  );
});

TabsTab.isTabItem = true;

export default TabsTab;

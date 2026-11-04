import { forwardRef } from 'react';
import { Alert } from '@mantine/core';
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconAlertOctagon,
} from '@tabler/icons-react';

// The island behind the built-in {% callout %} tag (callout.md). The icon must
// be a React node, which can't ride the JSON props channel of
// component('Alert', ...), so the severity -> {color, icon} mapping lives here
// rather than in the .md wrapper.
//
// `info` leaves color undefined so the Alert uses the theme's primaryColor (the
// `primary` color on a themed site, Mantine's blue otherwise). Unknown severities
// fall back to info. `variant="light"` gives a tinted box + colored title, both
// derived from color-scheme-aware Mantine CSS variables, so it reads correctly in
// light and dark mode; the Tabler icons inherit the same color via currentColor.
const SEVERITIES = {
  __proto__: null, // null-proto: an author-controlled `severity` key can't resolve to an inherited Object.prototype member
  success: { color: 'green', Icon: IconCircleCheck },
  info: { color: undefined, Icon: IconInfoCircle },
  caution: { color: 'yellow', Icon: IconAlertTriangle },
  warning: { color: 'red', Icon: IconAlertOctagon },
};

// forwardRef so `attr={...}` reaches the rendered root DOM node — Mantine's Alert
// forwards the ref to its own root. Mirrors the snippets/*.jsx convention.
const Callout = forwardRef(function Callout({ severity = 'info', title, children }, ref) {
  const { color, Icon } = SEVERITIES[severity] || SEVERITIES.info;
  return (
    <Alert
      ref={ref}
      variant="light"
      color={color}
      title={title || undefined}
      icon={<Icon size={20} />}
    >
      {children}
    </Alert>
  );
});

export default Callout;

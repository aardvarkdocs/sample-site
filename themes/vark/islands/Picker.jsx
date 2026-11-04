import { forwardRef, useState } from 'react';
import { Picker as CommunityPicker } from '@gfazioli/mantine-picker';
import './Picker.css';

// The island behind the built-in {% picker %} tag (picker.md).
// It registers under the native name `Picker` (no collision with a Mantine-core or other
// builtin export) and wraps the community @gfazioli/mantine-picker — an animated, iOS-style
// scroll/wheel picker (color/date/emoji/number/etc.). A **Community Component**.
//
// The package's Picker is controlled-or-uncontrolled over a `data` array, but island props are
// JSON parsed once at mount and can't carry `onChange` (a function). A `value` passed through
// as-is would be controlled with nothing to update it, so the wheel would snap back to it after
// every drag or key press. So this thin wrapper owns the selection state on the client: useState
// seeded from `value`, else `defaultValue`, else the first item — `value` seeds, it does not pin
// (as the picker docs page says). Every other prop (animate, loop, itemHeight, visibleItems,
// withHighlight, withDividers, size, the Mantine style system, …) flows straight through via
// {...rest}.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
const Picker = forwardRef(function Picker(
  { data, defaultValue, value: valueProp, children, ...rest },
  ref,
) {
  const items = Array.isArray(data) ? data : [];
  const seed = valueProp !== undefined ? valueProp : defaultValue;
  const [value, setValue] = useState(seed !== undefined ? seed : items[0]);
  return (
    <div className="aardvark-picker-host">
      <CommunityPicker
        ref={ref}
        data={items}
        value={value}
        onChange={setValue}
        {...rest}
      />
    </div>
  );
});

export default Picker;

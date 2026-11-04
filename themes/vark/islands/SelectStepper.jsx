import { forwardRef, useState } from 'react';
import { SelectStepper as GfazioliSelectStepper } from '@gfazioli/mantine-select-stepper';
import './SelectStepper.css';

// The island behind the built-in {% selectstepper %} tag (selectstepper.md). A
// Community Component wrapping @gfazioli/mantine-select-stepper's <SelectStepper> — an
// option-cycling stepper (prev/next arrows step through a list of choices). It's an
// interactive, stateful control, so this island owns the controlled value: the macro hands a
// JSON `data` array (string[] or {value,label}[]) plus an optional `defaultValue`, and the
// local useState makes the prev/next buttons actually move.
//
// Client-only, by its Community Component marker: ../components/README.md (The React components).
//
// forwardRef so `attr={…}` reaches the rendered root DOM node; everything else (label,
// description, orientation, size, variant, loop, animate, …) flows through via {...rest}.
const SelectStepper = forwardRef(function SelectStepper(
  { data = [], defaultValue, ...rest },
  ref,
) {
  // Seed the controlled value from defaultValue, else the first option, so the stepper has a
  // current selection to step away from. ComboboxItem entries carry their value under `.value`;
  // bare strings are their own value.
  const firstValue = data.length
    ? typeof data[0] === 'string'
      ? data[0]
      : data[0] && data[0].value
    : null;
  const [value, setValue] = useState(defaultValue != null ? defaultValue : firstValue);
  return (
    <GfazioliSelectStepper
      ref={ref}
      data={data}
      value={value}
      onChange={setValue}
      {...rest}
    />
  );
});

export default SelectStepper;

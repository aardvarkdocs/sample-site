import { forwardRef, useState } from 'react';
import { Combobox as MantineCombobox, InputBase, Input, useCombobox } from '@mantine/core';

// The island behind the built-in {% combobox %} tag (combobox.md). Combobox is a
// LOW-LEVEL primitive: on its own it needs a `store` from useCombobox() (a React hook),
// which a build-time macro cannot supply — a bare component('Combobox', ...) would
// render without a store and throw. So the tag renders this small, self-contained
// working example instead: a button-trigger single-select built from the Combobox
// primitives (the same shape the docs walk through), so authors see the primitive
// actually working rather than a dead container. For a ready-made interactive field,
// the doc page points at {% select %} / {% multiselect %}.
//
// `data` is the option list parsed in the macro (strings or {value,label}); `placeholder`
// is the empty-state label. Everything else a real Combobox composition would expose
// (filtering, search, multi-value) is intentionally out of scope here — this is a
// demonstration of the primitive, not a configurable widget.
const Combobox = forwardRef(function Combobox(
  { data = [], placeholder = 'Pick a value' },
  ref
) {
  const options = data.map((item) =>
    typeof item === 'string' ? { value: item, label: item } : item
  );
  const [value, setValue] = useState(null);
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const selected = options.find((o) => o.value === value);

  return (
    // Mantine's <MantineCombobox> is a context provider (a plain function component) with no DOM root,
    // so the forwarded ref (carrying attr={...}) goes on the InputBase trigger — the real
    // focusable node an author would target — not here. Mirrors Menu / Popover.
    <MantineCombobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <MantineCombobox.Target targetType="button">
        <InputBase
          ref={ref}
          component="button"
          type="button"
          pointer
          rightSection={<MantineCombobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {selected ? (
            selected.label
          ) : (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </MantineCombobox.Target>

      <MantineCombobox.Dropdown>
        <MantineCombobox.Options>
          {options.length > 0 ? (
            options.map((item, i) => (
              <MantineCombobox.Option
                value={item.value}
                // Composite key: two options can share a `value` string, and `value ?? i` would
                // still collide on duplicates — append the index so keys stay unique.
                key={`${item.value}-${i}`}
                active={item.value === value}
              >
                {item.label}
              </MantineCombobox.Option>
            ))
          ) : (
            <MantineCombobox.Empty>No options</MantineCombobox.Empty>
          )}
        </MantineCombobox.Options>
      </MantineCombobox.Dropdown>
    </MantineCombobox>
  );
});

export default Combobox;

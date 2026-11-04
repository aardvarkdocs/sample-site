import { forwardRef } from 'react';
import { HueSlider as MantineHueSlider } from '@mantine/core';
import { useNativeChangeRef, useStatefulNativeChange } from './_nativeChange';

// Mantine's color HueSlider is controlled-only: it exposes value/onChange but no
// defaultValue. The Aardvark macro is deliberately author-friendly, so this wrapper
// owns the uncontrolled state and emits a native change event for attr={onchange: ...}.
const HueSlider = forwardRef(function HueSlider(
  { defaultValue, value, onChange, onChangeEnd, ...rest },
  ref,
) {
  const [setRootRef, dispatchChange] = useNativeChangeRef(ref);
  const { currentValue, handleChange, handleChangeEnd } = useStatefulNativeChange({
    defaultValue: defaultValue === undefined ? 0 : Number(defaultValue),
    value,
    onChange,
    onChangeEnd,
    dispatchChange,
  });

  return (
    <MantineHueSlider
      {...rest}
      ref={setRootRef}
      value={currentValue}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}
    />
  );
});

export default HueSlider;

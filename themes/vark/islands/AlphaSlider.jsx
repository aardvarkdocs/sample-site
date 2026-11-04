import { forwardRef } from 'react';
import { AlphaSlider as MantineAlphaSlider } from '@mantine/core';
import { useNativeChangeRef, useStatefulNativeChange } from './_nativeChange';

// Mantine's color AlphaSlider is controlled-only: it exposes value/onChange but no
// defaultValue. The Aardvark macro is deliberately author-friendly, so this wrapper
// owns the uncontrolled state and emits a native change event for attr={onchange: ...}.
const AlphaSlider = forwardRef(function AlphaSlider(
  { defaultValue, value, onChange, onChangeEnd, ...rest },
  ref,
) {
  const [setRootRef, dispatchChange] = useNativeChangeRef(ref);
  const { currentValue, handleChange, handleChangeEnd } = useStatefulNativeChange({
    defaultValue: defaultValue === undefined ? 1 : Number(defaultValue),
    value,
    onChange,
    onChangeEnd,
    dispatchChange,
  });

  return (
    <MantineAlphaSlider
      {...rest}
      ref={setRootRef}
      value={currentValue}
      onChange={handleChange}
      onChangeEnd={handleChangeEnd}
    />
  );
});

export default AlphaSlider;

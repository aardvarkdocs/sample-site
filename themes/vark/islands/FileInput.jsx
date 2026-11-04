import { forwardRef, useCallback } from 'react';
import { FileInput as MantineFileInput } from '@mantine/core';
import { scheduleNativeChange, useNativeChangeRef } from './_nativeChange';

function filesFromValue(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function fileValue(value) {
  return filesFromValue(value)
    .map((file) => file?.path || file?.name || 'file')
    .filter(Boolean)
    .join(', ');
}

const FileInput = forwardRef(function FileInput({ onChange, ...rest }, ref) {
  const [setRootRef, , rootRef] = useNativeChangeRef(ref);

  const handleChange = useCallback((value) => {
    onChange?.(value);
    scheduleNativeChange(rootRef.current, fileValue(value), { files: filesFromValue(value) });
  }, [onChange, rootRef]);

  return <MantineFileInput {...rest} ref={setRootRef} onChange={handleChange} />;
});

export default FileInput;

import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Dropzone as MantineDropzone } from '@mantine/dropzone';
import { scheduleNativeChange, useNativeChangeRef } from './_nativeChange';
import './Dropzone.css';

function filesFromRejections(rejections) {
  return (rejections || []).map((item) => item && item.file).filter(Boolean);
}

function fileNames(files) {
  return (files || []).map((file) => file?.path || file?.name || 'file').filter(Boolean);
}

function formatValue(files) {
  return fileNames(files).join(', ');
}

function formatSummary(files) {
  const names = fileNames(files);
  if (names.length <= 3) return names.join(', ');
  return `${names.slice(0, 3).join(', ')} and ${names.length - 3} more`;
}

function normalizeMod(mod) {
  if (Array.isArray(mod)) return mod.filter(Boolean);
  return mod ? [mod] : [];
}

function SelectionSummary({ selection }) {
  if (!selection || selection.files.length === 0) return null;
  const count = selection.files.length;
  const label = selection.status === 'rejected' ? 'Rejected' : 'Selected';
  const plural = count === 1 ? 'file' : 'files';

  return (
    <div
      className="aardvark-Dropzone-status"
      data-status={selection.status}
      aria-live="polite"
    >
      {label} {count} {plural}: {formatSummary(selection.files)}
    </div>
  );
}

const Dropzone = forwardRef(function Dropzone(
  { children, onDropAny, onDrop, onReject, ...rest },
  ref,
) {
  const [setRootRef, , rootRef] = useNativeChangeRef(ref);
  const [selection, setSelection] = useState(null);

  const dispatchFiles = useCallback((files) => {
    scheduleNativeChange(rootRef.current, formatValue(files), { files });
  }, [rootRef]);

  const handleDropAny = useCallback((files = [], fileRejections = []) => {
    onDropAny?.(files, fileRejections);
    if (files.length) {
      setSelection({ status: 'accepted', files });
      dispatchFiles(files);
      return;
    }

    const rejected = filesFromRejections(fileRejections);
    if (rejected.length) {
      setSelection({ status: 'rejected', files: rejected });
      dispatchFiles(rejected);
    }
  }, [dispatchFiles, onDropAny]);

  const handleDrop = useCallback((files) => {
    onDrop?.(files);
  }, [onDrop]);

  const handleReject = useCallback((fileRejections) => {
    onReject?.(fileRejections);
  }, [onReject]);

  const mod = useMemo(() => {
    if (!selection) return rest.mod;
    return [
      { selected: selection.status === 'accepted', rejected: selection.status === 'rejected' },
      ...normalizeMod(rest.mod),
    ];
  }, [rest.mod, selection]);

  return (
    <MantineDropzone
      {...rest}
      ref={setRootRef}
      data-aardvark-dropzone-status={selection?.status}
      mod={mod}
      onDropAny={handleDropAny}
      onDrop={handleDrop}
      onReject={handleReject}
    >
      {children}
      <SelectionSummary selection={selection} />
    </MantineDropzone>
  );
});

export default Dropzone;

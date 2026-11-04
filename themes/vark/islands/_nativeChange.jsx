import { forwardRef, useCallback, useRef, useState } from 'react';
import { useMergedRef } from '@mantine/hooks';

function formatNativeValue(value) {
  if (Array.isArray(value)) return value.join(' - ');
  if (value === null || value === undefined) return '';
  return String(value);
}

function sliderRoleNodes(node) {
  const own = node.getAttribute?.('role') === 'slider' ? [node] : [];
  const nested = node.querySelectorAll ? Array.from(node.querySelectorAll('[role="slider"]')) : [];
  return [...own, ...nested.filter((target) => target !== node)];
}

export function emitNativeChange(node, value, details) {
  if (!node) return;
  const formatted = formatNativeValue(value);
  node.value = formatted;
  if (details && Object.prototype.hasOwnProperty.call(details, 'files')) {
    node.files = details.files;
  }
  if (node.dataset) node.dataset.aardvarkValue = formatted;
  const sliders = sliderRoleNodes(node);
  sliders.forEach((slider, index) => {
    const ariaValue = Array.isArray(value) && sliders.length > 1 ? value[index] : formatted;
    slider.setAttribute('aria-valuenow', formatNativeValue(ariaValue));
  });
  node.dispatchEvent(new Event('change', { bubbles: true }));
}

export function scheduleNativeChange(node, value, details) {
  const emit = () => emitNativeChange(node, value, details);
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(emit);
  else setTimeout(emit, 0);
}

export function useNativeChangeRef(forwardedRef) {
  const rootRef = useRef(null);
  const setRootRef = useMergedRef(rootRef, forwardedRef);
  const dispatchChange = useCallback((value) => {
    scheduleNativeChange(rootRef.current, value);
  }, []);

  return [setRootRef, dispatchChange, rootRef];
}

export function useNativeChangeEnd(onChangeEnd, dispatchChange) {
  return useCallback((value) => {
    onChangeEnd?.(value);
    dispatchChange(value);
  }, [dispatchChange, onChangeEnd]);
}

export function useNativeChange(onChange, dispatchChange) {
  return useCallback((value) => {
    onChange?.(value);
    dispatchChange(value);
  }, [dispatchChange, onChange]);
}

const ROOT_STYLE = { display: 'contents' };

export function createNativeChangeComponent(MantineComponent, displayName) {
  const NativeChangeComponent = forwardRef(function NativeChangeComponent(
    { onChange, ...rest },
    ref,
  ) {
    const [setRootRef, dispatchChange] = useNativeChangeRef(ref);
    const handleChange = useNativeChange(onChange, dispatchChange);

    return (
      <div ref={setRootRef} style={ROOT_STYLE}>
        <MantineComponent {...rest} onChange={handleChange} />
      </div>
    );
  });

  NativeChangeComponent.displayName = displayName;
  return NativeChangeComponent;
}

export function createNativeChangeEndComponent(MantineComponent, displayName) {
  const NativeChangeEndComponent = forwardRef(function NativeChangeEndComponent(
    { onChangeEnd, ...rest },
    ref,
  ) {
    const [setRootRef, dispatchChange] = useNativeChangeRef(ref);
    const handleChangeEnd = useNativeChangeEnd(onChangeEnd, dispatchChange);

    return <MantineComponent {...rest} ref={setRootRef} onChangeEnd={handleChangeEnd} />;
  });

  NativeChangeEndComponent.displayName = displayName;
  return NativeChangeEndComponent;
}

export function useStatefulNativeChange({
  defaultValue,
  value,
  onChange,
  onChangeEnd,
  dispatchChange,
}) {
  const controlled = value !== undefined && value !== null;
  const [current, setCurrent] = useState(defaultValue);
  const latestValueRef = useRef(controlled ? value : current);
  latestValueRef.current = controlled ? value : current;

  const handleChange = useCallback((next) => {
    latestValueRef.current = next;
    if (!controlled) setCurrent(next);
    onChange?.(next);
  }, [controlled, onChange]);

  const handleChangeEnd = useCallback((next) => {
    const committed = next ?? latestValueRef.current;
    latestValueRef.current = committed;
    if (!controlled) setCurrent(committed);
    onChangeEnd?.(committed);
    dispatchChange(committed);
  }, [controlled, dispatchChange, onChangeEnd]);

  return {
    currentValue: controlled ? value : current,
    handleChange,
    handleChangeEnd,
  };
}

import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { DateInput as MantineDateInput } from '@mantine/dates';
import { scheduleNativeChange, useNativeChangeRef } from './_nativeChange';
import './Dates.css';

const ROOT_STYLE = { display: 'contents' };

function mirrorTargetValue(root, target) {
  if (!root || !target || target === root || !('value' in target)) return;
  const next = target.value ?? '';
  root.value = next;
  if (root.dataset) root.dataset.aardvarkValue = next;
}

const DateInput = forwardRef(function DateInput(
  { defaultValue, getDayProps, onChange, value, ...rest },
  ref,
) {
  const [setRootRef, , rootRef] = useNativeChangeRef(ref);
  const calendarCommitRef = useRef(false);
  const calendarCommitTimerRef = useRef(null);

  const clearCalendarCommit = useCallback(() => {
    if (calendarCommitTimerRef.current !== null) {
      clearTimeout(calendarCommitTimerRef.current);
      calendarCommitTimerRef.current = null;
    }
    calendarCommitRef.current = false;
  }, []);

  useEffect(() => clearCalendarCommit, [clearCalendarCommit]);

  const markCalendarCommit = useCallback(() => {
    clearCalendarCommit();
    calendarCommitRef.current = true;
    calendarCommitTimerRef.current = setTimeout(() => {
      calendarCommitRef.current = false;
      calendarCommitTimerRef.current = null;
    }, 0);
  }, [clearCalendarCommit]);

  const commitValue = useCallback((next) => {
    scheduleNativeChange(rootRef.current, next);
  }, [rootRef]);

  const mirrorInputValue = useCallback((event) => {
    mirrorTargetValue(rootRef.current, event.target);
  }, [rootRef]);

  const handleChange = useCallback((next) => {
    onChange?.(next);
    const calendarCommit = calendarCommitRef.current;
    clearCalendarCommit();
    if (calendarCommit) commitValue(next);
  }, [clearCalendarCommit, commitValue, onChange]);

  const handleDayProps = useCallback((day) => {
    const dayProps = getDayProps?.(day) || {};
    const userOnClick = dayProps.onClick;
    return {
      ...dayProps,
      onClick: (event) => {
        markCalendarCommit();
        userOnClick?.(event);
      },
    };
  }, [getDayProps, markCalendarCommit]);

  return (
    <div
      ref={setRootRef}
      style={ROOT_STYLE}
      onInputCapture={mirrorInputValue}
      onChangeCapture={mirrorInputValue}
    >
      <MantineDateInput
        {...rest}
        defaultValue={defaultValue}
        getDayProps={handleDayProps}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
});

DateInput.displayName = 'DateInput';

export default DateInput;

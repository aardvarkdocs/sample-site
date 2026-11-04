import { forwardRef } from 'react';
import { TimeInput as MantineTimeInput } from '@mantine/dates';
import './Dates.css';

const TimeInput = forwardRef(function TimeInput({ onChange, ...rest }, ref) {
  return <MantineTimeInput {...rest} ref={ref} onChange={onChange} />;
});

export default TimeInput;

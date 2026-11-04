import { DateTimePicker as MantineDateTimePicker } from '@mantine/dates';
import { createNativeChangeComponent } from './_nativeChange';
import './Dates.css';

const DateTimePicker = createNativeChangeComponent(MantineDateTimePicker, 'DateTimePicker');

export default DateTimePicker;

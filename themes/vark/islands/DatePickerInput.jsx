import { DatePickerInput as MantineDatePickerInput } from '@mantine/dates';
import { createNativeChangeComponent } from './_nativeChange';
import './Dates.css';

const DatePickerInput = createNativeChangeComponent(MantineDatePickerInput, 'DatePickerInput');

export default DatePickerInput;

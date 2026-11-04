import { ColorPicker as MantineColorPicker } from '@mantine/core';
import { createNativeChangeEndComponent } from './_nativeChange';

const ColorPicker = createNativeChangeEndComponent(MantineColorPicker, 'ColorPicker');

export default ColorPicker;

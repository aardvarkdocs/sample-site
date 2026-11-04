import { RangeSlider as MantineRangeSlider } from '@mantine/core';
import { createNativeChangeEndComponent } from './_nativeChange';

const RangeSlider = createNativeChangeEndComponent(MantineRangeSlider, 'RangeSlider');

export default RangeSlider;

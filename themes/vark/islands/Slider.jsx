import { Slider as MantineSlider } from '@mantine/core';
import { createNativeChangeEndComponent } from './_nativeChange';

const Slider = createNativeChangeEndComponent(MantineSlider, 'Slider');

export default Slider;

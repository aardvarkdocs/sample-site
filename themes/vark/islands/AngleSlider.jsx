import { AngleSlider as MantineAngleSlider } from '@mantine/core';
import { createNativeChangeEndComponent } from './_nativeChange';

const AngleSlider = createNativeChangeEndComponent(MantineAngleSlider, 'AngleSlider');

export default AngleSlider;

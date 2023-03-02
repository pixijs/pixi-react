import { Container as PixiContainer } from '@pixi/display';
import type { ExpandoContainer } from '../types';

const Container = (): ExpandoContainer => new PixiContainer();

export default Container;

import { Container as PixiContainer } from '@pixi/display';
import type { PixiReactContainer } from '../types';

const Container = (): PixiReactContainer => new PixiContainer();

export default Container;

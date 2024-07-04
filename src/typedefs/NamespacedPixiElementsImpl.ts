import type { PixiElementsImpl } from './PixiElementsImpl.ts';

export type NamespacedPixiElementsImpl = {
    [K in keyof PixiElementsImpl as `pixi${Capitalize<string & K>}`]: PixiElementsImpl[K];
};

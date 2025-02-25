import { type UnprefixedPixiElements } from '@pixi/react';

declare module '@pixi/react'
{
    interface PixiElements extends UnprefixedPixiElements {}
}

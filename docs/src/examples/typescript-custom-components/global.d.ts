import { type Viewport } from 'pixi-viewport';
import { type PixiReactElementProps } from '@pixi/react';

declare module '@pixi/react'
{
    interface PixiElements
    {
        viewport: PixiReactElementProps<typeof Viewport>;
    }
}

import { type Application as PixiApplication } from 'pixi.js';

export interface ApplicationRef
{
    getApplication(): PixiApplication | null,
    getCanvas(): HTMLCanvasElement | null,
}

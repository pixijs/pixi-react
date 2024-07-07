import type * as PIXI from 'pixi.js';

export type PixiType = typeof PIXI;

export type AutoFilteredKeys = {
    [K in keyof PixiType]: PixiType[K] extends new (...args: any) => any ? K : never
}[keyof PixiType];

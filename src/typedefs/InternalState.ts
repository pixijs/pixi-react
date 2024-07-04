import type { Application } from 'pixi.js';
import type { Instance } from './Instance.ts';

export interface InternalState
{
    app: Application;
    canvas?: HTMLCanvasElement;
    debug?: boolean;
    isInitialising?: boolean;
    rootContainer: Instance;
}

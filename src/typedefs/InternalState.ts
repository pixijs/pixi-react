import type { Application } from 'pixi.js';
import type { HostConfig } from './HostConfig.ts';

export interface InternalState
{
    app: Application;
    canvas?: HTMLCanvasElement;
    debug?: boolean;
    isInitialising?: boolean;
    rootContainer: HostConfig['containerInstance'];
}

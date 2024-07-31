import type { Application } from 'pixi.js';

export interface ApplicationState
{
    app: Application;
    isInitialised: boolean;
    isInitialising: boolean;
}

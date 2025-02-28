import { type Application } from 'pixi.js';

export interface CreateRootOptions
{
    /** @description Callback to be fired when the application finishes initializing. */
    onInit?: (app: Application) => void
}

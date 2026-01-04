import { type Application, type DestroyOptions, type RendererDestroyOptions } from 'pixi.js';

export interface CreateRootOptions
{
    /** @description Options to be passed to the application's `destroy` method. */
    destroyOptions?: DestroyOptions

    /** @description Callback to be fired when the application finishes initializing. */
    onInit?: (app: Application) => void

    /** @description Options to be passed to the application's `renderer.destroy` method. */
    rendererDestroyOptions?: RendererDestroyOptions
}

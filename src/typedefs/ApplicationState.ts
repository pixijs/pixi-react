import { type Application, type DestroyOptions, type RendererDestroyOptions } from 'pixi.js';

export interface ApplicationState
{
    app: Application;
    destroyOptions: DestroyOptions;
    isInitialised: boolean;
    isInitialising: boolean;
    onDestroy?: () => void;
    rendererDestroyOptions: RendererDestroyOptions;
}

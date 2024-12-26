import { type Application as PixiApplication } from 'pixi.js';
import { getAppRoot } from './getAppRoot';

export function isAppMounted(app: PixiApplication)
{
    if (app.stage === null)
    {
        return false;
    }

    if (app.renderer === null)
    {
        return false;
    }

    if (typeof getAppRoot(app) === 'undefined')
    {
        return false;
    }

    return true;
}

import { type Application as PixiApplication } from 'pixi.js';
import { roots } from '../../src/core/roots';
import { type Root } from '../../src/typedefs/Root';

export function getAppRoot(app: PixiApplication)
{
    let root: Root | undefined;

    for (const oRoot of roots.values())
    {
        if (oRoot.applicationState.app === app)
        {
            root = oRoot;
            break;
        }
    }

    return root;
}

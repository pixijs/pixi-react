import { Application } from 'pixi.js';
import { useContext } from 'react';
import { Context } from '../components/Context.ts';
import { invariant } from '../helpers/invariant';

/**
 * @description Retrieves the nearest Pixi.js Application from the Pixi React context.
 */
export function useApplication()
{
    const appContext = useContext(Context);

    invariant(
        appContext.app instanceof Application,
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

    return appContext;
}

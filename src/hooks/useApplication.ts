import { useContext } from 'react';
import { Context } from '../components/Context';
import { invariant } from '../helpers/invariant';
import { isApplication } from '../helpers/typeChecks';

/**
 * @description Retrieves the nearest Pixi.js Application from the Pixi React context.
 */
export function useApplication()
{
    const appContext = useContext(Context);

    invariant(
        isApplication(appContext.app),
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

    return appContext;
}

import { Application } from '@pixi/app';
import { useContext } from 'react';
import invariant from '../utils/invariant';
import { Context } from '../stage/provider';

export function useApp()
{
    const app = useContext(Context);

    invariant(
        app instanceof Application,
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

    return app;
}

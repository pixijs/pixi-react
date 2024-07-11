import { Application } from 'pixi.js';
import { useContext } from 'react';
import { Context } from '../components/Context.ts';
import { invariant } from '../helpers/invariant';

export function useApp()
{
    const { app } = useContext(Context);

    invariant(
        app instanceof Application,
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

    return app;
}

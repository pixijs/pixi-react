import { Application } from 'pixi.js';
import { useContext } from 'react';
import { Context } from '../components/Context.js';
import { invariant } from '../helpers/invariant';

/** @typedef {import('../typedefs/InternalState.ts').InternalState} InternalState */

export function useApp()
{
    const { app } = /** @type {InternalState} */ (useContext(Context));

    invariant(
        app instanceof Application,
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

    return app;
}

import type { Container } from 'pixi.js';
import type { Instance } from '../typedefs/Instance.ts';
import type { InstanceState } from '../typedefs/InstanceState.ts';
import type { PixiElement } from '../typedefs/PixiElement.ts';

/** Create the instance with the provided sate and attach the component to it. */
export function prepareInstance<T extends Container | PixiElement>(
    component: T,
    state: Partial<InstanceState> = {},
)
{
    const instance = component as Instance;

    instance.__pixireact = {
        filters: [],
        parent: null,
        root: null as unknown as Instance,
        type: '',
        ...state,
    };

    return instance;
}

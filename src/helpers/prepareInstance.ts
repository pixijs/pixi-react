import type {
    Container,
    Filter,
} from 'pixi.js';
import type { HostConfig } from '../typedefs/HostConfig.ts';
import type { NodeState } from '../typedefs/NodeState.ts';

/** Create the instance with the provided sate and attach the component to it. */
export function prepareInstance<T extends Container | Filter | HostConfig['instance']>(
    component: T,
    state: Partial<NodeState> = {},
)
{
    const instance = component as HostConfig['instance'];

    instance.__pixireact = {
        filters: [],
        parent: null,
        root: null as unknown as HostConfig['containerInstance'],
        type: '',
        ...state,
    };

    return instance;
}

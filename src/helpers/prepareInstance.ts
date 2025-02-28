import {
    type Container,
    type Filter,
} from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';
import { type InstanceState } from '../typedefs/InstanceState';

/** Create the instance with the provided sate and attach the component to it. */
export function prepareInstance<T extends Container | Filter | HostConfig['instance']>(
    component: T,
    state: Partial<InstanceState> = {},
)
{
    const instance = component as HostConfig['instance'];

    instance.__pixireact = Object.assign({
        filters: [],
        parent: null,
        root: null as unknown as HostConfig['containerInstance'],
        type: '',
    }, state);

    return instance;
}

import { Filter } from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';
import { sceneNodeChanged } from './hostChildren';

export function unhideInstance(
    instance: HostConfig['instance'],
    props?: HostConfig['props'],
)
{
    if (instance instanceof Filter)
    {
        instance.enabled = props?.enabled !== false;
    }
    else if (typeof (instance as { visible?: unknown }).visible === 'boolean')
    {
        instance.visible = props?.visible !== false;
        sceneNodeChanged(instance, ['visible']);
    }
}

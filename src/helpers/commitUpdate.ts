import { applyProps } from '../helpers/applyProps';
import { log } from '../helpers/log';
import { type HostConfig } from '../typedefs/HostConfig';
import { prepareUpdate } from './prepareUpdate';

export function commitUpdate(
    instance: HostConfig['instance'],
    type: HostConfig['type'],
    oldProps: HostConfig['props'],
    newProps: HostConfig['props'],
)
{
    log('info', 'lifecycle::commitUpdate');

    const diff = prepareUpdate(
        instance,
        type,
        oldProps,
        newProps,
    );

    if (diff)
    {
        applyProps(instance, diff);
    }
}

import { type HostConfig } from '../typedefs/HostConfig';
import { diffProps } from './diffProps';
import { log } from './log';

export function prepareUpdate(
    _instance: HostConfig['instance'],
    _type: HostConfig['type'],
    oldProps: HostConfig['props'],
    newProps: HostConfig['props'],
)
{
    log('info', 'lifecycle::prepareUpdate');

    const {
        children: newChildren,
        ...newPropsRest
    } = newProps;
    const {
        children: oldChildren,
        ...oldPropsRest
    } = oldProps;

    const diff = diffProps(newPropsRest, oldPropsRest, true);

    if (diff.changes.length)
    {
        return diff;
    }

    return null;
}

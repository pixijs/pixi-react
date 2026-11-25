import { applyProps } from '../helpers/applyProps';
import { log } from '../helpers/log';
import { type HostConfig } from '../typedefs/HostConfig';
import {
    applySceneOwnProps,
    sceneNodeChanged,
} from './hostChildren';
import { splitOwnChanges } from './ownProps';
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

    if (!diff)
    {
        return;
    }

    const [changes, ownProps] = splitOwnChanges(instance.constructor, diff.changes);

    if (changes.length)
    {
        applyProps(instance, { ...diff, changes });
        sceneNodeChanged(instance, changes.map(([key]) => key as string));
    }

    if (ownProps)
    {
        applySceneOwnProps(instance, ownProps);
    }
}

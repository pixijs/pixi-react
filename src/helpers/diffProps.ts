import {
    PixiToReactEventPropNames,
    ReactToPixiEventPropNames,
} from '../constants/EventPropNames.js';
import { isEqual } from './compare.ts';
import { gentleCloneProps } from './gentleCloneProps.ts';

import type { Change } from '../typedefs/Change.ts';
import type { InstanceProps } from '../typedefs/InstanceProps.ts';

const DEFAULT = '__default';

export function diffProps(
    newProps: InstanceProps,
    oldProps: InstanceProps = {},
    remove = false,
)
{
    const newPropsRest = gentleCloneProps(newProps);
    const oldPropsRest = gentleCloneProps(oldProps);

    const entries = Object.entries(newPropsRest);

    const changes: Change[] = [];

    // Catch removed props, prepend them so they can be reset or removed
    if (remove)
    {
        const oldPropsKeys = Object.keys(oldPropsRest);

        let propIndex = 0;

        while (propIndex < oldPropsKeys.length)
        {
            const propKey = oldPropsKeys[propIndex];
            const isPropRemoved = !(propKey in newPropsRest);

            if (isPropRemoved)
            {
                entries.unshift([propKey, `${DEFAULT}remove`]);
            }

            propIndex += 1;
        }
    }

    entries.forEach(([key, value]) =>
    {
        // When props match bail out
        if (isEqual(value, oldPropsRest[key]))
        {
            return;
        }

        // Collect handlers and bail out
        if ((key in PixiToReactEventPropNames) || (key in ReactToPixiEventPropNames))
        {
            changes.push([key, value, true, []]);

            return;
        }

        // Split dashed props
        let entries: string[] = [];

        if (key.includes('-'))
        {
            entries = key.split('-');
        }

        changes.push([key, value, false, entries]);

        // Reset pierced props
        for (const prop in newPropsRest)
        {
            const value = newPropsRest[prop];

            if (prop.startsWith(`${key}-`))
            {
                changes.push([prop, value, false, prop.split('-')]);
            }
        }
    });

    return { changes };
}

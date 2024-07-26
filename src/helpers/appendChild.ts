import {
    Container,
    Filter,
} from 'pixi.js';
import { attach } from './attach.ts';
import { log } from './log.ts';

import type { HostConfig } from '../typedefs/HostConfig.ts';

/** Adds elements to our application. */
export function appendChild(
    parentNode: HostConfig['containerInstance'],
    childNode: HostConfig['instance'] | null,
)
{
    log('info', 'lifecycle::appendChild');

    if (!childNode)
    {
        return;
    }

    if (childNode instanceof Container)
    {
        parentNode.addChild(childNode);
    }
    else if (childNode instanceof Filter)
    {
        attach(parentNode, childNode);
    }
}

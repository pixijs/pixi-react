import {
    Container,
    Filter,
} from 'pixi.js';
import { type HostConfig } from '../typedefs/HostConfig';
import { attach } from './attach';
import { log } from './log';

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

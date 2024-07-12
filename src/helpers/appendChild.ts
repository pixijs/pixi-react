import {
    Container,
    Filter,
} from 'pixi.js';
import { attach } from './attach.ts';
import { log } from './log.ts';

import type { ContainerElement } from '../typedefs/ContainerElement.ts';
import type { Instance } from '../typedefs/Instance.ts';

/** Adds elements to our application. */
export function appendChild(parentInstance: Instance<ContainerElement>, childInstance: Instance | null)
{
    log('info', 'lifecycle::appendChild');

    if (!childInstance)
    {
        return;
    }

    if (childInstance instanceof Container)
    {
        parentInstance.addChild(childInstance);
    }
    else if (childInstance instanceof Filter)
    {
        attach(parentInstance, childInstance);
    }
}

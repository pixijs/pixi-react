import type { Graphics } from 'pixi.js';
import type { ContainerElement } from './ContainerElement.ts';
import type { EventHandlers } from './EventHandlers.ts';
import type { InstanceState } from './InstanceState.ts';

interface BaseInstance
{
    BaseInstance: object
    __pixireact?: InstanceState
    autoRemovedBeforeAppend?: boolean
    children?: ContainerElement | ContainerElement[]
    draw?: (graphics: Graphics) => void
}

export type Instance = ContainerElement & BaseInstance & EventHandlers;

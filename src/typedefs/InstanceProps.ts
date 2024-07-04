import type { Graphics } from 'pixi.js';
import type { ContainerElement } from './ContainerElement.ts';
import type { InstanceState } from './InstanceState.ts';

interface BaseInstanceProps
{
    __pixireact?: InstanceState
    autoRemovedBeforeAppend?: boolean
    children?: ContainerElement | ContainerElement[]
    draw?: (graphics: Graphics) => void
}

export type InstanceProps = { [key: string]: unknown } & BaseInstanceProps;

import type { Graphics } from 'pixi.js';
import type { ContainerElement } from './ContainerElement.ts';
import type { EventHandlers } from './EventHandlers.ts';
import type { InstanceState } from './InstanceState.ts';
import type { PixiElement } from './PixiElement.ts';

export type Instance<T = PixiElement> = T & EventHandlers &
{
    __pixireact: InstanceState;
    autoRemovedBeforeAppend?: boolean;
    children?: T extends ContainerElement
        ? ContainerElement | ContainerElement[]
        : never;
    draw?: T extends Graphics
        ? (graphics: Graphics) => void
        : null;
    parent?: Instance<ContainerElement>,
};

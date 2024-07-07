import type { Graphics } from 'pixi.js';
import type {
    Key,
    ReactNode,
    Ref,
} from 'react';
import type { EventHandlers } from './EventHandlers.ts';

export interface BaseNodeProps<T extends abstract new (...args: any) => any>
{
    children?: ReactNode;
    key?: Key;
    ref?: Ref<T>;
}

export type PixiReactNodeProps<T extends abstract new (...args: any) => any> = T extends Graphics
    ? BaseNodeProps<T> & EventHandlers & { draw?: (graphics: Graphics) => void; }
    : BaseNodeProps<T> & EventHandlers;

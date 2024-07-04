import type { Graphics } from 'pixi.js';
import type {
    Key,
    ReactNode,
    Ref,
} from 'react';
import type { EventHandlers } from './EventHandlers.ts';

interface BaseNodeProps<T extends abstract new (...args: any) => any>
{
    children?: ReactNode;
    draw?: (graphics: Graphics) => void;
    key?: Key;
    ref?: Ref<T>;
}

export type NodeProps<T extends abstract new (...args: any) => any> = BaseNodeProps<T> & EventHandlers;

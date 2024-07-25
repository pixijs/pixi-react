import type {
    Container,
    Graphics,
} from 'pixi.js';
import type {
    Key,
    Ref,
} from 'react';
import type { DrawCallback } from './DrawCallback.ts';
import type { EventHandlers } from './EventHandlers.ts';
import type { NodeState } from './NodeState.ts';

export interface BaseNodeProps<T extends new (...args: any) => any = typeof Container>
{
    __pixireact: NodeState,
    children?: T extends PixiReactNode<typeof Container>
        ? PixiReactNode | PixiReactNode[]
        : never;
    draw?: T extends Graphics
        ? DrawCallback
        : null;
    key?: Key;
    parent?: PixiReactNode<typeof Container>;
    ref?: Ref<T>;
}

export type PixiReactNode<T extends new (...args: any) => any = typeof Container> =
    BaseNodeProps<InstanceType<T>>
    & EventHandlers
    & {
        [K in keyof InstanceType<T> as K]: K extends keyof BaseNodeProps<InstanceType<T>>
            ? never
            : InstanceType<T>[K];
    };

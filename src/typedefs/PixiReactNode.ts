import type {
    Container,
    Graphics,
} from 'pixi.js';
import type {
    Key,
    Ref,
} from 'react';
import type { PixiToReactEventPropNames } from '../constants/EventPropNames.ts';
import type { ConstructorOptions } from './ConstructorOptions.ts';
import type { DrawCallback } from './DrawCallback.ts';
import type { EventHandlers } from './EventHandlers.ts';
import type { InstanceState } from './InstanceState.ts';
import type { PixiReactChildNode } from './PixiReactChildNode.ts';

export interface BaseNodeProps<T extends new (...args: any) => any = typeof Container>
{
    children: T extends Container
        ? PixiReactChildNode
        : never;
    draw?: T extends Graphics
        ? DrawCallback
        : null;
    key?: Key;
    ref?: Ref<T>;
}

export interface NodeProps<T extends new (...args: any) => any = typeof Container> extends BaseNodeProps<T>
{
    __pixireact: InstanceState,
    parent?: PixiReactNode<typeof Container>;
}

export type PixiReactNode<T extends new (...args: any) => any = typeof Container> =
    NodeProps<InstanceType<T>>
    & EventHandlers
    & {
        [K in keyof InstanceType<T> as K]: K extends keyof NodeProps<InstanceType<T>>
            ? NodeProps<InstanceType<T>>[K]
            : InstanceType<T>[K];
    };

export type PixiReactElementProps<T extends new (...args: any) => any = typeof Container> =
    BaseNodeProps<InstanceType<T>>
    & EventHandlers
    & {
        [
        K in keyof ConstructorOptions<T> as (
            K extends keyof typeof PixiToReactEventPropNames
                ? never
                : K extends keyof NodeProps<InstanceType<T>>
                    ? ConstructorOptions<T>[K] extends NodeProps<InstanceType<T>>[K]
                        ? never
                        : K
                    : K
        )
        ]: ConstructorOptions<T>[K];
    };

import {
    type Container,
    type Graphics,
} from 'pixi.js';
import {
    type Key,
    type Ref,
} from 'react';
import { type PixiToReactEventPropNames } from '../constants/EventPropNames';
import { type ConstructorOptions } from './ConstructorOptions';
import { type DrawCallback } from './DrawCallback';
import { type EventHandlers } from './EventHandlers';
import { type InstanceState } from './InstanceState';
import { type PixiReactChildNode } from './PixiReactChildNode';
import {
    type ExcludeFunctionProps,
    type OmitKeys,
} from './UtilityTypes';

export interface BaseNodeProps<T extends new (...args: any) => any = typeof Container>
{
    children?: T extends Container
        ? PixiReactChildNode
        : never;
    key?: Key;
    ref?: Ref<T>;
}

export type GraphicsProps<T> = T extends Graphics ?
    { draw: DrawCallback } : unknown;

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
    & GraphicsProps<InstanceType<T>>
    & OmitKeys<ExcludeFunctionProps<ConstructorOptions<T>>, NodeProps<T> & typeof PixiToReactEventPropNames>
    & EventHandlers;

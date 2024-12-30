import {
    type Container,
    type Filter,
} from 'pixi.js';
import { type NamespacedPixiElements } from './NamespacedPixiElements';
import { type PixiElements } from './PixiElements';
import { type PixiReactNode } from './PixiReactNode';

export interface HostConfig
{
    childSet: never;
    containerInstance: PixiReactNode<typeof Container>;
    filterInstance: PixiReactNode<typeof Filter>;
    formInstance: never,
    hostContext: Record<string, unknown>;
    hydratableInstance: never;
    instance: PixiReactNode;
    noTimeout: number;
    props: Record<string, unknown>;
    publicInstance: PixiReactNode;
    suspenseInstance: PixiReactNode;
    textInstance: PixiReactNode;
    timeoutHandle: number;
    type: keyof PixiElements | keyof NamespacedPixiElements;
    updatePayload: object;
    transitionStatus: null,
}

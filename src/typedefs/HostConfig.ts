import type {
    Container,
    Filter,
} from 'pixi.js';
import type { NamespacedPixiElements } from './NamespacedPixiElements.ts';
import type { PixiElements } from './PixiElements.ts';
import type { PixiReactNode } from './PixiReactNode.ts';

export interface HostConfig
{
    childSet: never;
    containerInstance: PixiReactNode<typeof Container>;
    filterInstance: PixiReactNode<typeof Filter>;
    hostContext: null;
    hydratableInstance: never;
    instance: PixiReactNode;
    noTimeout: -1;
    props: Record<string, unknown>;
    publicInstance: PixiReactNode;
    suspenseInstance: PixiReactNode;
    textInstance: PixiReactNode;
    timeoutHandle: number;
    type: keyof PixiElements | keyof NamespacedPixiElements;
    updatePayload: object;
}

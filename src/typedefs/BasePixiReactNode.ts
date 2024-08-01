import type {
    Container,
    Filter,
} from 'pixi.js';
import type { PixiReactNode } from './PixiReactNode';

export type BasePixiReactNode<T extends new (...args: any) => any = typeof Container | typeof Filter> = PixiReactNode<T>;

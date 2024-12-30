import { type ReactNode } from 'react';
import { type BasePixiReactNode } from './BasePixiReactNode';

export type PixiReactChildNode = BasePixiReactNode | Iterable<BasePixiReactNode> | ReactNode;

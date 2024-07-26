import type { ReactNode } from 'react';
import type { BasePixiReactNode } from './BasePixiReactNode.ts';

export type PixiReactChildNode = BasePixiReactNode | Iterable<BasePixiReactNode> | ReactNode;

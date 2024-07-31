import type { Container } from 'pixi.js';
import type { Fiber } from 'react-reconciler';
import type { ApplicationState } from './ApplicationState.ts';
import type { InternalState } from './InternalState.ts';

export interface Root
{
    fiber: Fiber;
    root?: Container;
    render: (...args: any[]) => any;
    applicationState: ApplicationState;
    internalState: InternalState;
}

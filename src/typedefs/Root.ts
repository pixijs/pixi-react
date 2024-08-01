import type { Container } from 'pixi.js';
import type { Fiber } from 'react-reconciler';
import type { ApplicationState } from './ApplicationState';
import type { InternalState } from './InternalState';

export interface Root
{
    fiber: Fiber;
    root?: Container;
    render: (...args: any[]) => any;
    applicationState: ApplicationState;
    internalState: InternalState;
}

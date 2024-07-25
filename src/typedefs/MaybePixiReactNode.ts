import type {
    FederatedEventHandler,
    FederatedPointerEvent,
    FederatedWheelEvent,
} from 'pixi.js';
import type { PixiToReactEventPropNames } from '../constants/EventPropNames.ts';
import type { PixiReactNode } from './PixiReactNode.ts';

export type StupidEventHandlers = {
    -readonly [K in keyof typeof PixiToReactEventPropNames]?:
    | FederatedEventHandler<FederatedPointerEvent>
    | FederatedEventHandler<FederatedWheelEvent>
    | null
};

export type MaybePixiReactNode = Partial<PixiReactNode> & Partial<StupidEventHandlers>;

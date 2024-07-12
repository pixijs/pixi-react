import type {
    FederatedEventHandler,
    FederatedPointerEvent,
    FederatedWheelEvent,
} from 'pixi.js';
import type { PixiToReactEventPropNames } from '../constants/EventPropNames.ts';
import type { Instance } from './Instance.ts';
import type { PartialBy } from './PartialBy.ts';

export type StupidEventHandlers = {
    -readonly [K in keyof typeof PixiToReactEventPropNames]?:
    | FederatedEventHandler<FederatedPointerEvent>
    | FederatedEventHandler<FederatedWheelEvent>
    | null
};

export type MaybeInstance = PartialBy<Instance, '__pixireact'> & Partial<StupidEventHandlers>;

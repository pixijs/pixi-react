import { type ReactToPixiEventPropNames } from '../constants/EventPropNames.js';

import type {
    FederatedPointerEvent,
    FederatedWheelEvent,
} from 'pixi.js';

export type EventHandlers = {
    -readonly [K in keyof typeof ReactToPixiEventPropNames]?: (event: FederatedPointerEvent | FederatedWheelEvent) => void
};

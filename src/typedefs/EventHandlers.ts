import { type ReactToPixiEventPropNames } from '../constants/EventPropNames.ts';

import type {
    FederatedPointerEvent,
    FederatedWheelEvent,
} from 'pixi.js';

export type EventHandlers = {
    -readonly [K in keyof typeof ReactToPixiEventPropNames]?: (event: FederatedPointerEvent | FederatedWheelEvent) => void
};

import type {
    FederatedPointerEvent,
    FederatedWheelEvent,
} from 'pixi.js';
import type { ReactToPixiEventPropNames } from '../constants/EventPropNames.ts';

export type EventHandlers = {
    -readonly [K in keyof typeof ReactToPixiEventPropNames]?: (event: FederatedPointerEvent | FederatedWheelEvent) => void
};

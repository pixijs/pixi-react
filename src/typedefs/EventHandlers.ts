import {
    type FederatedEventHandler,
    type FederatedPointerEvent,
    type FederatedWheelEvent,
} from 'pixi.js';
import { type ReactToPixiEventPropNames } from '../constants/EventPropNames';

export type EventHandlers = {
    -readonly [K in keyof typeof ReactToPixiEventPropNames]?:
    | FederatedEventHandler<FederatedPointerEvent>
    | FederatedEventHandler<FederatedWheelEvent>
    | null
};

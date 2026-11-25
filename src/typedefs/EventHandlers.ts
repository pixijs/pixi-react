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

// One signature per key, so generic props (e.g. `PixiReactElementProps<T>['onClick']`) still forward
type FederatedHandlerFor<K> = K extends 'onWheel'
    ? FederatedEventHandler<FederatedWheelEvent> | null
    : FederatedEventHandler<FederatedPointerEvent> | null;

/** Event handler props typed from the instance's `on*` fields, so 3D nodes get 3D events. */
export type EventHandlersFor<I> = {
    -readonly [K in keyof typeof ReactToPixiEventPropNames]?:
    typeof ReactToPixiEventPropNames[K] extends keyof I
        ? I[typeof ReactToPixiEventPropNames[K]]
        : FederatedHandlerFor<K>
};

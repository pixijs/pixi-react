import { ReactToPixiEventPropNames } from '../constants/EventPropNames.js';

/** @typedef {import('pixi.js').FederatedPointerEvent} FederatedPointerEvent */
/** @typedef {import('pixi.js').FederatedWheelEvent} FederatedWheelEvent */

/**
 * @typedef {{
 * 	-readonly [K in keyof typeof ReactToPixiEventPropNames]?: (event: FederatedPointerEvent | FederatedWheelEvent) => void
 * }} EventHandlers
 */

export const EventHandlers = {};

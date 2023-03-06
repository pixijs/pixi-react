import { invariant } from '@pixi/react-invariant';
import isNil from 'lodash.isnil';
import type { PixiReactContainer, PointCoords, PointLike } from '../types';
import type { IPoint } from '@pixi/core';

/**
 * Parse PIXI point value to array of coordinates
 *
 * @param {*} value
 * @returns {Array}
 */
export function parsePoint(value: PointLike | string): PointCoords
{
    let arr: (number | string)[] = [];

    if (typeof value === 'undefined')
    {
        return arr as PointCoords;
    }
    else if (typeof value === 'string')
    {
        arr = value.split(',');
    }
    else if (typeof value === 'number')
    {
        arr = [value];
    }
    else if (Array.isArray(value))
    {
        arr = [...value];
    }
    else if (value !== null && typeof value === 'object')
    {
        const x = (value && value?.x) || 0;
        const y = (value && value?.y) || 0;

        arr = [x, y];
    }
    else
    {
        return arr as PointCoords;
    }

    const isNumberLike = (p: any): boolean => !isNil(p) && !isNaN(p as number);

    return arr.filter(isNumberLike).map(Number) as PointCoords;
}

/**
 * Check if two points are equal
 *
 * @param {*} oldValue
 * @param {*} newValue
 * @returns {boolean}
 */
export function pointsAreEqual(oldValue: PointCoords, newValue: PointCoords)
{
    if (oldValue.length !== newValue.length)
    {
        return false;
    }

    for (let i = 0; i < oldValue.length; i++)
    {
        if (oldValue[i] !== newValue[i])
        {
            return false;
        }
    }

    return true;
}

/**
 * Determine value is type of Point or ObservablePoint
 * See https://github.com/michalochman/react-pixi-fiber/blob/a4dbddbef0ffbf0f563c64d30766ea28222a51ea/src/utils.js#L48
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isPointType(value: any): value is IPoint
{
    // avoid instanceof check for perf
    return (
        !isNil(value)
        && value.x !== undefined
        && value.y !== undefined
        && value.copyFrom !== undefined
        && value.copyTo !== undefined
        && value.equals !== undefined
        && value.set !== undefined
    );
}

// TODO: can we pull this from FederatedEventEmitterTypes
/**
 * Event handlers
 *
 * @type {string[]}
 */
export const eventHandlers = [
    'click',
    'mousedown',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mouseupoutside',
    'pointercancel',
    'pointerout',
    'pointerover',
    'pointertap',
    'pointerdown',
    'pointerup',
    'pointerupoutside',
    'pointermove',
    'rightclick',
    'rightdown',
    'rightup',
    'rightupoutside',
    'tap',
    'touchcancel',
    'touchend',
    'touchendoutside',
    'touchmove',
    'touchstart',
];

/**
 * Set value on a PIXI.DisplayObject
 * See https://github.com/Izzimach/react-pixi/blob/a25196251a13ed9bb116a8576d93e9fceac2a14c/src/ReactPIXI.js#L114
 *
 * @param {PIXI.DisplayObject} instance
 * @param {string} prop
 * @param {*} value
 */
export function setValue(instance: PixiReactContainer, prop: string, value: any)
{
    type InstanceProperty = keyof typeof instance;

    const currentValue = instance[prop as InstanceProperty];
    const currentValueIsPointType = isPointType(currentValue);

    if (currentValueIsPointType && isPointType(value))
    {
        // copy value
        currentValue.copyFrom(value);
    }
    else if (currentValueIsPointType)
    {
        // parse value if a non-Point type is being assigned to a Point type
        const coordinates = parsePoint(value);

        invariant(
            typeof coordinates !== 'undefined' && coordinates.length > 0 && coordinates.length < 3,
            'The property `%s` is a `PIXI.Point` or `PIXI.ObservablePoint` and must be set to a comma-separated string of '
                + 'either 1 or 2 coordinates, a 1 or 2 element array containing coordinates, or a PIXI Point/ObservablePoint. '
                + 'If only one coordinate is given then X and Y will be set to the provided value. Received: `%s` of type `%s`.',
            prop,
            JSON.stringify(value),
            typeof value,
        );

        const [x, y] = coordinates;

        currentValue.set(x, y);
    }
    else
    {
        // just hard assign value
        // @ts-ignore - ignore readonly property value errors
        instance[prop as InstanceProperty] = value;
    }
}

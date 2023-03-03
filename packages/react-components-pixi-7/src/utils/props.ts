import { Texture } from '@pixi/core';
import type { Container } from '@pixi/display';
import { DisplayObject } from '@pixi/display';
import { eventHandlers, setValue } from './pixi';
import { invariant } from '@pixi/react-invariant';
import type { DisplayObjectSettableProperty, ExpandoTexture, PropsType } from '../types';
import { not, hasKey } from './fp';
import type { FederatedEventEmitterTypes } from '@pixi/events';

export const CHILDREN = 'children';
/**
 * Reserved props
 *
 * @type {Object}
 */
export const PROPS_RESERVED = {
    [CHILDREN]: true,
    parent: true,
    worldAlpha: true,
    worldTransform: true,
    worldVisible: true,
};

/**
 * Default display object props
 * See https://github.com/michalochman/react-pixi-fiber/blob/a4dbddbef0ffbf0f563c64d30766ea28222a51ea/src/props.js#L9
 *
 * @type {Object}
 */
export const PROPS_DISPLAY_OBJECT: Record<DisplayObjectSettableProperty, any> = {
    alpha: 1,
    buttonMode: false,
    cacheAsBitmap: false,
    cursor: null,
    filterArea: null,
    filters: null,
    hitArea: null,
    interactive: false,
    mask: null,
    pivot: 0,
    position: 0,
    renderable: true,
    rotation: 0,
    scale: 1,
    skew: 0,
    transform: null,
    visible: true,
    x: 0,
    y: 0,
};

type TypeValidator = {
    typeofs: string[];
    // eslint-disable-next-line @typescript-eslint/ban-types
    instanceofs: Function[];
};

/**
 * Helper util for fetching the texture from props
 * Can be either texture or image
 *
 * @param {string} elementType
 * @param {PIXI.Container} root
 * @param {object} props
 * @returns {PIXI.Texture|null}
 */
export const getTextureFromProps = (elementType: string, root: Container, props: PropsType = {}) =>
{
    const emitChange = (texture: ExpandoTexture) =>
        requestAnimationFrame(() =>
        {
            texture?.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`);
        });

    // eslint-disable-next-line consistent-return
    const check = (inType: string, validator: TypeValidator) =>
    {
        if (props.hasOwnProperty(inType))
        {
            const valid
                = validator.typeofs.some((t) => typeof props[inType] === t)
                || validator.instanceofs.some((i) => props[inType] instanceof i);

            invariant(valid, `${elementType} ${inType} prop is invalid`);

            return props[inType];
        }
    };

    if (props.texture)
    {
        invariant(props.texture instanceof Texture, `${elementType} texture needs to be typeof \`Texture\``);

        return props.texture;
    }
    const result
        = check('image', { typeofs: ['string'], instanceofs: [HTMLImageElement] })
        || check('video', { typeofs: ['string'], instanceofs: [HTMLVideoElement] })
        || check('source', {
            typeofs: ['string', 'number'],
            instanceofs: [HTMLImageElement, HTMLVideoElement, HTMLCanvasElement, Texture],
        });

    invariant(!!result, `${elementType} could not get texture from props`);

    const texture: ExpandoTexture = Texture.from(result);

    texture.__reactpixi = { root };
    texture.once('update', emitChange);
    texture.once('loaded', emitChange);

    if (texture.valid)
    {
        emitChange(texture);
    }

    return texture;
};

const filterProps = not(hasKey([...Object.keys(PROPS_RESERVED), ...eventHandlers]));

/**
 * Apply default props on Display Object instance (which are all components)
 *
 * @param {PIXI.DisplayObject} instance
 * @param {Object} oldProps
 * @param {Object} newProps
 */
export function applyDefaultProps(instance: Container, oldProps: PropsType, newProps: PropsType)
{
    let changed = false;

    invariant(
        DisplayObject.prototype.isPrototypeOf(instance),
        'instance needs to be typeof `DisplayObject`, got `%s`',
        typeof instance,
    );

    // update event handlers
    if (!newProps.ignoreEvents)
    {
        const hasRemoveListener = typeof instance.removeListener === 'function';
        const hasOn = typeof instance.on === 'function';

        for (let i = 0; i < eventHandlers.length; i++)
        {
            const evt = eventHandlers[i] as keyof FederatedEventEmitterTypes;

            if (oldProps[evt] !== newProps[evt])
            {
                changed = true;
                if (typeof oldProps[evt] === 'function' && hasRemoveListener)
                {
                    instance.removeListener(evt, oldProps[evt]);
                }
                if (typeof newProps[evt] === 'function' && hasOn)
                {
                    instance.on(evt, newProps[evt]);
                }
            }
        }
    }

    const newPropKeys = Object.keys(newProps || {});

    // hard overwrite all props? can speed up performance
    if (newProps.overwriteProps)
    {
        for (let i = 0; i < newPropKeys.length; i++)
        {
            const p = newPropKeys[i];

            if (oldProps[p] !== newProps[p])
            {
                changed = true;
                setValue(instance, p, newProps[p]);
            }
        }

        // TODO: previously this returned nothing ie. falsy, should we explicitly return false here instead or was it always
        // a subtle bug, test the intention
        return changed;
    }

    const props = newPropKeys.filter(filterProps);

    for (let i = 0; i < props.length; i++)
    {
        const prop = props[i];
        const value = newProps[prop];

        if (newProps[prop] !== oldProps[prop])
        {
            changed = true;
        }

        if (value !== undefined)
        {
            // set value if defined
            setValue(instance, prop, value);
        }
        else if (prop in PROPS_DISPLAY_OBJECT)
        {
            // is a default value, use that
            console.warn(
                `setting default value: ${prop}, from: ${instance[prop as keyof typeof instance]} to: ${value} for`,
                instance,
            );
            changed = true;
            setValue(instance, prop, PROPS_DISPLAY_OBJECT[prop as DisplayObjectSettableProperty]);
        }
        else
        {
            console.warn(
                `ignoring prop: ${prop}, from ${instance[prop as keyof typeof instance]} to ${value} for`,
                instance,
            );
        }
    }

    return changed;
}
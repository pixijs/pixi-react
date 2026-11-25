import { Graphics } from 'pixi.js';
import {
    type FederatedPointerEvent,
    type FederatedWheelEvent,
} from 'pixi.js';
import {
    PixiToReactEventPropNames,
    ReactToPixiEventPropNames,
} from '../constants/EventPropNames';
import { type DiffSet } from '../typedefs/DiffSet';
import { type HostConfig } from '../typedefs/HostConfig';
import { type InstanceState } from '../typedefs/InstanceState';
import {
    isNull,
    isUndefined,
} from './compare';
import { diffProps } from './diffProps';
import { isDiffSet } from './isDiffSet';
import { isReadOnlyProperty } from './isReadOnlyProperty';
import { log } from './log';

const DEFAULT = '__default';
const BLANKS = new Map<unknown, unknown>();

// No ancestor's blank when the constructor needs arguments: a subclass may redefine a prop
// (e.g. `NineSliceSprite`'s `width`)
function getBlank(instance: unknown)
{
    const ctor = (instance as { constructor?: unknown } | null)?.constructor;

    if (BLANKS.has(ctor))
    {
        return BLANKS.get(ctor);
    }

    let blank: unknown = null;

    if (typeof ctor === 'function' && ctor !== Object)
    {
        try
        {
            blank = new (ctor as new () => unknown)();
        }
        catch
        {
            // Needs constructor arguments
        }
    }

    BLANKS.set(ctor, blank);

    return blank;
}

const NO_DEFAULT = Symbol('NO_DEFAULT');

function isNil(value: unknown): value is null | undefined
{
    return isNull(value) || isUndefined(value);
}

function readPath(target: any, path: string[])
{
    let current = target;

    for (const pathKey of path)
    {
        if (isNil(current) || (typeof current !== 'object' && typeof current !== 'function') || !(pathKey in current))
        {
            return NO_DEFAULT;
        }

        current = current[pathKey];
    }

    return current;
}

function getDefaultValue(instance: unknown, currentInstance: any, keyPath: string[], key: string): unknown
{
    const blank = getBlank(instance);
    let value = readPath(blank, keyPath);

    // e.g. the `Rectangle` in `hitArea-x`
    if (value === NO_DEFAULT && currentInstance !== instance)
    {
        value = readPath(getBlank(currentInstance), [key]);
    }

    if (value === NO_DEFAULT && keyPath.length === 1)
    {
        if (blank !== null)
        {
            // Declared but not initialised, e.g. `cursor`
            value = undefined;
        }
        else if (typeof currentInstance[key] === 'function')
        {
            // A removed callback must stop firing
            value = null;
        }
    }

    if (value && typeof value === 'object')
    {
        const objectValue = value as { addChild?: unknown, clone?: () => unknown, destroy?: unknown };

        // The blank's own nodes, e.g. a View3D's camera
        if (typeof objectValue.addChild === 'function')
        {
            return NO_DEFAULT;
        }

        // Copy values so instances don't share them, but not resources: nothing would destroy the copy
        if (typeof objectValue.clone === 'function')
        {
            return typeof objectValue.destroy === 'function' ? NO_DEFAULT : objectValue.clone();
        }

        if (Array.isArray(value))
        {
            return value.slice();
        }

        if (Object.getPrototypeOf(value) === Object.prototype)
        {
            return { ...value };
        }
    }

    return value;
}

const PIXI_EVENT_PROP_NAME_ERROR_HAS_BEEN_SHOWN: Record<string, boolean> = {};

export type MaybeInstance = Partial<HostConfig['instance']>;

function targetKeyReducer(accumulator: any, key: string)
{
    if (accumulator)
    {
        const value = accumulator[key];

        if (!isUndefined(value) && !isNull(value))
        {
            return value;
        }
    }

    return accumulator;
}

/** Apply properties to Pixi.js instance. */
export function applyProps(
    instance: MaybeInstance,
    data: HostConfig['props'] | DiffSet,
    options: {
        /** For initial props, which constructors usually set already: setting them again can have side effects. */
        skipUnchanged?: boolean,
    } = {},
)
{
    const {
        __pixireact: instanceState = {} as InstanceState,
        ...instanceProps
    } = instance;

    let typedData;

    if (isDiffSet(data))
    {
        typedData = data as DiffSet;
    }
    else
    {
        typedData = diffProps(data, instanceProps as HostConfig['props']);
    }

    const { changes } = typedData;

    let changeIndex = 0;

    while (changeIndex < changes.length)
    {
        const change = changes[changeIndex];
        let hasError = false;
        let key = change[0] as keyof HostConfig['instance'];
        let value = change[1];
        const isEvent = change[2];

        const keys = change[3];
        // `keys` is reversed in place below
        const keyPath = keys.length ? [...keys] : [key as string];

        let currentInstance = instance;
        let targetProp = currentInstance[key];

        if ((key as string === 'draw') && (typeof value === 'function'))
        {
            if (instance instanceof Graphics)
            {
                value(instance);
            }
            else
            {
                hasError = true;
                log('warn', `The \`draw\` prop was used on a \`${instanceState.type}\` component, but it's only valid on \`graphics\` components.`);
            }
        }

        if (key in PixiToReactEventPropNames)
        {
            const typedKey = key as keyof typeof PixiToReactEventPropNames;

            hasError = true;

            if (!PIXI_EVENT_PROP_NAME_ERROR_HAS_BEEN_SHOWN[key])
            {
                PIXI_EVENT_PROP_NAME_ERROR_HAS_BEEN_SHOWN[key] = true;

                log('warn', `Event names must be pascal case; instead of \`${key}\`, you probably want \`${PixiToReactEventPropNames[typedKey]}\`.`);
            }
        }

        if (!hasError)
        {
            // Resolve dashed props
            if (keys.length)
            {
                let parent: any = currentInstance;

                for (let keyIndex = 0; keyIndex < keys.length - 1 && !isNil(parent); keyIndex++)
                {
                    parent = parent[keys[keyIndex]];
                }

                // Not a path into the instance (e.g. `data-testid`): set the key as written
                if (isNil(parent))
                {
                    if (value === `${DEFAULT}remove`)
                    {
                        delete currentInstance[change[0] as keyof MaybeInstance];
                    }
                    else
                    {
                        (currentInstance as Record<string, unknown>)[change[0]] = value;
                    }

                    changeIndex += 1;
                    continue;
                }

                targetProp = keys.reduce(targetKeyReducer, currentInstance);

                // If the target is atomic, it forces us to switch the root
                if (!(targetProp && (targetProp as unknown as Record<string, unknown>).set))
                {
                    const [name, ...reverseEntries] = keys.reverse();

                    currentInstance = reverseEntries.reverse().reduce(targetKeyReducer, currentInstance);

                    key = name as keyof MaybeInstance;
                }
            }

            // https://github.com/mrdoob/three.js/issues/21209
            // HMR/fast-refresh relies on the ability to cancel out props, but pixi.js
            // has no means to do this. Hence we curate a small collection of value-classes
            // with their respective constructor/set arguments
            // For removed props, try to set default values, if possible
            if (value === `${DEFAULT}remove`)
            {
                if (isEvent)
                {
                    // Removed handlers are deleted below
                    value = null;
                }
                else
                {
                    value = getDefaultValue(instance, currentInstance, keyPath, key as string);

                    if (value === NO_DEFAULT)
                    {
                        log('warn', `No default found for the removed \`${change[0]}\` prop; leaving it unchanged.`);
                        changeIndex += 1;
                        continue;
                    }
                }
            }

            // Deal with events ...
            if (isEvent && instanceState)
            {
                const typedKey = key as keyof typeof ReactToPixiEventPropNames;
                const pixiKey = ReactToPixiEventPropNames[typedKey];

                if (value)
                {
                    currentInstance[pixiKey] = value as (event: FederatedPointerEvent | FederatedWheelEvent) => void;
                }
                else
                {
                    delete currentInstance[pixiKey];
                }
            }
            else if (
                !isReadOnlyProperty(currentInstance as Record<string, unknown>, key)
                && !(options.skipUnchanged && !keys.length && Object.is(currentInstance[key], value))
            )
            {
                // @ts-expect-error Typescript is grumpy because this could be setting a readonly key, but we're already handling that in the conditional above. 🤷🏻‍♂️
                currentInstance[key] = value;
            }
        }

        changeIndex += 1;
    }

    return instance;
}

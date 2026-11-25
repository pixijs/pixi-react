import { type DiffSet } from '../typedefs/DiffSet';
import { getOwnProps } from './hostChildren';

const REMOVED = '__defaultremove';

function isOwn(key: string, own: readonly string[])
{
    return own.some((name) => key === name || key.startsWith(`${name}-`));
}

/** Splits `props` into those the reconciler applies and those the scene extension applies, if any. */
export function splitOwnProps(component: unknown, props: Record<string, unknown>)
{
    const own = getOwnProps(component);

    if (!own?.some((name) => Object.keys(props).some((key) => isOwn(key, [name]))))
    {
        return [props, null] as const;
    }

    const rest: Record<string, unknown> = {};
    const extracted: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(props))
    {
        (isOwn(key, own) ? extracted : rest)[key] = value;
    }

    return [rest, extracted] as const;
}

/** Splits `changes` the same way; a removed own prop comes out as `undefined`. */
export function splitOwnChanges(component: unknown, changes: DiffSet['changes'])
{
    const own = getOwnProps(component);

    if (!own)
    {
        return [changes, null] as const;
    }

    const rest: DiffSet['changes'] = [];
    let extracted: Record<string, unknown> | null = null;

    for (const change of changes)
    {
        const [key, value] = change;

        if (isOwn(key as string, own))
        {
            extracted ??= {};
            extracted[key as string] = value === REMOVED ? undefined : value;
        }
        else
        {
            rest.push(change);
        }
    }

    return [rest, extracted] as const;
}

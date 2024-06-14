import { isEqual } from './compare.js';

/** @typedef {import('../typedefs/Change.js').Change} Change */
/** @typedef {import('../typedefs/DiffSet.js').DiffSet} DiffSet */
/** @typedef {import('../typedefs/InstanceProps.js').InstanceProps} InstanceProps */

const DEFAULT = '__default';

/**
 *
 * @param {InstanceProps} newProps New props.
 * @param {InstanceProps} oldProps Old props.
 * @param {boolean} remove
 * @returns {DiffSet}
 */
export function diffProps(
    newProps,
    oldProps = {},
    remove = false,
)
{
    const {
        children: newChildren,
        key: newKey,
        ref: newRef,
        ...newPropsRest
    } = newProps;
    const {
        children: oldChildren,
        key: oldKey,
        ref: oldRef,
        ...oldPropsRest
    } = oldProps;

    const entries = Object.entries(newPropsRest);

    /** @type {Change[]} */
    const changes = [];

    // Catch removed props, prepend them so they can be reset or removed
    if (remove)
    {
        const oldPropsKeys = Object.keys(oldPropsRest);

        let propIndex = 0;

        while (propIndex < oldPropsKeys.length)
        {
            const propKey = oldPropsKeys[propIndex];
            const isPropRemoved = !(propKey in newPropsRest);

            if (isPropRemoved)
            {
                entries.unshift([propKey, `${DEFAULT}remove`]);
            }

            propIndex += 1;
        }
    }

    entries.forEach(([key, value]) =>
    {
        // When props match bail out
        if (isEqual(value, oldPropsRest[key]))
        {
            return;
        }

        //   // Collect handlers and bail out
        //   if (/^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/.test(key)) return changes.push([key, value, true, []])

        // Split dashed props
        /** @type {string[]} */
        let entries = [];

        if (key.includes('-'))
        {
            entries = key.split('-');
        }

        changes.push([key, value, false, entries]);

        // Reset pierced props
        for (const prop in newPropsRest)
        {
            const value = newPropsRest[prop];

            if (prop.startsWith(`${key}-`))
            {
                changes.push([prop, value, false, prop.split('-')]);
            }
        }
    });

    return { changes };
}

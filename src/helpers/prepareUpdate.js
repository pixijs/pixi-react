import { diffProps } from './diffProps.js';
import { log } from './log.js';

/** @typedef {import('../typedefs/DiffSet.js').DiffSet} DiffSet */
/** @typedef {import('../typedefs/InstanceProps.js').InstanceProps} InstanceProps */

/**
 *
 * @param {import('../typedefs/Instance.js').Instance} _instance Unused.
 * @param {string} _type Unused.
 * @param {InstanceProps} oldProps Old props.
 * @param {InstanceProps} newProps New props.
 * @returns {[boolean, DiffSet] | null}
 */
export function prepareUpdate(_instance, _type, oldProps, newProps)
{
    log('info', 'lifecycle::prepareUpdate');

    // This is a data object, let's extract critical information about it
    const {
        children: newChildren,
        ...newPropsRest
    } = newProps;
    const {
        children: oldChildren,
        ...oldPropsRest
    } = oldProps;

    // Create a diff-set, flag if there are any changes
    const diff = diffProps(newPropsRest, oldPropsRest, true);

    if (diff.changes.length)
    {
        return [false, diff];
    }

    // Otherwise do not touch the instance
    return null;
}

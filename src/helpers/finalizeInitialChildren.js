import { log } from './log.js';

/**
 * Applies final mutations during the render phase.
 *
 * @returns {false}
 */
export function finalizeInitialChildren()
{
    log('info', 'lifecycle::finalizeInitialChildren');

    return false;
}

import { log } from './log.js';

/**
 * Mutate and remove all children from a container.
 *
 * @returns {false}
 */
export function clearContainer()
{
    log('info', 'lifecycle::clearContainer');

    return false;
}

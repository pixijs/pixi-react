import { log } from './log.js';

/**
 * @template T
 * @param {T} parentHostContext
 * @returns {T}
 */
export function getChildHostContext(parentHostContext)
{
    log('info', 'lifecycle::getChildHostContext');

    return parentHostContext;
}

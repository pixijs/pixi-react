import { log } from './log.js';

/**
 * @template T
 * @param {T} instance
 * @returns {T}
 */
export function getPublicInstance(instance)
{
    log('info', 'lifecycle::getPublicInstance');

    return instance;
}

import { log } from './log.js';

/**
 * @param {*} _scope Unused.
 * @throws {Error} Always throws, because we don't support this.
 * @returns {import('../typedefs/Instance.js').Instance}
 */
export function getInstanceFromScope(_scope)
{
    log('info', 'lifecycle:getInstanceFromScope');
    throw new Error('Not yet implemented.');
}

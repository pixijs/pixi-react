import { log } from './log.js';

/**
 * Store info before React starts making changes tothe tree.
 *
 * @returns {null}
 */
export function prepareForCommit()
{
    log('info', 'lifecycle::prepareForCommit');

    return null;
}

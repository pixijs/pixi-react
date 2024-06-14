import { log } from './log.js';

/**
 * Determines whether to set the text content of a node.
 *
 * @returns {false}
 */
export function shouldSetTextContent()
{
    log('info', 'lifecycle::shouldSetTextContent');

    return false;
}

import { log } from './log.js';

/**
 * restore anything stored in `prepareForCommit`.
 */
export function resetAfterCommit()
{
    log('info', 'lifecycle::resetAfterCommit');
}

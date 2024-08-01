import { log } from './log';

/** Restore anything stored in `prepareForCommit`. */
export function resetAfterCommit()
{
    log('info', 'lifecycle::resetAfterCommit');
}

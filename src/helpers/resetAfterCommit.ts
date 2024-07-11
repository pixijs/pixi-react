import { log } from './log.ts';

/** Restore anything stored in `prepareForCommit`. */
export function resetAfterCommit()
{
    log('info', 'lifecycle::resetAfterCommit');
}

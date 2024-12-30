import { log } from './log';

export function maySuspendCommit()
{
    log('info', 'lifecycle::maySuspendCommit');

    return false;
}

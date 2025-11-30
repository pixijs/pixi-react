import { log } from './log';

export function startSuspendingCommit()
{
    log('info', 'lifecycle::startSuspendingCommit');

    // https://github.com/facebook/react/pull/34486
    return null;
}

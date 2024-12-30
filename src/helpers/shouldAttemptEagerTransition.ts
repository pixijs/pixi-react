import { log } from './log';

export function shouldAttemptEagerTransition()
{
    log('info', 'lifecycle::shouldAttemptEagerTransition');

    return false;
}

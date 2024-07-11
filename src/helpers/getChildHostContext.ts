import { log } from './log.ts';

export function getChildHostContext<T>(parentHostContext: T)
{
    log('info', 'lifecycle::getChildHostContext');

    return parentHostContext;
}

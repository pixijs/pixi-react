import { log } from './log';

export function getChildHostContext<T>(parentHostContext: T)
{
    log('info', 'lifecycle::getChildHostContext');

    return parentHostContext;
}

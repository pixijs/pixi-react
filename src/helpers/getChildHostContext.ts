import { log } from './log';

export function getChildHostContext<T>(childHostContext: T)
{
    log('info', 'lifecycle::getChildHostContext');

    return childHostContext;
}

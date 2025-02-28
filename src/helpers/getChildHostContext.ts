import { NO_CONTEXT } from '../constants/NO_CONTEXT';
import { log } from './log';

export function getChildHostContext<T>(childHostContext: T)
{
    log('info', 'lifecycle::getChildHostContext');

    return childHostContext ?? NO_CONTEXT;
}

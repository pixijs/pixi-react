import { NO_CONTEXT } from '../constants/NO_CONTEXT';
import { log } from './log';

/** Retrieves the host context from the root container. */
export function getRootHostContext()
{
    log('info', 'lifecycle::getRootHostContext');

    return NO_CONTEXT;
}

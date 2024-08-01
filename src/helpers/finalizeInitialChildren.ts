import { log } from './log';

/** Applies final mutations during the render phase. */
export function finalizeInitialChildren()
{
    log('info', 'lifecycle::finalizeInitialChildren');

    return false;
}

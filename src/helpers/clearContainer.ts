import { log } from './log.ts';

/** Mutate and remove all children from a container. */
export function clearContainer()
{
    log('info', 'lifecycle::clearContainer');

    return false;
}

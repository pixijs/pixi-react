import { log } from './log.ts';

/** Called if the container is being used as a portal target. */
export function preparePortalMount()
{
    log('info', 'lifecycle::preparePortalMount');
}

import { log } from './log.ts';

/** Always throws because we don't support this. */
export function getInstanceFromScope(scope: any)
{
    log('info', 'lifecycle:getInstanceFromScope');
    throw new Error('Not yet implemented.');

    return scope;
}

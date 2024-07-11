import { log } from './log.ts';

export function getPublicInstance<T>(instance: T)
{
    log('info', 'lifecycle::getPublicInstance');

    return instance;
}

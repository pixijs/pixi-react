import { log } from './log';

export function getPublicInstance<T>(instance: T)
{
    log('info', 'lifecycle::getPublicInstance');

    return instance;
}

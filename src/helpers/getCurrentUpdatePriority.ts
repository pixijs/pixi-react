import { store } from '../store';
import { log } from './log';

export function getCurrentUpdatePriority()
{
    log('info', 'lifecycle::getCurrentUpdatePriority');

    return store.currentUpdatePriority;
}

import { store } from '../store';
import { log } from './log';

export function setCurrentUpdatePriority(newPriority: number)
{
    log('info', 'lifecycle::setCurrentUpdatePriority');

    store.currentUpdatePriority = newPriority;
}

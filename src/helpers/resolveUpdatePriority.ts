import {
    ContinuousEventPriority,
    DefaultEventPriority,
    DiscreteEventPriority,
} from 'react-reconciler/constants';
import { store } from '../store';
import { log } from './log';

export function resolveUpdatePriority()
{
    log('info', 'lifecycle::resolveUpdatePriority');

    if (store.currentUpdatePriority)
    {
        return store.currentUpdatePriority;
    }

    const globalScope = (typeof self !== 'undefined' && self) || (typeof window !== 'undefined' && window);

    if (!globalScope)
    {
        return DefaultEventPriority;
    }

    const name = globalScope.event?.type;

    switch (name)
    {
        case 'click':
        case 'contextmenu':
        case 'dblclick':
        case 'pointercancel':
        case 'pointerdown':
        case 'pointerup':
            return DiscreteEventPriority;
        case 'pointermove':
        case 'pointerout':
        case 'pointerover':
        case 'pointerenter':
        case 'pointerleave':
        case 'wheel':
            return ContinuousEventPriority;
        default:
            return DefaultEventPriority;
    }
}

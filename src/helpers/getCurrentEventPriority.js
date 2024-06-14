import {
    DefaultEventPriority,
    // DiscreteEventPriority,
    // ContinuousEventPriority,
} from 'react-reconciler/constants.js';
import { log } from './log.js';

export function getCurrentEventPriority()
{
    log('info', 'lifecycle::getCurrentEventPriority');

    return DefaultEventPriority;
    // if (typeof window === 'undefined') {
    //     return DefaultEventPriority;
    // }

    // const name = window?.event?.type;

    // switch (name) {
    //     case 'click':
    //     case 'contextmenu':
    //     case 'dblclick':
    //     case 'pointercancel':
    //     case 'pointerdown':
    //     case 'pointerup':
    //         return DiscreteEventPriority;
    //     case 'pointermove':
    //     case 'pointerout':
    //     case 'pointerover':
    //     case 'pointerenter':
    //     case 'pointerleave':
    //     case 'wheel':
    //         return ContinuousEventPriority;
    //     default:
    //         return DefaultEventPriority;
    // }
}

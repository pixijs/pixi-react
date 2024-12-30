import { log } from './log';

export function requestPostPaintCallback(
    _callback: (time: number) => void,
)
{
    log('info', 'lifecycle::requestPostPaintCallback');
}

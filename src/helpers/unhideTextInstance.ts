import { type HostConfig } from '../typedefs/HostConfig';
import { log } from './log';

/** Always throws, because we don't support this (yet). */
export function unhideTextInstance(
    _textInstance: HostConfig['textInstance'],
)
{
    log('info', 'lifecycle::unhideTextInstance');
    throw new Error('Text instances are not yet supported. Please use a `<text>` component.');
}

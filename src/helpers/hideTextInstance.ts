import { type HostConfig } from '../typedefs/HostConfig';
import { log } from './log';

/** Always throws, because we don't support this (yet). */
export function hideTextInstance(
    _textInstance: HostConfig['textInstance'],
)
{
    log('info', 'lifecycle::hideTextInstance');
    throw new Error('Text instances are not yet supported. Please use a `<text>` component.');
}

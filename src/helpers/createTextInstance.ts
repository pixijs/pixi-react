import { type PixiReactNode } from 'typedefs/PixiReactNode';
import { type HostConfig } from '../typedefs/HostConfig';
import { log } from './log';

/** Always throws, because we don't support this (yet). */
export function createTextInstance(
    _text: string,
    _rootContainer: HostConfig['containerInstance'],
    _hostContext: HostConfig['hostContext'],
    _internalHandle: any,
): PixiReactNode
{
    log('info', 'lifecycle::createTextInstance');
    throw new Error('Text instances are not yet supported. Please use a `<text>` component.');
}

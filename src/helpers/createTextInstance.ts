import { log } from './log.ts';

import type { HostConfig } from '../typedefs/HostConfig.ts';

/** Always throws, because we don't support this (yet). */
export function createTextInstance(
    _text: string,
    _rootContainer: HostConfig['containerInstance'],
    _hostContext: null,
    _internalHandle: any,
)
{
    log('info', 'lifecycle::createTextInstance');
    throw new Error('Text instances are not yet supported. Please use a `<text>` component.');

    return _rootContainer;
}

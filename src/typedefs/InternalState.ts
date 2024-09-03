import type { HostConfig } from './HostConfig';

export interface InternalState
{
    canvas?: HTMLCanvasElement;
    queuedForUnmount?: boolean;
    rootContainer: HostConfig['containerInstance'];
}

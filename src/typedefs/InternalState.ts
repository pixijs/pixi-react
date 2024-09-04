import type { HostConfig } from './HostConfig';

export interface InternalState
{
    canvas?: HTMLCanvasElement;
    rootContainer: HostConfig['containerInstance'];
}

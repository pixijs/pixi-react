import type { HostConfig } from './HostConfig.ts';

export interface InternalState
{
    canvas?: HTMLCanvasElement;
    rootContainer: HostConfig['containerInstance'];
}

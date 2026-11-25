import { type HostConfig } from './HostConfig';

export interface InternalState
{
    canvas?: HTMLCanvasElement;
    ownerDocument?: Document;
    ownerWindow?: Window;
    rootContainer: HostConfig['containerInstance'];
}

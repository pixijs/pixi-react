import { roots } from '../core/roots';

export function unqueueForUnmount(canvas: HTMLCanvasElement)
{
    const root = roots.get(canvas);

    if (root)
    {
        root.internalState.queuedForUnmount = false;
    }
}

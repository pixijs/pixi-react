import { roots } from '../core/roots';
import { unmountApplication } from './unmountApplication';

export function queueForUnmount(canvas: HTMLCanvasElement)
{
    const root = roots.get(canvas);

    if (root)
    {
        if (root.applicationState.isInitialised)
        {
            unmountApplication(root);
        }
        else
        {
            root.internalState.queuedForUnmount = true;
        }
    }
}

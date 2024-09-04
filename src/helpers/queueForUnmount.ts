import { roots } from '../core/roots';
import { store } from '../store';
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
            store.unmountQueue.add(root);
        }
    }
}

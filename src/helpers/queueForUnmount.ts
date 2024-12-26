import { roots } from '../core/roots';
import { store } from '../store';
import { unmountRoot } from './unmountRoot';

export function queueForUnmount(canvas: HTMLCanvasElement)
{
    const root = roots.get(canvas);

    if (root)
    {
        if (root.applicationState.isInitialised)
        {
            unmountRoot(root);
        }
        else
        {
            store.unmountQueue.add(root);
        }
    }
}

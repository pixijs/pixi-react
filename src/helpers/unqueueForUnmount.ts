import { roots } from '../core/roots';
import { store } from '../store';

export function unqueueForUnmount(canvas: HTMLCanvasElement)
{
    const root = roots.get(canvas);

    if (root)
    {
        store.unmountQueue.delete(root);
    }
}

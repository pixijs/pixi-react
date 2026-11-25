import { roots } from '../core/roots';
import { store } from '../store';
import { unmountRoot } from './unmountRoot';

export function queueForUnmount(canvas: HTMLCanvasElement)
{
    const root = roots.get(canvas);

    if (root)
    {
        /*
         * Always defer destroy. Immediate unmount of an initialized app races with
         * React Strict Mode, which re-runs this effect in the same tick (cleanup
         * then setup). Setup calls unqueueForUnmount; if we already destroyed, the
         * Pixi ticker/renderer are gone while the scene is still mounted.
         */
        store.unmountQueue.add(root);
        queueMicrotask(() =>
        {
            if (store.unmountQueue.has(root))
            {
                unmountRoot(root);
            }
        });
    }
}

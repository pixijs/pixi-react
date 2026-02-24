import { reconciler } from '../core/reconciler';
import { roots } from '../core/roots';
import { store } from '../store';
import { type Root } from '../typedefs/Root';

export function unmountRoot(root: Root)
{
    store.unmountQueue.delete(root);

    const fiber = root.fiber;

    if (fiber)
    {
        reconciler.updateContainer(null, fiber, null, () =>
        {
            if (root.applicationState.app)
            {
                root.applicationState.app.destroy(
                    root.applicationState.rendererDestroyOptions,
                    root.applicationState.destroyOptions
                );
                root.applicationState.onDestroy?.();
            }

            roots.delete(root.internalState.canvas!);
        });
    }
}

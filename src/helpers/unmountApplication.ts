import { reconciler } from '../core/reconciler';
import { roots } from '../core/roots';
import { type Root } from '../typedefs/Root';

export function unmountApplication(root: Root)
{
    if (root.internalState.queuedForUnmount)
    {
        const fiber = root?.fiber;

        if (fiber)
        {
            reconciler.updateContainer(null, fiber, null, () =>
            {
                try
                {
                    root.applicationState.app.destroy();
                    roots.delete(root.internalState.canvas!);
                }
                catch (error)
                {
                    /* ... */
                }
            });
        }
    }
}

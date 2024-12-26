import { store } from '../store';
import { unmountRoot } from './unmountRoot';

export function processUnmountQueue()
{
    for (const root of store.unmountQueue)
    {
        unmountRoot(root);
    }
}

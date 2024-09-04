import { store } from '../store';
import { unmountApplication } from './unmountApplication';

export function processUnmountQueue()
{
    for (const root of store.unmountQueue)
    {
        unmountApplication(root);
    }
}

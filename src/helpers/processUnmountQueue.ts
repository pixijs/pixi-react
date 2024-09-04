import { roots } from '../core/roots';
import { unmountApplication } from './unmountApplication';

export function processUnmountQueue()
{
    for (const root of roots.values())
    {
        unmountApplication(root);
    }
}

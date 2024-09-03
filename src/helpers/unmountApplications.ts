import { roots } from '../core/roots';
import { unmountApplication } from './unmountApplication';

export function unmountApplications()
{
    for (const root of roots.values())
    {
        unmountApplication(root);
    }
}

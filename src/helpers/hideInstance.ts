import { type HostConfig } from '../typedefs/HostConfig';
import { isContainer, isFilter } from './typeChecks';

export function hideInstance(
    instance: HostConfig['instance']
)
{
    if (isContainer(instance))
    {
        instance.visible = false;
    }
    else if (isFilter(instance))
    {
        instance.enabled = false;
    }
}

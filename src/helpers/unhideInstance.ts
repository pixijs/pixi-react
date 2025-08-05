import { type HostConfig } from '../typedefs/HostConfig';
import { isContainer, isFilter } from './typeChecks';

export function unhideInstance(
    instance: HostConfig['instance'],
)
{
    if (isContainer(instance))
    {
        instance.visible = true;
    }
    else if (isFilter(instance))
    {
        instance.enabled = true;
    }
}

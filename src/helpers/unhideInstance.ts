import type { Instance } from '../typedefs/Instance.ts';

export function unhideInstance(instance: Instance)
{
    instance.visible = true;
}

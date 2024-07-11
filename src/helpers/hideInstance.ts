import type { Instance } from '../typedefs/Instance.ts';

export function hideInstance(instance: Instance)
{
    instance.visible = false;
}

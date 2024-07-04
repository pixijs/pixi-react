import type { Instance } from './Instance.ts';
import type { NamespacedPixiElementsImpl } from './NamespacedPixiElementsImpl.ts';
import type { PixiElementsImpl } from './PixiElementsImpl.ts';

export interface HostConfig
{
    type: keyof PixiElementsImpl | keyof NamespacedPixiElementsImpl;
    props: Record<string, unknown>;
    container: Instance;
    instance: Instance;
    textInstance: Instance;
    suspenseInstance: Instance;
    hydratableInstance: never;
    publicInstance: Instance;
    hostContext: null;
    updatePayload: object;
    childSet: never;
    timeoutHandle: number;
    noTimeout: -1;
}

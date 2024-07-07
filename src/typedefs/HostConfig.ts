import type { Instance } from './Instance.ts';
import type { NamespacedPixiElements } from './NamespacedPixiElements.ts';
import type { PixiElements } from './PixiElements.ts';

export interface HostConfig
{
    type: keyof PixiElements | keyof NamespacedPixiElements;
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

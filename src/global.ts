import type { NamespacedPixiElementsImpl } from './typedefs/NamespacedPixiElementsImpl.ts';
import type { PixiElementsImpl } from './typedefs/PixiElementsImpl.ts';

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElementsImpl, NamespacedPixiElementsImpl {}
    }
}

export {};

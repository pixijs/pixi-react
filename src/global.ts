import type { NamespacedPixiElementsImpl } from './typedefs/NamespacedPixiElementsImpl';
import type { PixiElementsImpl } from './typedefs/PixiElementsImpl';

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace React.JSX
    {
        interface IntrinsicElements extends PixiElementsImpl, NamespacedPixiElementsImpl {}
    }
}

export {};

import type { NamespacedPixiElements } from './typedefs/NamespacedPixiElements.ts';
import type { PixiElements } from './typedefs/PixiElements.ts';

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElements, NamespacedPixiElements {}
    }
}

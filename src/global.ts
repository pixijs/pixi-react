import type { NamespacedPixiElements } from './typedefs/NamespacedPixiElements';
import type { PixiElements } from './typedefs/PixiElements';

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElements, NamespacedPixiElements {}
    }
}

import type { NamespacedPixiElements } from './typedefs/NamespacedPixiElements.ts';
import type { PixiElements } from './typedefs/PixiElements.ts';

export type { PixiReactNode } from './typedefs/PixiReactNode.ts';

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElements, NamespacedPixiElements {}
    }
}

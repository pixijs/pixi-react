import type { PixiElementsImpl } from './typedefs/PixiElementsImpl';

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace React.JSX
    {
        interface IntrinsicElements extends PixiElementsImpl {}
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace PixiMixins
    {
        interface Container
        {
            __handlers: Record<string, (...args: any[]) => any>;
            busy: boolean;
        }
    }
}

export {};

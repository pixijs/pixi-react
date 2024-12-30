import { type NamespacedPixiElements } from './typedefs/NamespacedPixiElements';
import { type PixiElements } from './typedefs/PixiElements';

import type {} from 'react';
import type {} from 'react/jsx-dev-runtime';
import type {} from 'react/jsx-runtime';

declare module 'react'
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElements, NamespacedPixiElements {}
    }
}

declare module 'react/jsx-runtime'
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElements, NamespacedPixiElements {}
    }
}

declare module 'react/jsx-dev-runtime'
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX
    {
        interface IntrinsicElements extends PixiElements, NamespacedPixiElements {}
    }
}

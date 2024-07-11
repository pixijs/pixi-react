import type { ConstructorOptions } from './ConstructorOptions.ts';
import type { Overwrite } from './Overwrite.ts';
import type { PixiReactNodeProps } from './PixiReactNodeProps.ts';

export type PixiReactNode<T extends abstract new (...args: any) => any> =
    Overwrite<Partial<ConstructorOptions<T>>, PixiReactNodeProps<InstanceType<T>>>;

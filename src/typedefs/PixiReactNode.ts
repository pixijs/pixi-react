import type { ConstructorParams } from './ConstructorParams.ts';
import type { Overwrite } from './Overwrite.ts';
import type { PixiReactNodeProps } from './PixiReactNodeProps.ts';

export type PixiReactNode<T extends abstract new (...args: any) => any> = Overwrite<Partial<ConstructorParams<T>>, PixiReactNodeProps<InstanceType<T>>>;

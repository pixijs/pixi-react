import type { ConstructorParams } from './ConstructorParams.ts';
import type { NodeProps } from './NodeProps.ts';
import type { Overwrite } from './Overwrite.ts';

export declare type Node<T extends abstract new (...args: any) => any> = Overwrite<Partial<ConstructorParams<T>>, NodeProps<InstanceType<T>>>;

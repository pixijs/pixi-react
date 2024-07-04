import type { NonFunctionKeys } from './NonFunctionKeys.ts';

export declare type Overwrite<T, O> = T extends undefined ? never : Omit<T, NonFunctionKeys<O>> & O;

export type ConstructorParams<T extends abstract new (...args: any) => any> = T extends new (...args: infer A) => any ? A[0] : never;

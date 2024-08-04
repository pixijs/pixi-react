export type ExcludeFunctionProps<T> = {
    [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
};

export type OmitKeys<T1, T2> = {
    [K in keyof T1 as K extends keyof T2 ? never : K]: T1[K];
};

export type OmitChildren<T> = T extends undefined ? never : Omit<T, 'children'>;

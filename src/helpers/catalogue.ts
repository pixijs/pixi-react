import type { Instance } from '../typedefs/Instance';

export const catalogue: {
    [name: string]: {
        new (...args: any): Instance
    }
} = {};

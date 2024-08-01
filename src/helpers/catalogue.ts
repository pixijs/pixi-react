import type { HostConfig } from '../typedefs/HostConfig';

export const catalogue: {
    [name: string]: {
        new (...args: any): HostConfig['instance'],
    }
} = {};

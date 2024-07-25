import type { HostConfig } from '../typedefs/HostConfig.ts';

export const catalogue: {
    [name: string]: {
        new (...args: any): HostConfig['instance'],
    }
} = {};

import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
    {
        test: {
            environment: 'jsdom',
            include: ['test/unit/**/*.test.ts'],
            pool: 'forks',
        },
    },
]);

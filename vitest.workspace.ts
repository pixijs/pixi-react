import { defineWorkspace } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineWorkspace([
    {
        plugins: [react()],
        test: {
            environment: 'jsdom',
            include: ['test/unit/**/*.test.ts?(x)'],
            pool: 'forks',
        },
    },
    {
        plugins: [react()],
        test: {
            browser: {
                enabled: true,
                name: 'chromium',
                provider: 'playwright',
            },
            globals: true,
            include: ['test/e2e/**/*.test.ts(x)'],
            setupFiles: [
                './vitest.setup.ts'
            ],
        },
    },
]);

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getJestConfig = (merge = {}) =>
{
    const { setupFiles = [], ...rest } = merge;

    return {
        collectCoverage: false,
        setupFiles: [
            'jest-webgl-canvas-mock',
            ...setupFiles,
        ],
        setupFilesAfterEnv: ['jest-extended/all'],
        testEnvironment: 'jsdom',
        watchPlugins: [
            'jest-watch-typeahead/filename',
            'jest-watch-typeahead/testname'
        ],
        transform: {
            '\\.[jt]sx?$': `${__dirname}/babelJestTransformer.mjs`
        },
        ...rest
    };
};

export const getJestTSConfig = (merge = {}) =>
{
    const { setupFiles = [], ...rest } = merge;

    return {
        preset: 'ts-jest',
        collectCoverage: false,
        setupFiles: [
            'jest-webgl-canvas-mock',
            ...setupFiles,
        ],
        setupFilesAfterEnv: ['jest-extended/all'],
        testEnvironment: 'jsdom',
        watchPlugins: [
            'jest-watch-typeahead/filename',
            'jest-watch-typeahead/testname'
        ],
        ...rest
    };
};

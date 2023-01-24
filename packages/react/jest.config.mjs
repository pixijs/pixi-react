import { getJestConfig } from '../../shared/getJestConfig.mjs';

const jestConfig = getJestConfig({
    roots: [
        'test'
    ],
    setupFiles: [
        '<rootDir>/test/bootstrap.js',
        '<rootDir>/test/__mocks__/matchMediaMock.js'
    ]
});

export default jestConfig;

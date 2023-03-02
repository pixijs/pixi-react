import { getJestTSConfig } from '../../shared/getJestConfig.mjs';

const jestConfig = getJestTSConfig({
    roots: ['test'],
    setupFiles: ['<rootDir>/test/bootstrap.ts', '<rootDir>/test/__mocks__/matchMediaMock.ts'],
});

export default jestConfig;

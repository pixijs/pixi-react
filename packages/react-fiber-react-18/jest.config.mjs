import { getJestTSConfig } from '../../shared/getJestConfig.mjs';

const jestConfig = getJestTSConfig({
    roots: [
        'test'
    ],
});

export default jestConfig;

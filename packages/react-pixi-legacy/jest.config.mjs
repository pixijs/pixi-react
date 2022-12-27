import { getJestConfig } from '../../shared/getJestConfig.mjs';

const jestConfig = getJestConfig({
    roots: [
        'test'
    ]
});

export default jestConfig;

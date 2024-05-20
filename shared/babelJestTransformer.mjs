import babelJest from 'babel-jest';

const babelJestTransformer = babelJest.createTransformer({
    rootMode: 'upward'
});

export default babelJestTransformer;

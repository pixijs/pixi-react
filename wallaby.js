// const path = require('path')

module.exports = (wallaby) =>
    ({
        files: [
            'src/**/*.js',
            'package.json',
            'test/__fixtures__/**/*',
            'test/__utils__/**/*',
            'test/bootstrap.js',
            'test/__mocks__/**/*',
        ],
        tests: [
            'test/**/*.js',
            '!test/bootstrap.js',
            '!test/__fixtures__/**/*',
            '!test/__utils__/**/*',
            '!test/__mocks__/**/*',
        ],

        compilers: {
            '**/*.js?(x)': wallaby.compilers.babel(),
        },

        env: {
            type: 'node',
        },

        testFramework: 'jest',
    });

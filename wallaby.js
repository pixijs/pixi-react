// const path = require('path')

module.exports = function (wallaby) {
  return {
    files: ['src/**/*.js', 'package.json', 'test/__fixtures__/**/*', 'test/__utils__/**/*', 'test/bootstrap.js'],
    tests: ['test/**/*.js', '!test/bootstrap.js', '!test/__fixtures__/**/*', '!test/__utils__/**/*'],

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel(),
    },

    env: {
      type: 'node',
    },

    testFramework: 'jest',

    setup: function () {
      const jestConfig = require('./package.json').jest
      jestConfig.setupFiles = ['jest-webgl-canvas-mock', './test/bootstrap.js']

      wallaby.testFramework.configure(jestConfig)
    },
  }
}

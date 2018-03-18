module.exports = function(wallaby) {
  return {
    files: ['src/**/*.js', 'package.json', 'test/__fixtures__/**/*', 'test/__utils__/**/*'],
    tests: ['test/**/*.js', '!test/bootstrap.js', '!test/__fixtures__/**/*', '!test/__utils__/**/*'],

    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel(),
    },

    env: {
      type: 'node',
    },

    testFramework: 'jest',

    debug: true,
  }
}

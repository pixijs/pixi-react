import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import json from 'rollup-plugin-json'
import replace from 'rollup-plugin-replace'
import globals from 'rollup-plugin-node-globals'
import uglify from 'rollup-plugin-uglify'
import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'

const nodeEnv = process.env.NODE_ENV || 'production'
const production = nodeEnv === 'production'
const libraryName = 'react-pixi'
const outputFile = format => `dist/${libraryName}.${nodeEnv}.${format}.js`

export default {
  input: 'src/index.js',
  output: [
    {
      file: outputFile('umd'), name: upperFirst(camelCase(libraryName)),
      format: 'umd',
      globals: { 'pixi.js': 'PIXI', 'react': 'React' },
      sourcemap: !production
    },
    {
      file: outputFile('es5'),
      format: 'es'
    },
  ],
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve({
      browser: true,
      jsnext: true,
      main: true,
    }),
    commonjs({
      ignoreGlobal: false,
    }),
    replace({
      __DEV__: production ? 'false' : 'true',
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
    }),
    sourceMaps(),
    globals(),
    production && uglify()
  ],
  external: [
    'pixi.js',
    'react',
    'react-dom'
  ]
}

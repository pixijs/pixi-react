import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import globals from 'rollup-plugin-node-globals'

const prod = process.env.NODE_ENV === 'production'

function getConfig(dest, format) {
  return {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: dest,
      format,
      name: 'ReactPixi',
      sourcemap: !prod,
      globals: {
        'pixi.js': 'PIXI',
        'react': 'React'
      },
    },
    plugins: [
      json(),
      babel({ exclude: 'node_modules/**' }),
      resolve({
        browser: true,
        jsnext: true,
        main: true,
      }),
      commonjs({
        ignoreGlobal: false
      }),
      replace({
        __DEV__: prod ? 'false' : 'true',
        'process.env.NODE_ENV': prod ? '"production"' : '"development"',
      }),
      globals(),
      prod && terser(),
      filesize(),
    ].filter(Boolean),
    external: [
      'pixi.js',
      'react',
      'react-dom'
    ]
  }
}

const buildType = prod ? '' : '-dev'

const configs = [
  getConfig(`dist/react-pixi.cjs${buildType}.js`, 'cjs'),
  getConfig(`dist/react-pixi.umd${buildType}.js`, 'umd'),
  getConfig(`dist/react-pixi.module${buildType}.js`, 'es'),
]

export default configs

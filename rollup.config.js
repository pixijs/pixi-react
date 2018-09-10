import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import globals from 'rollup-plugin-node-globals'

const prod = process.env.NODE_ENV === 'production'

function getConfig(dest, format, ugly) {
  return {
    input: 'src/index.js',
    output: {
      exports: 'named',
      file: dest,
      format,
      name: 'react-pixi',
      sourcemap: !prod,
      globals: { 'pixi.js': 'PIXI', 'react': 'React' },
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
      ugly && terser(),
      filesize(),
    ].filter(Boolean),
    external: [
      'pixi.js',
      'react',
      'react-dom'
    ]
  }
}

export default [
  getConfig(`dist/reaxt-pixi${!prod ? '.dev' : ''}.js`, 'cjs', false),
  getConfig(`dist/react-pixi.umd${!prod ? '-dev' : ''}.js`, 'umd', true),
  getConfig(`dist/react-pixi.module${!prod ? '-dev' : ''}.js`, 'es', false),
]

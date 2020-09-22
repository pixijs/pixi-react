import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import json from 'rollup-plugin-json'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import globals from 'rollup-plugin-node-globals'
import alias from '@rollup/plugin-alias'

const prod = process.env.NODE_ENV === 'production'
const format = process.env.FORMAT

function getConfig(dest, format, merge = {}) {
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
        react: 'React',
        '@react-spring/animated': 'Animated',
      },

      ...(merge.output || {}),
    },
    plugins: [
      json(),
      babel({ exclude: 'node_modules/**' }),
      ...(merge.beforePlugins || []),
      resolve({
        browser: true,
        mainFields: ['main', 'jsnext'],
      }),
      commonjs({
        ignoreGlobal: false,
        namedExports: {
          'node_modules/scheduler/index.js': ['unstable_scheduleCallback', 'unstable_cancelCallback'],
        },
      }),
      replace({
        __DEV__: prod ? 'false' : 'true',
        'process.env.NODE_ENV': prod ? '"production"' : '"development"',
      }),
      globals(),
      ...(merge.afterPlugins || []),
      prod && terser(),
      filesize(),
    ].filter(Boolean),
    external: ['pixi.js', 'react', 'react-dom'],
  }
}

const buildType = prod ? '' : '-dev'

const aliasReactSpring = {
  beforePlugins: [
    alias({
      entries: [{ find: '@react-spring/animated', replacement: './react-spring-create-host.js' }],
    }),
  ],
}

export default format
  ? [
      getConfig(`dist/react-pixi.${format}${buildType}.js`, format, aliasReactSpring),
      getConfig(`dist/react-pixi.react-spring.${format}${buildType}.js`, format),
    ]
  : ['cjs', 'umd', 'es']
      .map(format => getConfig(`dist/react-pixi.${format}${buildType}.js`, format, aliasReactSpring))
      .concat(getConfig(`dist/react-pixi.react-spring.umd${buildType}.js`, 'umd'))

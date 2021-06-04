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
    input: merge.input || 'src/index.js',
    output: {
      exports: 'named',
      file: dest,
      format,
      name: 'ReactPixi',
      sourcemap: !prod,
      globals: {
        'pixi.js': 'PIXI',
        'pixi.js-legacy': 'PIXI',
        react: 'React',
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
          '@react-spring/animated': ["createHost"]
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
    external: ['pixi.js', 'pixi.js-legacy', 'react', 'react-dom'],
  }
}

const buildType = prod ? '' : '-dev'

let builds = []

if (format) {
  builds.push(
    getConfig(`dist/react-pixi.${format}${buildType}.js`, format, {
      beforePlugins: [alias({ entries: { '@react-spring/animated': './react-spring-create-host.js' } })],
    })
  )
} else {
  ;['cjs', 'umd', 'es'].forEach(format => {
    builds.push(
      // default
      getConfig(`dist/react-pixi.${format}${buildType}.js`, format, {
        beforePlugins: [alias({ entries: { '@react-spring/animated': './react-spring-create-host.js' } })],
      }),

      // animated
      getConfig(`animated/react-pixi.${format}${buildType}.js`, format, { input: 'src/index-animated.js' }),

      // pixi legacy
      getConfig(`legacy/react-pixi.${format}${buildType}.js`, format, {
        beforePlugins: [
          alias({ entries: { '@react-spring/animated': './react-spring-create-host.js' } }),
          babel({
            plugins: [['module-resolver', { alias: { 'pixi.js': 'pixi.js-legacy' } }]],
          }),
        ],
      })
    )
  })
}

export default builds

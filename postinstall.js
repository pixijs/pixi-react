const replace = require('replace-in-file')
const path = require('path')

console.log('correct react-spring sideEffects. Remove this script once newer version of react-spring comes out.')
const removeAllSideEffectsFalseFromReactSpringPackages = async () => {
  try {
    const results = await replace({
      files: path.join(process.cwd(), 'node_modules/@react-spring/*/package.json'),
      from: `"sideEffects": false`,
      to: `"sideEffects": true`,
    })
  } catch (e) {
    console.log('skipped replacing `sideEffects` in react-spring as this package is not yet installed.')
    console.log("If you're installing `react-spring@9x` later on, make sure to patch it for @inlet/react-pixi.")
    console.log('\tRun: `node ./node_modules/@inlet/react-pixi/postinstall.js` from your project root.')
  }
}

removeAllSideEffectsFalseFromReactSpringPackages()

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

    // console.log(results); // uncomment to log changed files
  } catch (e) {
    console.log('error while trying to remove string "sideEffects:false" from react-spring packages', e)
  }
}

removeAllSideEffectsFalseFromReactSpringPackages()

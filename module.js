const __DEV__ = process.env.NODE_ENV === 'development'

module.exports = __DEV__
  ? require('./dist/react-pixi.development.es5.js')
  : require('./dist/react-pixi.production.es5.js')

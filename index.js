const __DEV__ = process.env.NODE_ENV === 'development'

module.exports = __DEV__
  ? require('./dist/react-pixi.development.umd.js')
  : require('./dist/react-pixi.production.umd.js')

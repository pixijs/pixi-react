const __DEV__ = process.env.NODE_ENV === 'development'

module.exports = __DEV__ ? require('./dist/react-pixi.module-dev.js') : require('./dist/react-pixi.module.js')

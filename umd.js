module.exports =
  process.env.NODE_ENV === 'development'
    ? require('./dist/react-pixi.umd-dev.js')
    : require('./dist/react-pixi.umd.js')

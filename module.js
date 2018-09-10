module.exports =
  process.env.NODE_ENV === 'development'
    ? require('./dist/react-pixi.module-dev.js')
    : require('./dist/react-pixi.module.js')

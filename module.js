if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dist/react-pixi.module-dev')
} else {
  module.exports = require('./dist/react-pixi.module')
}

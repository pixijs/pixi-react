if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dist/react-pixi.cjs-dev')
} else {
  module.exports = require('./dist/react-pixi.cjs')
}

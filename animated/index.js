if (process.env.NODE_ENV === 'development') {
  module.exports = require('./react-pixi.cjs-dev')
} else {
  module.exports = require('./react-pixi.cjs')
}

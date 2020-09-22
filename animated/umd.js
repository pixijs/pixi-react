if (process.env.NODE_ENV === 'development') {
  module.exports = require('./react-pixi.umd-dev')
} else {
  module.exports = require('./react-pixi.umd')
}

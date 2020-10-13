if (process.env.NODE_ENV === 'development') {
  module.exports = require('./react-pixi.es-dev')
} else {
  module.exports = require('./react-pixi.es')
}

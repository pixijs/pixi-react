/* eslint-disable global-require */
if (process.env.NODE_ENV === 'development')
{
    module.exports = require('./dist/index.es-dev');
}
else
{
    module.exports = require('./dist/index.es');
}

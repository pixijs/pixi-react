/* eslint-disable global-require */
if (['test', 'development'].includes(process.env.NODE_ENV))
{
    module.exports = require('./dist/index.es-dev');
}
else
{
    module.exports = require('./dist/index.es');
}

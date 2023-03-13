/* eslint-disable global-require */
if (process.env.NODE_ENV === 'development')
{
    module.exports = require('./dist/index.cjs-dev');
}
else
{
    module.exports = require('./dist/index.cjs');
}

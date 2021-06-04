// Docz build breaks if a "repository" field is set in package.json
// temp. workaround: we simply remove it before building it

const p = require('./package.json')
delete p.repository

require('fs').writeFileSync('./package.json', JSON.stringify(p, null, 2), { encoding: 'utf-8' })

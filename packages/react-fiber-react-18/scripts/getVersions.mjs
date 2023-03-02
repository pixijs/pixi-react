#!/usr/bin/env node
// setting rootDir to ./src in tsconfig.json means we can't import these from the project root
// so write them locally for importing
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// doesn't work in CI
// import rootPackageJson from '../../../package.json' assert { type: 'json' };
// import packageJson from '../package.json' assert { type: 'json' };

const rootPackageJson = JSON.parse(readFileSync(resolve(__dirname, '..', '..', '..', 'package.json'), 'utf8'));
const packageJson = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8'));

const versions = {
    REACT_DOM_VERSION: rootPackageJson.dependencies['react-dom'].replace(/[^0-9.]/g, ''),
    PACKAGE_NAME: packageJson.name,
};

writeFileSync('./src/data.json', JSON.stringify(versions, null, 2), 'utf8');

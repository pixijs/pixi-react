#!/usr/bin/env node
// Typescript renames the reference to `./global.d.ts to an absolute path to the source folder during compilation, we want
// to copy the file over (done by rollup during build) and then rewrite this path back to a relative one. We output type
// declarations using tsc so we can't leverage rollup to do this
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

// relative to this script file
const OUTPUT_PATH = '../react-components/v7/dist/types';
const declarationPath = resolve(OUTPUT_PATH, 'index.d.ts');
const contents = readFileSync(declarationPath, 'utf8');

console.log(`attempting to rewrite global.d.ts reference at ${declarationPath}`);

const newContents = contents.replace(
    '/// <reference types="packages/react-components-pixi-7/src/global" />',
    '/// <reference types="./global" />',
);

writeFileSync(declarationPath, newContents, 'utf8');

console.log('rewritten reference to global.d.ts');

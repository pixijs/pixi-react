#!/usr/bin/env node
import dirTree from 'directory-tree';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

// utility to log out directory structure of build files beneath dist directories, to help debug issues on CI
const __dirname = dirname(fileURLToPath(import.meta.url));
const packagesPath = resolve(__dirname, '..', 'packages');

// annoyingly only supports exclude rather than include
const tree = dirTree(packagesPath, {
    exclude: /(node_modules|docs|sandbox|test|src|scripts|react-fiber-react-18|react-components-pixi-7)/,
    extensions: /\.(js|ts)$/
});

console.log(JSON.stringify(tree, null, 2));

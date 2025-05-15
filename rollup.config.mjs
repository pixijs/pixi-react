import path from 'node:path';
import esbuild from 'rollup-plugin-esbuild';
import injectProcessEnv from 'rollup-plugin-inject-process-env';
import peerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import repo from './package.json' with { type: 'json' };
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

const moduleTarget = 'es2020';
const paths = {
    distributable: path.join(process.cwd(), 'dist'),
    library: path.join(process.cwd(), 'lib'),
    source: path.join(process.cwd(), 'src'),
};

const {
    dependencies = {},
} = repo;

const plugins = ({ env, esmExternals = false } = {}) => [
    json(),
    esbuild({ target: moduleTarget, minify: env === 'production' }),
    sourcemaps(),
    commonjs({ esmExternals }),
    ...(env ? [injectProcessEnv({
        NODE_ENV: env
    })] : []),
    resolve({
        browser: true,
        preferBuiltins: false,
    }),
    peerDepsExternalPlugin(),
];

/**
 * Escapes the `RegExp` special characters.
 * @param {string} str
 */
function escapeRegExp(str)
{
    return str.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');
}

/**
 * Convert the name of a package to a `RegExp` that matches the package's export names.
 * @param {string} packageName
 */
function convertPackageNameToRegExp(packageName)
{
    return new RegExp(`^${escapeRegExp(packageName)}(/.+)?$`);
}

const external = ({ bundleDeps = false } = {}) => (bundleDeps ? [] : Object.keys(dependencies).map(convertPackageNameToRegExp));

const targets = {
    lib: {
        path: paths.library,
        entryFileNames: '[name]',
        env: undefined,
        external: external(),
        preserveModules: true,
        esmExternals: false,
    },
    'dist-dev': {
        path: paths.distributable,
        entryFileNames: 'pixi-react',
        env: 'development',
        external: external({ bundleDeps: true }),
        preserveModules: false,
        esmExternals: true,
    },
    'dist-prod': {
        path: paths.distributable,
        entryFileNames: 'pixi-react.min',
        env: 'production',
        external: external({ bundleDeps: true }),
        preserveModules: false,
        esmExternals: true,
    },
};

export default ['lib', 'dist-dev', 'dist-prod'].map((target) =>
    ({
        input: 'src/index.ts',
        output: [
            {
                dir: targets[target].path,
                entryFileNames: `${targets[target].entryFileNames}.js`,
                exports: 'named',
                format: 'cjs',
                preserveModules: targets[target].preserveModules,
                preserveModulesRoot: paths.source,
                sourcemap: true,
            },
            {
                dir: targets[target].path,
                entryFileNames: `${targets[target].entryFileNames}.mjs`,
                exports: 'named',
                format: 'esm',
                preserveModules: targets[target].preserveModules,
                preserveModulesRoot: paths.source,
                sourcemap: true,
            },
        ],
        plugins: plugins({ env: targets[target].env, esmExternals: targets[target].esmExternals }),
        external: targets[target].external,
        treeshake: false
    }));

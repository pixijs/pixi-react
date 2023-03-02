import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import sourcemaps from 'rollup-plugin-sourcemaps';
import filesize from 'rollup-plugin-filesize';
import { visualizer } from 'rollup-plugin-visualizer';

export const isProductionBuild = () => process.env.NODE_ENV === 'production';

export const getBuildFormat = () => process.env.FORMAT;

export function getRollupConfig(dest, format, merge = {})
{
    const prod = isProductionBuild();

    return {
        input: merge.input || 'src/index.js',
        output: {
            exports: 'named',
            file: dest,
            format,
            sourcemap: !prod,
            ...(merge.output || {}),
        },
        plugins: [
            json(),
            resolve({
                browser: true,
                preferBuiltins: false,
                mainFields: ['main', 'jsnext'],
            }),
            babel({
                rootMode: 'upward',
                babelHelpers: 'runtime',
                exclude: '**/node_modules/**',
                ...(merge.babelOptions || {}),
            }),
            ...(merge.beforePlugins || []),
            commonjs(),
            replace({
                __DEV__: prod ? 'false' : 'true',
                'process.env.NODE_ENV': prod ? '"production"' : '"development"',
                preventAssignment: true,
            }),
            prod && terser(),
            filesize(),
            visualizer(),
        ].filter(Boolean),
        external: merge.external,
    };
}

export function getRollupTSConfig(dest, format, merge = {})
{
    const prod = isProductionBuild();

    return {
        input: merge.input || 'src/index.ts',
        output: {
            exports: 'named',
            file: dest,
            format,
            sourcemap: !prod,
            ...(merge.output || {}),
        },
        plugins: [
            sourcemaps(),
            json(),
            resolve({
                browser: true,
                preferBuiltins: false,
                mainFields: ['main', 'jsnext'],
            }),
            esbuild({
                exclude: '**/node_modules/**',
                target: 'es2017',
                minify: prod,
            }),
            ...(merge.beforePlugins || []),
            commonjs(),
            replace({
                __DEV__: prod ? 'false' : 'true',
                'process.env.NODE_ENV': prod ? '"production"' : '"development"',
                preventAssignment: true,
            }),
            filesize(),
            visualizer(),
        ].filter(Boolean),
        external: merge.external,
    };
}

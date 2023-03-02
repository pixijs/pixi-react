import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';

import { getBuildFormat, getRollupTSConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const format = getBuildFormat();
const buildType = isProductionBuild() ? '' : '-dev';

const external = [
    '@babel/runtime',
    '@pixi/react-invariant',
    '@pixi/app',
    '@pixi/assets',
    '@pixi/constants',
    '@pixi/core',
    '@pixi/display',
    '@pixi/events',
    '@pixi/extensions',
    '@pixi/graphics',
    '@pixi/math',
    '@pixi/mesh',
    '@pixi/mesh-extras',
    '@pixi/particle-container',
    '@pixi/sprite',
    '@pixi/sprite-animated',
    '@pixi/sprite-tiling',
    '@pixi/text',
    '@pixi/text-bitmap',
    '@pixi/ticker',
    'prop-types',
    'react',
    'react-dom',
];

let builds;

const mergeOptions = {
    beforePlugins: [
        alias({
            entries: {
                '@react-spring/animated': '../../shared/react-spring-create-host.js',
            },
        }),
        copy({
            targets: [
                { src: 'src/global.d.ts', dest: '../react-components/v7/dist/types' }
            ]
        })
    ],
    external,
};

if (format)
{
    builds = [
        getRollupTSConfig(`../react-components/v7/dist/index.${format}${buildType}.js`, format, mergeOptions),
    ];
}
else
{
    builds = ['cjs', 'es'].map((format) =>
        getRollupTSConfig(`../react-components/v7/dist/index.${format}${buildType}.js`, format, mergeOptions),
    );
}

export default builds;

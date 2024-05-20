import alias from '@rollup/plugin-alias';

import {
    getBuildFormat,
    getRollupConfig,
    isProductionBuild,
} from '../../shared/getRollupConfig.mjs';

const format = getBuildFormat();
const buildType = isProductionBuild() ? '' : '-dev';

const external = [
    '@babel/runtime',
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

if (format)
{
    builds = [
        getRollupConfig(`dist/index.${format}${buildType}.js`, format, {
            beforePlugins: [
                alias({
                    entries: {
                        '@react-spring/animated':
                            '../../shared/react-spring-create-host.js',
                    },
                }),
            ],
            external,
        }),
    ];
}
else
{
    builds = ['cjs', 'es'].map((format) =>
        getRollupConfig(`dist/index.${format}${buildType}.js`, format, {
            beforePlugins: [
                alias({
                    entries: {
                        '@react-spring/animated':
                            '../../shared/react-spring-create-host.js',
                    },
                }),
            ],
            external,
        })
    );
}

export default builds;

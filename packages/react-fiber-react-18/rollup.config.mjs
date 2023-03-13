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
    '@pixi/react-invariant',
    'react',
    'react-dom',
];

let builds;

if (format)
{
    builds = [
        getRollupConfig(`../react-fiber/v18/dist/index.${format}${buildType}.js`, format, {
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
        getRollupConfig(`../react-fiber/v18/dist/index.${format}${buildType}.js`, format, {
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

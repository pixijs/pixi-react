import {
    getBuildFormat,
    getRollupTSConfig,
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
        getRollupTSConfig(
            `../react-fiber/v18/dist/index.${format}${buildType}.js`,
            format,
            {
                external,
            }
        ),
    ];
}
else
{
    builds = ['cjs', 'es'].map((format) =>
        getRollupTSConfig(
            `../react-fiber/v18/dist/index.${format}${buildType}.js`,
            format,
            {
                external,
            }
        )
    );
}

export default builds;

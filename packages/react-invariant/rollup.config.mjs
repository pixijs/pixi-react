import {
    getBuildFormat,
    getRollupTSConfig,
    isProductionBuild,
} from '../../shared/getRollupConfig.mjs';

const format = getBuildFormat();
const buildType = isProductionBuild() ? '' : '-dev';

const external = [
    '@babel/runtime',
];

let builds;

if (format)
{
    builds = [
        getRollupTSConfig(`dist/index.${format}${buildType}.js`, format, {
            external,
        }),
    ];
}
else
{
    builds = ['cjs', 'es'].map((format) =>
        getRollupTSConfig(`dist/index.${format}${buildType}.js`, format, {
            external,
        })
    );
}

export default builds;

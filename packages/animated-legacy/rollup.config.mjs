import { getRollupConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const buildType = isProductionBuild() ? '' : '-dev';

const builds = ['cjs', 'es'].map(
    format => getRollupConfig(
        `dist/index.${format}${buildType}.js`,
        format,
        {
            external: ['@pixi/react-pixi-legacy'],
            babelOptions: {
                plugins: [['module-resolver', { alias: { '@pixi/react-pixi': '@pixi/react-pixi-legacy' } }]]
            }
        }
    )
);

export default builds;

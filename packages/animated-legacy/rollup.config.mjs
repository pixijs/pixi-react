import { getRollupConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const buildType = isProductionBuild() ? '' : '-dev';

const builds = ['cjs', 'es'].map(
    (format) => getRollupConfig(
        `dist/index.${format}${buildType}.js`,
        format,
        {
            external: ['@pixi/react-legacy'],
            babelOptions: {
                plugins: [['module-resolver', { alias: { '@pixi/react': '@pixi/react-legacy' } }]]
            }
        }
    )
);

export default builds;

import { getRollupConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const buildType = isProductionBuild() ? '' : '-dev';

const builds = ['cjs', 'es'].map(
    (format) => getRollupConfig(
        `dist/index.${format}${buildType}.js`,
        format,
        {
            external: [
                '@pixi/react',
                'pixi.js',
                'react',
                'react-dom',
                'react-spring'
            ]
        }
    )
);

export default builds;

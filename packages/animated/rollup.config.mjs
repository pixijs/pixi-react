import { getRollupTSConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const buildType = isProductionBuild() ? '' : '-dev';

const external =  [
    '@pixi/react',
    '@pixi/app',
    '@pixi/core',
    '@pixi/display',
    '@pixi/graphics',
    '@pixi/math',
    '@pixi/mesh-extras',
    '@pixi/text',
    '@pixi/text-bitmap',
    '@pixi/ticker',
    '@pixi/sprite',
    '@pixi/sprite-tiling',
    '@pixi/sprite-animated',
    '@pixi/particle-container',
    '@react-spring/animated',
    'react',
    'react-dom',
    'react-spring'
];

const builds = ['cjs', 'es'].map(
    (format) => getRollupTSConfig(
        `dist/index.${format}${buildType}.js`,
        format,
        { external }
    )
);

export default builds;

import alias from '@rollup/plugin-alias';

import { getRollupConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const buildType = isProductionBuild() ? '' : '-dev';

const builds = ['cjs', 'es'].map(
    (format) => getRollupConfig(`dist/index.${format}${buildType}.js`, format, {
        beforePlugins: [
            alias({ entries: { '@react-spring/animated': '../../shared/react-spring-create-host.js' } })
        ],
        babelOptions: {
            plugins: [['module-resolver', { alias: { 'pixi.js': 'pixi.js-legacy' } }]]
        }
    })
);

export default builds;

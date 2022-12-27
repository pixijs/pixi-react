import alias from '@rollup/plugin-alias';

import { getBuildFormat, getRollupConfig, isProductionBuild } from '../../shared/getRollupConfig.mjs';

const format = getBuildFormat();
const buildType = isProductionBuild() ? '' : '-dev';

let builds;

if (format) {
    builds = [
        getRollupConfig(`dist/index.${format}${buildType}.js`, format, {
            beforePlugins: [
                alias({ entries: { '@react-spring/animated': '../../shared/react-spring-create-host.js' } })
            ]
        })
    ];
} else {
    builds = ['cjs', 'es'].map(
        format => getRollupConfig(`dist/index.${format}${buildType}.js`, format, {
            beforePlugins: [
                alias({ entries: { '@react-spring/animated': '../../shared/react-spring-create-host.js' } })
            ]
        })
    );
}

export default builds;

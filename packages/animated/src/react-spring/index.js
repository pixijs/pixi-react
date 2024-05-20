import { applyDefaultProps, TYPES } from '@pixi/react';
import { createHost } from '@react-spring/animated';
const primitives = Object.keys(TYPES);

const host = createHost(primitives, {
    // eslint-disable-next-line consistent-return
    applyAnimatedValues(instance, props)
    {
        if (!(instance.nodeType || instance.pluginName))
        {
            return false;
        }
        const applyProps = typeof instance?.applyProps === 'function' ? instance.applyProps : applyDefaultProps;

        applyProps(instance, {}, props);
    },
});

const animated = host.animated;

export { animated };

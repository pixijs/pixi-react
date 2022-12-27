import { TYPES, applyDefaultProps } from '@pixi/react-pixi';
import { createHost } from '@react-spring/animated';
const primitives = Object.keys(TYPES);

const host = createHost(primitives, {
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

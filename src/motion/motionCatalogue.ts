import { catalogue } from '../helpers/catalogue';
import { createMotionComponent, type PixiMotionComponent, type SupportedElements } from './createMotionComponent';

export const motionCatalogue = new Proxy<Record<SupportedElements, PixiMotionComponent<SupportedElements>>>({} as any, {
    get(target, prop: string)
    {
        if (!(prop in target))
        {
            if (prop in catalogue)
            {
                throw new Error(`${prop} is part of the PIXI namespace, but is not part of the motion namespace! Did you forget to extendMotion?`);
            }
            else
            {
                throw new Error(`${prop} is not part of the motion namespace! Did you forget to extendMotion?`);
            }
        }

        return target[prop as SupportedElements];
    },
    set(target: any, prop: string, value: any)
    {
        if (typeof prop === 'string')
        {
            const component = createMotionComponent(`pixi${prop}` as SupportedElements);

            target[prop.toLowerCase()] = component;
            target[`pixi${prop}`] = component;
        }
        else
        {
            target[prop] = value;
        }

        return true;
    }
});

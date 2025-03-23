import { extend } from '../helpers/extend';
import { motionCatalogue } from './motionCatalogue';

export function extendMotion(objects: {
    [key: string]: new (...args: any) => any },
)
{
    Object.assign(motionCatalogue, objects);
    extend(objects);
}

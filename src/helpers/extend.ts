import { catalogue } from './catalogue';

export function extend(objects: { [key: string]: new (...args: any) => any })
{
    Object.assign(catalogue, objects);
}

import { catalogue } from './catalogue.ts';

export function extend(objects: { [key: string]: new (...args: any) => any })
{
    Object.assign(catalogue, objects);
}

import { type UnprefixedPixiElements } from './UnprefixedPixiElements';

export type PrefixedPixiElements = {
    [K in keyof UnprefixedPixiElements as `pixi${Capitalize<string & K>}`]: UnprefixedPixiElements[K];
};

import {
    describe,
    expect,
    it,
} from 'vitest';
import { afterActiveInstanceBlur } from '../../../src/helpers/afterActiveInstanceBlur';

describe('afterActiveInstanceBlur', () =>
{
    it('does nothing', () =>
    {
        expect(afterActiveInstanceBlur).toBeTypeOf('function');
        expect(afterActiveInstanceBlur()).toBeUndefined();
    });
});

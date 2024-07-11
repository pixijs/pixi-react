import {
    describe,
    expect,
    it,
} from 'vitest';
import { afterActiveInstanceBlur } from '../../../src/helpers/afterActiveInstanceBlur.ts';

describe('afterActiveInstanceBlur', () =>
{
    it('does nothing', () =>
    {
        expect(afterActiveInstanceBlur).to.be.a('function');
        expect(afterActiveInstanceBlur()).to.be.undefined;
    });
});

import { Container } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { applyProps } from '../../../src/helpers/applyProps';
import { prepareInstance } from '../../../src/helpers/prepareInstance';

describe('applyProps', () =>
{
    describe('when given instance props', () =>
    {
        it('updates the target instance', () =>
        {
            expect(applyProps).toBeTypeOf('function');
            const instance = prepareInstance(new Container());

            expect(instance.x).toEqual(0);

            const result = applyProps(instance, { x: 100 });

            expect(result).toEqual(instance);
            expect(instance.x).toEqual(100);
        });
    });

    describe('when given a diff set', () =>
    {
        it('updates the target instance', () =>
        {
            expect(applyProps).toBeTypeOf('function');
            const instance = prepareInstance(new Container());

            expect(instance.x).toEqual(0);

            const result = applyProps(instance, {
                changes: [
                    [
                        'x',
                        100,
                        false,
                        [],
                    ],
                ],
            });

            expect(result).toEqual(instance);
            expect(instance.x).toEqual(100);
        });
    });
});

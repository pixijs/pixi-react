import { Container } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { applyProps } from '../../../src/helpers/applyProps.js';
import { prepareInstance } from '../../../src/helpers/prepareInstance.js';

describe('applyProps', () =>
{
    describe('when given instance props', () =>
    {
        it('updates the target instance', () =>
        {
            expect(applyProps).to.be.a('function');
            const instance = prepareInstance(new Container());

            expect(instance.x).to.equal(0);

            const result = applyProps(instance, { x: 100 });

            expect(result).to.equal(instance);
            expect(instance.x).to.equal(100);
        });
    });

    describe('when given a diff set', () =>
    {
        it('updates the target instance', () =>
        {
            expect(applyProps).to.be.a('function');
            const instance = prepareInstance(new Container());

            expect(instance.x).to.equal(0);

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

            expect(result).to.equal(instance);
            expect(instance.x).to.equal(100);
        });
    });
});

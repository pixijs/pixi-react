import { Container } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { appendChild } from '../../../src/helpers/appendChild';
import { prepareInstance } from '../../../src/helpers/prepareInstance';

describe('appendChild', () =>
{
    it('appends a child instance to a parent instance', () =>
    {
        expect(appendChild).toBeTypeOf('function');

        const parentInstance = prepareInstance(new Container());
        const childInstance = prepareInstance(new Container());

        expect(parentInstance.children as []).toHaveLength(0);

        const result = appendChild(parentInstance, childInstance);

        expect(parentInstance.children).toContain(childInstance);
        expect(result).toBeUndefined();
    });

    it('does nothing if child instance doesn\'t exist', () =>
    {
        expect(appendChild).toBeTypeOf('function');

        const parentInstance = prepareInstance(new Container());

        expect(parentInstance.children as []).toHaveLength(0);

        const result = appendChild(parentInstance, null);

        expect(parentInstance.children as []).toHaveLength(0);
        expect(result).toBeUndefined();
    });
});

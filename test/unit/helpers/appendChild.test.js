import { Container } from 'pixi.js';
import {
    describe,
    expect,
    it,
} from 'vitest';
import { appendChild } from '../../../lib/helpers/appendChild.js';
import { prepareInstance } from '../../../src/helpers/prepareInstance.js';

describe('appendChild', () =>
{
    it('appends a child instance to a parent instance', () =>
    {
        expect(appendChild).to.be.a('function');

        const parentInstance = prepareInstance(new Container());
        const childInstance = prepareInstance(new Container());

        expect(parentInstance.children).to.be.empty;

        const result = appendChild(parentInstance, childInstance);

        expect(parentInstance.children).to.include(childInstance);
        expect(result).to.be.undefined;
    });

    it('does nothing if child instance doesn\'t exist', () =>
    {
        expect(appendChild).to.be.a('function');

        const parentInstance = prepareInstance(new Container());

        expect(parentInstance.children).to.be.empty;

        const result = appendChild(parentInstance);

        expect(parentInstance.children).to.be.empty;
        expect(result).to.be.undefined;
    });
});

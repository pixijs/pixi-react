import { Application, Container, Filter, Graphics } from 'pixi.js';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    isApplication,
    isContainer,
    isFilter,
    isFunction,
    isGraphics,
    isHTMLCanvasElement,
    isHTMLElement,
} from '../../../src/helpers/typeChecks';

describe('typeChecks', () =>
{
    describe('isContainer', () =>
    {
        it('returns true for Container instances', () =>
        {
            const container = new Container();

            expect(isContainer(container)).toBe(true);
        });

        it('returns true for Container subclasses by instanceof', () =>
        {
            const graphics = new Graphics();

            expect(isContainer(graphics)).toBe(true);
        });

        it('returns true for objects with Container constructor name', () =>
        {
            const mockContainer = {
                constructor: { name: 'Container' },
                addChild: vi.fn(),
                removeChild: vi.fn(),
                getChildIndex: vi.fn(),
                children: [],
            };

            expect(isContainer(mockContainer)).toBe(true);
        });

        it('returns true for objects with Container subclass constructor names', () =>
        {
            const mockSprite = {
                constructor: { name: 'Sprite' },
                addChild: vi.fn(),
                removeChild: vi.fn(),
                getChildIndex: vi.fn(),
                children: [],
            };

            expect(isContainer(mockSprite)).toBe(true);
        });

        it('returns true for objects with Container-like methods and properties', () =>
        {
            const mockContainer = {
                constructor: { name: 'SomeOtherClass' },
                addChild: vi.fn(),
                removeChild: vi.fn(),
                getChildIndex: vi.fn(),
                children: [],
            };

            expect(isContainer(mockContainer)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isContainer(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isContainer(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isContainer('string')).toBe(false);
            expect(isContainer(123)).toBe(false);
            expect(isContainer(true)).toBe(false);
        });

        it('returns false for objects without Container-like properties', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isContainer(obj)).toBe(false);
        });

        it('returns false for objects missing required methods', () =>
        {
            const incomplete = {
                constructor: { name: 'SomeOtherClass' },
                addChild: vi.fn(),
                // missing removeChild, getChildIndex, children
            };

            expect(isContainer(incomplete)).toBe(false);
        });
    });

    describe('isGraphics', () =>
    {
        it('returns true for Graphics instances', () =>
        {
            const graphics = new Graphics();

            expect(isGraphics(graphics)).toBe(true);
        });

        it('returns true for objects with Graphics constructor name', () =>
        {
            const mockGraphics = {
                constructor: { name: 'Graphics' },
                clear: vi.fn(),
                rect: vi.fn(),
                fill: vi.fn(),
            };

            expect(isGraphics(mockGraphics)).toBe(true);
        });

        it('returns true for objects with Graphics-like methods', () =>
        {
            const mockGraphics = {
                constructor: { name: 'SomeOtherClass' },
                clear: vi.fn(),
                rect: vi.fn(),
                fill: vi.fn(),
            };

            expect(isGraphics(mockGraphics)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isGraphics(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isGraphics(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isGraphics('string')).toBe(false);
            expect(isGraphics(123)).toBe(false);
            expect(isGraphics(true)).toBe(false);
        });

        it('returns false for objects without Graphics-like methods', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isGraphics(obj)).toBe(false);
        });

        it('returns false for objects missing required methods', () =>
        {
            const incomplete = {
                constructor: { name: 'SomeOtherClass' },
                clear: vi.fn(),
                // missing rect, fill
            };

            expect(isGraphics(incomplete)).toBe(false);
        });
    });

    describe('isFilter', () =>
    {
        it('returns true for Filter instances', () =>
        {
            // Mock a Filter instance since creating a real one requires complex shader setup
            const mockFilter = Object.create(Filter.prototype);

            mockFilter.enabled = true;
            mockFilter.resolution = 1;
            mockFilter.apply = vi.fn();

            expect(isFilter(mockFilter)).toBe(true);
        });

        it('returns true for objects with Filter constructor name', () =>
        {
            const mockFilter = {
                constructor: { name: 'Filter' },
                enabled: true,
                resolution: 1,
                apply: vi.fn(),
            };

            expect(isFilter(mockFilter)).toBe(true);
        });

        it('returns true for objects with constructor names ending in Filter', () =>
        {
            const mockBlurFilter = {
                constructor: { name: 'BlurFilter' },
                enabled: true,
                resolution: 1,
                apply: vi.fn(),
            };

            expect(isFilter(mockBlurFilter)).toBe(true);
        });

        it('returns true for objects with Filter-like properties', () =>
        {
            const mockFilter = {
                constructor: { name: 'SomeOtherClass' },
                enabled: true,
                resolution: 1,
                apply: vi.fn(),
            };

            expect(isFilter(mockFilter)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isFilter(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isFilter(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isFilter('string')).toBe(false);
            expect(isFilter(123)).toBe(false);
            expect(isFilter(true)).toBe(false);
        });

        it('returns false for objects without Filter-like properties', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isFilter(obj)).toBe(false);
        });

        it('returns false for objects missing required properties', () =>
        {
            const incomplete = {
                constructor: { name: 'SomeOtherClass' },
                enabled: true,
                // missing resolution, apply
            };

            expect(isFilter(incomplete)).toBe(false);
        });
    });

    describe('isApplication', () =>
    {
        it('returns true for Application instances', () =>
        {
            const app = new Application();

            expect(isApplication(app)).toBe(true);
        });

        it('returns true for objects with Application constructor name', () =>
        {
            const mockApp = {
                constructor: { name: 'Application' },
                stage: {},
                renderer: {},
                ticker: {},
                init: vi.fn(),
            };

            expect(isApplication(mockApp)).toBe(true);
        });

        it('returns true for objects with Application-like properties', () =>
        {
            const mockApp = {
                constructor: { name: 'SomeOtherClass' },
                stage: {},
                renderer: {},
                ticker: {},
                init: vi.fn(),
            };

            expect(isApplication(mockApp)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isApplication(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isApplication(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isApplication('string')).toBe(false);
            expect(isApplication(123)).toBe(false);
            expect(isApplication(true)).toBe(false);
        });

        it('returns false for objects without Application-like properties', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isApplication(obj)).toBe(false);
        });

        it('returns false for objects missing required properties', () =>
        {
            const incomplete = {
                constructor: { name: 'SomeOtherClass' },
                stage: {},
                // missing renderer, ticker, init
            };

            expect(isApplication(incomplete)).toBe(false);
        });
    });

    describe('isHTMLCanvasElement', () =>
    {
        it('returns true for HTMLCanvasElement instances', () =>
        {
            const canvas = document.createElement('canvas');

            expect(isHTMLCanvasElement(canvas)).toBe(true);
        });

        it('returns true for objects with canvas-like properties', () =>
        {
            const mockCanvas = {
                nodeName: 'CANVAS',
                getContext: vi.fn(),
                toDataURL: vi.fn(),
            };

            expect(isHTMLCanvasElement(mockCanvas)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isHTMLCanvasElement(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isHTMLCanvasElement(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isHTMLCanvasElement('string')).toBe(false);
            expect(isHTMLCanvasElement(123)).toBe(false);
            expect(isHTMLCanvasElement(true)).toBe(false);
        });

        it('returns false for objects without canvas-like properties', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isHTMLCanvasElement(obj)).toBe(false);
        });

        it('returns false for objects with wrong nodeName', () =>
        {
            const mockDiv = {
                nodeName: 'DIV',
                getContext: vi.fn(),
                toDataURL: vi.fn(),
            };

            expect(isHTMLCanvasElement(mockDiv)).toBe(false);
        });
    });

    describe('isHTMLElement', () =>
    {
        it('returns true for HTMLElement instances', () =>
        {
            const div = document.createElement('div');

            expect(isHTMLElement(div)).toBe(true);
        });

        it('returns true for objects with HTMLElement-like properties', () =>
        {
            const mockElement = {
                nodeName: 'DIV',
                nodeType: 1,
                style: {},
            };

            expect(isHTMLElement(mockElement)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isHTMLElement(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isHTMLElement(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isHTMLElement('string')).toBe(false);
            expect(isHTMLElement(123)).toBe(false);
            expect(isHTMLElement(true)).toBe(false);
        });

        it('returns false for objects without HTMLElement-like properties', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isHTMLElement(obj)).toBe(false);
        });

        it('returns false for objects with wrong nodeType', () =>
        {
            const mockTextNode = {
                nodeName: '#text',
                nodeType: 3, // Text node
                style: {},
            };

            expect(isHTMLElement(mockTextNode)).toBe(false);
        });
    });

    describe('isFunction', () =>
    {
        it('returns true for regular functions', () =>
        {
            function regularFunction() {}

            expect(isFunction(regularFunction)).toBe(true);
        });

        it('returns true for arrow functions', () =>
        {
            const arrowFunction = () => {};

            expect(isFunction(arrowFunction)).toBe(true);
        });

        it('returns true for async functions', () =>
        {
            async function asyncFunction() {}

            expect(isFunction(asyncFunction)).toBe(true);
        });

        it('returns true for class constructors', () =>
        {
            class TestClass {}

            expect(isFunction(TestClass)).toBe(true);
        });

        it('returns true for built-in functions', () =>
        {
            expect(isFunction(Array.prototype.map)).toBe(true);
            expect(isFunction(Object.keys)).toBe(true);
        });

        it('returns true for function-like objects', () =>
        {
            const mockFunction = {
                call: vi.fn(),
                apply: vi.fn(),
            };

            expect(isFunction(mockFunction)).toBe(true);
        });

        it('returns false for null', () =>
        {
            expect(isFunction(null)).toBe(false);
        });

        it('returns false for undefined', () =>
        {
            expect(isFunction(undefined)).toBe(false);
        });

        it('returns false for primitives', () =>
        {
            expect(isFunction('string')).toBe(false);
            expect(isFunction(123)).toBe(false);
            expect(isFunction(true)).toBe(false);
        });

        it('returns false for regular objects', () =>
        {
            const obj = { someProperty: 'value' };

            expect(isFunction(obj)).toBe(false);
        });

        it('returns false for objects missing function-like methods', () =>
        {
            const incomplete = {
                call: vi.fn(),
                // missing apply
            };

            expect(isFunction(incomplete)).toBe(false);
        });
    });
});

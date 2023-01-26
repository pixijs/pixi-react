import { Point, ObservablePoint } from '@pixi/math';
import { DisplayObject } from '@pixi/display';
import { parsePoint, isPointType, eventHandlers, setValue } from '../src/utils/pixi';

const noop = () => {};

describe('pixi', () =>
{
    describe('parsePoint', () =>
    {
        test('parse undefined', () =>
        {
            expect(parsePoint(undefined)).toEqual([]);
        });

        test('parse null', () =>
        {
            expect(parsePoint(null)).toEqual([]);
        });

        test('parse string', () =>
        {
            expect(parsePoint('1,3')).toEqual([1, 3]);
        });

        test('parse invalid string', () =>
        {
            expect(parsePoint('not, valid')).toEqual([]);
        });

        test('parse number', () =>
        {
            expect(parsePoint(100)).toEqual([100]);
        });

        test('parse shallow array', () =>
        {
            expect(parsePoint([100, 200])).toEqual([100, 200]);
            expect(parsePoint([100, 200])).not.toBe([100, 200]);
        });

        test('parse object with x y', () =>
        {
            expect(parsePoint({ x: 100, y: 200 })).toEqual([100, 200]);
        });

        test('parse object with x only', () =>
        {
            expect(parsePoint({ x: 100 })).toEqual([100, 0]);
        });

        test('parse object with y only', () =>
        {
            expect(parsePoint({ y: 200 })).toEqual([0, 200]);
        });
    });

    describe('isPointType', () =>
    {
        describe('true', () =>
        {
            test('point', () =>
            {
                expect(isPointType(new Point(100, 200))).toBeTruthy();
            });

            test('observablepoint', () =>
            {
                expect(isPointType(new ObservablePoint(noop, this, 100, 200))).toBeTruthy();
            });
        });

        describe('false', () =>
        {
            test('string', () =>
            {
                expect(isPointType(undefined)).toBeFalsy();
            });

            test('number', () =>
            {
                expect(isPointType(123)).toBeFalsy();
            });

            test('array', () =>
            {
                expect(isPointType([100, 200])).toBeFalsy();
            });

            test('object', () =>
            {
                expect(isPointType({ x: 100, y: 200 })).toBeFalsy();
            });
        });
    });

    describe('eventHandlers', () =>
    {
        test('available event handlers', () =>
        {
            expect(eventHandlers).toMatchSnapshot();
        });
    });

    describe('setValue', () =>
    {
        let instance;

        beforeEach(() =>
        {
            instance = new DisplayObject();
        });

        test('copy point data', () =>
        {
            setValue(instance, 'pivot', new Point(100, 200));
            expect(instance.pivot.x).toEqual(100);
            expect(instance.pivot.y).toEqual(200);
        });

        test('parse point', () =>
        {
            setValue(instance, 'pivot', [200, 200]);
            expect(instance.pivot.x).toEqual(200);
            expect(instance.pivot.y).toEqual(200);

            setValue(instance, 'pivot', '50, 50');
            expect(instance.pivot.x).toEqual(50);
            expect(instance.pivot.y).toEqual(50);
        });

        test('failed parse point', () =>
        {
            expect(() => setValue(instance, 'pivot', 'invalid')).toThrow();
            expect(instance.pivot.x).toEqual(0);
            expect(instance.pivot.y).toEqual(0);
        });

        test('set value', () =>
        {
            setValue(instance, 'alpha', 0.5);
            expect(instance.alpha).toEqual(0.5);
        });
    });
});

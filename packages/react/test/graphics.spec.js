import React, { useRef, useState, useEffect } from 'react';
import { act } from 'react-dom/test-utils';
import renderer from 'react-test-renderer';
import { Graphics, Stage } from '../src';

describe('graphics', () =>
{
    beforeAll(() =>
    {
        jest.useFakeTimers();
    });

    afterAll(() =>
    {
        jest.useRealTimers();
    });

    test('renders a graphics component with draw prop', () =>
    {
        const spy = jest.fn();
        let el;

        act(
            () =>
            {
                el = renderer
                    .create(
                        <Stage>
                            <Graphics draw={spy}/>
                        </Stage>
                    );
            });

        expect(el.toJSON()).toMatchSnapshot();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('renders a graphics component with geometry prop', () =>
    {
        const spyDraw = jest.fn();

        let graphics;
        let g1;
        let g2;
        let g3;

        const App = () =>
        {
            const ref = useRef();
            const [mounted, setMounted] = useState(false);

            useEffect(() =>
            {
                setMounted(true);
            }, []);

            return (
                <>
                    {/* eslint-disable-next-line no-return-assign */}
                    <Graphics ref={(g) => (ref.current = graphics = g)} draw={spyDraw} />

                    {mounted && (
                        <>
                            <Graphics geometry={ref.current} ref={(g) => (g1 = g)} />
                            <Graphics geometry={ref.current} ref={(g) => (g2 = g)} />
                            <Graphics geometry={ref.current} ref={(g) => (g3 = g)} />
                        </>
                    )}
                </>
            );
        };

        let el;

        act(() =>
        {
            el = renderer
                .create(
                    <Stage>
                        <App />
                    </Stage>
                );
        });

        jest.advanceTimersToNextTimer(10);

        expect(el.toJSON()).toMatchSnapshot();
        expect(spyDraw).toHaveBeenCalledTimes(1);

        expect(graphics.geometry).toEqual(g1.geometry);
        expect(graphics.geometry).toEqual(g2.geometry);
        expect(graphics.geometry).toEqual(g3.geometry);
    });
});

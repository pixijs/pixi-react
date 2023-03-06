import { useState, useEffect, createRef } from 'react';
import { act } from 'react-dom/test-utils';
import type { ReactTestRenderer } from 'react-test-renderer';
import renderer from 'react-test-renderer';
import type { Graphics as PixiGraphics } from '@pixi/graphics';

import { configure } from './__utils__/configure';
import { Graphics } from '../src';
import type { ReactStageComponent } from '../src/types';

describe('graphics', () =>
{
    let Stage: ReactStageComponent;

    beforeEach(() =>
    {
        ({ Stage } = configure());
    });

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
        let el: ReactTestRenderer;

        act(() =>
        {
            el = renderer.create(
                <Stage>
                    <Graphics draw={spy} />
                </Stage>,
            );
        });

        expect(el!.toJSON()).toMatchSnapshot();
        expect(spy).toHaveBeenCalledTimes(1);
    });

    test('renders a graphics component with geometry prop', () =>
    {
        const spyDraw = jest.fn();

        const graphics = createRef<PixiGraphics>();
        const g1 = createRef<PixiGraphics>();
        const g2 = createRef<PixiGraphics>();
        const g3 = createRef<PixiGraphics>();

        const App = () =>
        {
            const [mounted, setMounted] = useState(false);

            useEffect(() =>
            {
                setMounted(true);
            }, []);

            return (
                <>
                    <Graphics ref={graphics} draw={spyDraw} />

                    {mounted && (
                        <>
                            <Graphics geometry={graphics.current!} ref={g1} />
                            <Graphics geometry={graphics.current!} ref={g2} />
                            <Graphics geometry={graphics.current!} ref={g3} />
                        </>
                    )}
                </>
            );
        };

        let el: ReactTestRenderer;

        act(() =>
        {
            el = renderer.create(
                <Stage>
                    <App />
                </Stage>,
            );
        });

        jest.advanceTimersToNextTimer(10);

        expect(el!.toJSON()).toMatchSnapshot();
        expect(spyDraw).toHaveBeenCalledTimes(1);

        expect(graphics.current!).toBeDefined();
        expect(graphics.current!.geometry).toEqual(g1.current!.geometry);
        expect(graphics.current!.geometry).toEqual(g2.current!.geometry);
        expect(graphics.current!.geometry).toEqual(g3.current!.geometry);
    });
});

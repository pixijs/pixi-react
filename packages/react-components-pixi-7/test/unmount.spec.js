import { Application } from '@pixi/app';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { Text } from '../src';
import { configure, clearComponents } from './__utils__/configure';

jest.useFakeTimers();

const app = new Application();

describe('unmount render', () =>
{
    let element;
    let roots;
    let render;
    let unmountComponentAtNode;
    let Stage;

    beforeEach(() =>
    {
        ({ roots, render, unmountComponentAtNode, Stage } = configure());
        element = () => (
            <Stage>
                <Text text="Hello Word!" />
            </Stage>
        );
    });

    afterEach(() =>
    {
        clearComponents();
    });

    test('remove root', () =>
    {
        expect(roots.size).toBe(0);

        act(() =>
        {
            render(element, app.stage);
        });
        expect(roots.size).toBe(1);

        act(() =>
        {
            unmountComponentAtNode(app.stage);
        });
        expect(roots.size).toBe(0);
    });

    test('unmount component', () =>
    {
        const unmount = jest.fn();

        const App = () =>
        {
            React.useEffect(() => unmount);

            return null;
        };

        act(() =>
        {
            render(<App />, app.stage);
        });

        act(() =>
        {
            unmountComponentAtNode(app.stage);
        });
        jest.advanceTimersByTime(1000);

        expect(unmount).toBeCalledTimes(1);
    });
});

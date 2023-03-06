import { Application } from '@pixi/app';
import React from 'react';
import { act } from 'react-dom/test-utils';

import { Text } from '../src';
import { configure } from './__utils__/configure';
import type { RenderType, Roots, ReactStageComponent, UnmountComponentAtNodeType } from '../src/types';

jest.useFakeTimers();

const app = new Application();

describe('unmount render', () =>
{
    let Element: () => JSX.Element;
    let roots: Roots;
    let render: RenderType;
    let unmountComponentAtNode: UnmountComponentAtNodeType;
    let Stage: ReactStageComponent;

    beforeEach(() =>
    {
        ({ roots, render, unmountComponentAtNode, Stage } = configure());
        Element = () => (
            <Stage>
                <Text text="Hello Word!" />
            </Stage>
        );
    });

    test('remove root', () =>
    {
        expect(roots.size).toBe(0);

        act(() =>
        {
            render(<Element />, app.stage);
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

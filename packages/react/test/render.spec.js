import { Application } from '@pixi/app';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { roots, render, createRoot } from '../src/render';
import {
    PixiFiber,
    AppConsumer,
    AppProvider,
    Container,
    Text,
    withPixiApp,
} from '../src';

const app = new Application();
const element = () => <Text text="Hello Word!" />;
const renderElementToStage = () =>
    act(() =>
    {
        render(element, app.stage);
    });

jest.mock('../src/reconciler', () => ({
    ...jest.requireActual('../src/reconciler'),
    PixiFiber: {
        ...jest.requireActual('../src/reconciler').PixiFiber,
        createContainer: jest.fn(),
        updateContainer: jest.fn(),
        getPublicInstance: jest.fn(),
        injectIntoDevTools: jest.fn(),
    },
}));

describe('render', () =>
{
    beforeEach(() =>
    {
        roots.clear();
        jest.clearAllMocks();

        PixiFiber.createContainer.mockReturnValue({
            current: { child: { tag: 'TEXT' } },
        });
    });

    test('invariant container', () =>
    {
        expect(() => render('something', null)).toThrow(
            'Invalid argument `container`, expected instance of `Container`'
        );
    });

    test('call createContainer', () =>
    {
        renderElementToStage();
        expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1);
        expect(PixiFiber.createContainer).toHaveBeenLastCalledWith(
            app.stage,
        );
    });

    test('call updateContainer', () =>
    {
        renderElementToStage();
        const { pixiFiberContainer } = roots.values().next().value;

        expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1);
        expect(PixiFiber.updateContainer).toHaveBeenLastCalledWith(
            element,
            pixiFiberContainer,
            undefined
        );
    });

    test('store root', () =>
    {
        renderElementToStage();

        expect(roots.values().next().value).toEqual({
            pixiFiberContainer: {
                current: {
                    child: {
                        tag: 'TEXT',
                    },
                },
            },
            reactRoot: {
                render: expect.any(Function),
                unmount: expect.any(Function),
            },
        });
    });

    test('does not create root if it is already present', () =>
    {
        createRoot(app.stage);

        expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1);

        renderElementToStage();

        expect(PixiFiber.createContainer).toHaveBeenCalledTimes(1);
        expect(PixiFiber.updateContainer).toHaveBeenCalledTimes(1);
    });

    describe('passdown `PIXI.Application`', () =>
    {
        beforeEach(() =>
        {
            const PF = jest.requireActual('../src/reconciler').PixiFiber;

            PixiFiber.createContainer.mockImplementation(PF.createContainer);
            PixiFiber.updateContainer.mockImplementation(PF.updateContainer);
        });

        test('via `AppConsumer`', () =>
        {
            const fn = jest.fn(() => <Text text="hi" />);

            act(() =>
            {
                render(
                    <AppProvider value={app}>
                        <Container>
                            <AppConsumer>{fn}</AppConsumer>
                        </Container>
                    </AppProvider>,
                    app.stage
                );
            });

            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(app);
        });

        test('via `withPixiApp`', () =>
        {
            const fn = jest.fn(() => <Text text="hi" />);
            const Comp = withPixiApp(({ app }) => fn(app));

            act(() =>
            {
                render(
                    <AppProvider value={app}>
                        <Container>
                            <Comp />
                        </Container>
                    </AppProvider>,
                    app.stage
                );
            });

            expect(fn).toHaveBeenCalledTimes(1);
            expect(fn).toHaveBeenCalledWith(app);
        });
    });
});

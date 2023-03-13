import React, { useContext } from 'react';
import renderer, { act } from 'react-test-renderer';

import { AppContext, AppConsumer, withPixiApp, Container } from '../src';
import { clearComponents, configure } from './__utils__/configure';

describe('stage-context', () =>
{
    test('pass down app to child component via render prop', () =>
    {
        const { Stage } = configure();

        const fn = jest.fn(() => <Container />);
        let el;

        act(() =>
        {
            el = renderer.create(
                <Stage>
                    <Container>
                        <Container>
                            <Container>
                                <AppConsumer>{fn}</AppConsumer>
                            </Container>
                        </Container>
                    </Container>
                </Stage>
            );
        });

        const instance = el.getInstance();

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(instance.app);

        clearComponents();
    });

    test('pass down app to child component via HOC', () =>
    {
        const { Stage } = configure();

        const fn = jest.fn(() => <Container />);
        const Comp = withPixiApp(({ app }) => fn(app));

        let el;

        act(() =>
        {
            el = renderer.create(
                <Stage>
                    <Container>
                        <Comp />
                    </Container>
                </Stage>
            );
        });

        const instance = el.getInstance();

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(instance.app);

        clearComponents();
    });

    test('use context via hooks', () =>
    {
        const { Stage } = configure();

        const fn = jest.fn();

        const Comp = () =>
        {
            fn(useContext(AppContext));

            return <Container />;
        };

        let el;

        act(() =>
        {
            el = renderer.create(
                <Stage>
                    <Comp />
                </Stage>
            );
        });

        const instance = el.getInstance();

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(instance.app);

        clearComponents();
    });
});

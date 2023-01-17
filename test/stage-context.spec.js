import React, { useContext } from 'react';
import renderer, { act } from 'react-test-renderer';
import { Stage, AppConsumer, withPixiApp, Container } from '../src';
import { Context } from '../src/stage/provider';

describe('stage-context', () =>
{
    test('pass down app to child component via render prop', () =>
    {
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
    });

    test('pass down app to child component via HOC', () =>
    {
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
    });

    test('use context via hooks', () =>
    {
        const fn = jest.fn();

        const Comp = () =>
        {
            fn(useContext(Context));

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
    });
});

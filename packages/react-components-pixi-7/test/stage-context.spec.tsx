import { createRef, useContext } from 'react';
import renderer, { act } from 'react-test-renderer';

import { AppContext, AppConsumer, withPixiApp, Container } from '../src';
import { configure } from './__utils__/configure';
import type { BaseStage } from '../src/stage';
import type { Application } from '@pixi/app';

describe('stage-context', () =>
{
    test('pass down app to child component via render prop', () =>
    {
        const { Stage } = configure();
        const stageRef = createRef<BaseStage>();

        const fn = jest.fn(() => <Container />);

        act(() =>
        {
            renderer.create(
                <Stage ref={stageRef}>
                    <Container>
                        <Container>
                            <Container>
                                <AppConsumer>{fn}</AppConsumer>
                            </Container>
                        </Container>
                    </Container>
                </Stage>,
            );
        });

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(stageRef.current!.app);
    });

    test('pass down app to child component via HOC', () =>
    {
        const { Stage } = configure();
        const stageRef = createRef<BaseStage>();

        const fn = jest.fn((_app: Application) => <Container />);
        const Comp = withPixiApp(({ app }) => fn(app));

        act(() =>
        {
            renderer.create(
                <Stage ref={stageRef}>
                    <Container>
                        <Comp />
                    </Container>
                </Stage>,
            );
        });

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(stageRef.current!.app);
    });

    test('use context via hooks', () =>
    {
        const { Stage } = configure();
        const stageRef = createRef<BaseStage>();

        const fn = jest.fn();

        const Comp = () =>
        {
            fn(useContext(AppContext));

            return <Container />;
        };

        act(() =>
        {
            renderer.create(
                <Stage ref={stageRef}>
                    <Comp />
                </Stage>,
            );
        });

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(stageRef.current!.app);
    });
});

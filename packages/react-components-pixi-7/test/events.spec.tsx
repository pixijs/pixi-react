import { act } from 'react-dom/test-utils';
import { Container as PixiContainer } from '@pixi/display';
import { Text as PixiText } from '@pixi/text';
import type { RenderType } from '@pixi/react-types';

import { eventHandlers, Container, Text } from '../src';
import { configure } from './__utils__/configure';
import type { PixiReactContainer, PixiReactText } from '../src/types';
import type { FederatedPointerEvent } from '@pixi/events';
import { createRef } from 'react';

const CUSTOM_EVENT = 'customEvent';
const NOT_CUSTOM_EVENT = 'notCustomEvent';

describe('react', () =>
{
    // keep track of real PIXI instances created
    let instances: PixiReactContainer[] = [];
    let render: RenderType<PixiReactContainer>;
    let renderInContainer: (container: JSX.Element) => void;

    beforeEach(() =>
    {
        instances = [];
        jest.clearAllMocks();

        ({ render } = configure({
            spyOnHostConfig: (hostConfig) =>
            {
                const { createInstance } = hostConfig;

                jest.spyOn(hostConfig, 'createInstance').mockImplementation((...args) =>
                {
                    const ins = createInstance(...args);

                    instances.push(ins);

                    return ins;
                });

                return hostConfig;
            },
        }));

        const container = new PixiContainer();

        // @ts-ignore - used to test for instance referential integrity!?
        container.root = true;

        renderInContainer = (comp) =>
            act(() =>
            {
                render(comp, container);
            });
    });

    afterEach(() =>
    {
        const index = eventHandlers.indexOf(CUSTOM_EVENT);

        if (index >= 0) eventHandlers.splice(index, 1);
    });

    describe('events', () =>
    {
        test('trigger click event', () =>
        {
            const onClick = jest.fn();
            const text = createRef<PixiReactText>();

            renderInContainer(
                <Container>
                    <Text ref={text} click={onClick} />
                </Container>,
            );

            const event = { type: 'click' } as FederatedPointerEvent;

            text.current!.emit('click', event);

            expect(text.current).toBeInstanceOf(PixiText);
            // @ts-ignore - look at EventsEmitter
            expect(text.current._eventsCount).toEqual(1);
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onClick.mock.calls[0][0]).toBe(event);
        });

        test('dispose old event and assign new', () =>
        {
            const onClick = jest.fn();

            renderInContainer(<Text click={onClick} />);
            renderInContainer(<Text click={onClick} />);
            renderInContainer(<Text click={onClick} />);

            const event = { type: 'click' } as FederatedPointerEvent;

            instances[0].emit('click', event);

            expect(instances).toHaveLength(1);
            // @ts-ignore - look at EventsEmitter
            expect(instances[0]._eventsCount).toEqual(1);
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        test('custom events', () =>
        {
            const onCustomEvent = jest.fn();
            const onNotCustomEvent = jest.fn();
            const text = createRef<PixiReactText>();

            eventHandlers.push(CUSTOM_EVENT);

            renderInContainer(<Text ref={text} {...{ [CUSTOM_EVENT]: onCustomEvent }} />);

            const customEvent = { type: CUSTOM_EVENT } as FederatedPointerEvent;

            // @ts-ignore - ignore event types
            text.current!.emit(CUSTOM_EVENT, customEvent);

            // @ts-ignore - look at EventsEmitter
            expect(text.current._eventsCount).toEqual(1);
            expect(onCustomEvent).toHaveBeenCalledTimes(1);
            expect(onCustomEvent).toHaveBeenCalledWith(customEvent);

            renderInContainer(<Text ref={text} {...{ [NOT_CUSTOM_EVENT]: onNotCustomEvent }} />);

            const notCustomEvent = { type: NOT_CUSTOM_EVENT } as FederatedPointerEvent;

            // @ts-ignore - ignore event types
            text.current!.emit(NOT_CUSTOM_EVENT, notCustomEvent);

            expect(onNotCustomEvent).toHaveBeenCalledTimes(0);
        });
    });
});

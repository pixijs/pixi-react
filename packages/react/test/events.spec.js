import React from 'react';
import { act } from 'react-dom/test-utils';
import { Container as PixiContainer } from '@pixi/display';
import { Text as PixiText } from '@pixi/text';

import hostconfig from '../src/reconciler/hostconfig';
import { createElement } from '../src/utils/element';
import { Text, Container, render, eventHandlers } from '../src';
import { roots } from '../src/render';
import { mockToSpy } from './__utils__/mock';

const CUSTOM_EVENT = 'customEvent';
const NOT_CUSTOM_EVENT = 'notCustomEvent';

jest.mock('../src/reconciler/hostconfig');

describe('react', () =>
{
    const container = new PixiContainer();

    container.root = true;

    // render in container
    const renderInContainer = (comp) => act(() =>
    {
        render(comp, container);
    });

    // keep track of real PIXI instances created
    let instances = [];

    beforeEach(() =>
    {
        instances = [];
        jest.clearAllMocks();
        mockToSpy('../src/reconciler/hostconfig');

        hostconfig.createInstance.mockImplementation((...args) =>
        {
            const ins = createElement(...args);

            instances.push(ins);

            return ins;
        });
    });

    afterEach(() =>
    {
        roots.clear();
        const index = eventHandlers.indexOf(CUSTOM_EVENT);

        if (index >= 0) eventHandlers.splice(index, 1);
    });

    describe('events', () =>
    {
        test('trigger click event', () =>
        {
            const onClick = jest.fn();
            let text;

            renderInContainer(
                <Container>
                    <Text ref={(c) => (text = c)} click={onClick} />
                </Container>
            );

            text.emit('click', { type: 'click', data: 123 });

            expect(text).toBeInstanceOf(PixiText);
            expect(text._eventsCount).toEqual(1);
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onClick.mock.calls[0][0]).toEqual({ type: 'click', data: 123 });
        });

        test('dispose old event and assign new', () =>
        {
            const onClick = jest.fn();

            renderInContainer(<Text click={onClick} />);
            renderInContainer(<Text click={onClick} />);
            renderInContainer(<Text click={onClick} />);

            instances[0].emit('click', { type: 'click', data: 123 });

            expect(instances).toHaveLength(1);
            expect(instances[0]._eventsCount).toEqual(1);
            expect(onClick).toHaveBeenCalledTimes(1);
        });

        test('custom events', () =>
        {
            let text;
            const onCustomEvent = jest.fn();
            const onNotCustomEvent = jest.fn();

            eventHandlers.push(CUSTOM_EVENT);

            renderInContainer(<Text ref={(c) => (text = c)} {...{ [CUSTOM_EVENT]: onCustomEvent }} />);

            const customEvent = { type: CUSTOM_EVENT, data: 456 };

            text.emit(CUSTOM_EVENT, customEvent);

            expect(text._eventsCount).toEqual(1);
            expect(onCustomEvent).toHaveBeenCalledTimes(1);
            expect(onCustomEvent).toHaveBeenCalledWith(customEvent);

            renderInContainer(<Text ref={(c) => (text = c)} {...{ [NOT_CUSTOM_EVENT]: onNotCustomEvent }} />);

            text.emit(NOT_CUSTOM_EVENT, { type: NOT_CUSTOM_EVENT, data: 789 });

            expect(onNotCustomEvent).toHaveBeenCalledTimes(0);
        });
    });
});

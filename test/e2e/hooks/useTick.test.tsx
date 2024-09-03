import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import {
    render,
    renderHook,
} from '@testing-library/react'
import { Ticker } from 'pixi.js';

import { Application } from '../../../src/components/Application'
import { useTick } from '../../../src/hooks/useTick'
import { wait } from '../../utils/wait'

describe('useTick', () =>
{
    describe('with a function', () => {
        it('runs the callback', async () => {
            const useTickSpy = vi.fn()

            const TestComponent = () => {
                useTick(useTickSpy)

                return null
            }

            render(<TestComponent />, { wrapper: Application })

            await wait(100)

            expect(useTickSpy.mock.lastCall?.[0]).to.be.instanceOf(Ticker)
        });
    })

    describe('with an options hash', () => {
        it('runs the callback', async () => {
            const useTickSpy = vi.fn()

            const TestComponent = () => {
                useTick({ callback: useTickSpy })

                return null
            }

            render(<TestComponent />, { wrapper: Application })

            await wait(100)

            expect(useTickSpy.mock.lastCall?.[0]).to.be.instanceOf(Ticker)
        });
    })

    it('throws when not in a React Pixi tree', () =>
    {
        const result = () => renderHook(() => useTick(() => {}))

        expect(result).to.throw(Error, /no context found/i)
    });
});

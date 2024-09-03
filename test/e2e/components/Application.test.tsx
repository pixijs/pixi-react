import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';
import { render } from '@testing-library/react'

import { Application } from '../../../src/components/Application'
import { wait } from '../../utils/wait';

describe('Application', () =>
{
    describe('onInit', () => {
        it('runs the callback', async () => {
            const onInitSpy = vi.fn()

            const TestComponent = function() {
                return (
                    <Application onInit={onInitSpy} />
                )
            }

            render((
                <TestComponent />
            ))

            await wait(1000)

            expect(onInitSpy.mock.calls.length).to.equal(1)
        });
    })
});

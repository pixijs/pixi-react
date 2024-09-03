import {
    describe,
    expect,
    it,
    vi,
} from 'vitest'
import { type Application as PixiApplication } from 'pixi.js'
import { render } from '@testing-library/react'
import { useEffect } from 'react'

import { Application } from '../../../src/components/Application'
import { useApplication } from '../../../src/hooks/useApplication'

describe('Application', () => {
    it('runs the `onInit` callback', async () => {
        const onInitSpy = vi.fn()

        const TestComponent = () => (
            <Application onInit={onInitSpy} />
        )

        render(<TestComponent />)

        await expect.poll(() => onInitSpy.mock.calls.length).toEqual(1)
    });

    it('unmounts after init', async () => {
        let testApp: PixiApplication | null = null

        const TestChildComponent = () => {
            const { app } = useApplication()

            useEffect(() => {
                testApp = app

                return () => {
                    testApp = app
                }
            }, [app])

            return null
        }

        const TestComponent = () => (
            <Application>
                <TestChildComponent />
            </Application>
        )

        const { unmount } = render(<TestComponent />)

        await expect.poll(() => Boolean(testApp?.renderer)).toBeTruthy()

        unmount()

        await expect.poll(() => !testApp?.renderer).toBeFalsy()
        await expect.poll(() => !testApp?.stage).toBeFalsy()
    })

    it('unmounts during init', async () => {
        let testApp: PixiApplication | null = null

        const TestChildComponent = () => {
            testApp = useApplication().app

            return null
        }

        const TestComponent = () => (
            <Application>
                <TestChildComponent />
            </Application>
        )

        const { unmount } = render(<TestComponent />)

        await expect.poll(() => !testApp?.renderer).toBeFalsy()
        await expect.poll(() => !testApp?.stage).toBeFalsy()

        unmount()

        await expect.poll(() => !testApp?.renderer).toBeFalsy()
        await expect.poll(() => !testApp?.stage).toBeFalsy()
    });
})

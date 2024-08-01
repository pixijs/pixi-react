import type { ReactNode } from 'react'
import {
    describe,
    expect,
    it,
} from 'vitest';
import {
    render,
    renderHook,
} from '@testing-library/react'
import { Application as PixiApplication } from 'pixi.js';

import { Application } from '../../../src/components/Application.ts'
import { useApplication } from '../../../src/hooks/useApplication.ts'

describe('useApplication', () =>
{
    it('returns the nearest application', async () =>
    {
        let initApp: PixiApplication | null = null
        let testApp: PixiApplication | null = null

        const TestComponentWrapper = (props: {
            children?: ReactNode,
        }) => {
            const { children } = props

            const handleInit = (app: PixiApplication) => (initApp = app)

            return (
                <Application onInit={handleInit}>
                    {children}
                </Application>
            )
        }

        const TestComponent = () => {
            const { app } = useApplication()

            if (app) {
                testApp = app
            }

            return null
        }

        render(<TestComponent />, {
            wrapper: TestComponentWrapper,
        })

        await new Promise<void>(resolve => {
            let intervalID = setInterval(() => {
                if (initApp) {
                    clearInterval(intervalID)
                    setTimeout(resolve, 10)
                }
            }, 10)
        })

        expect(testApp).to.equal(initApp)
    })

    it('throws when not in a React Pixi tree', () =>
    {
        expect(() => renderHook(() => useApplication())).to.throw(Error, /no context found/i)
    });
});

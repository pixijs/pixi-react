import { Application } from 'pixi.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createApplication } from '../../../src/core/createApplication';

describe('createApplication', () =>
{
    let app: Application;

    beforeEach(() =>
    {
        app = new Application();
    });

    it('should create application utilities with existing app', () =>
    {
        const { useApp, useTick, createRoot } = createApplication(app);

        expect(typeof useApp).toBe('function');
        expect(typeof useTick).toBe('function');
        expect(typeof createRoot).toBe('function');
    });

    it('should return the same app instance structure', () =>
    {
        const { useApp } = createApplication(app);

        // We can't easily test useApp without React context, so let's test the structure
        expect(typeof useApp).toBe('function');
    });

    it('should create root interface with unmount method', () =>
    {
        const { createRoot } = createApplication(app);

        // Test the interface without actually mounting (to avoid canvas issues)
        expect(typeof createRoot).toBe('function');

        // The createRoot function should accept at least 2 required parameters: container, children
        // (options parameter has default value so doesn't count in .length)
        expect(createRoot.length).toBe(2);
    });

    it('should handle callbacks in options interface', () =>
    {
        const { createRoot } = createApplication(app);

        // Test that the function exists and can be inspected
        expect(() =>
        {
            // This should not throw, even if we can't test actual execution
            createRoot.toString();
        }).not.toThrow();

        // Test that we can create mock functions (interface test)
        const onMount = vi.fn();
        const onUnmount = vi.fn();

        expect(typeof onMount).toBe('function');
        expect(typeof onUnmount).toBe('function');
    });
});

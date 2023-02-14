import * as React from 'react';

// TODO: how to share types, we want to avoid this import somehow!
import { Container as PixiContainer, DisplayObject as PixiDisplayObject } from '@pixi/display';

type PropsType = { [key: string]: any };

interface ICustomComponent<
    P extends PropsType,
    PixiInstance extends PixiDisplayObject
    >
{
    /**
     * Create the PIXI instance
     * The component is created during React reconciliation.
     *
     * @param props passed down props
     * @returns {PixiDisplayObject}
     */
    create(props: P): PixiInstance;

    /**
     * Instance mounted
     * This is called during React reconciliation.
     *
     * @param {PixiDisplayObject} instance
     * @param {PixiContainer} parent
     */
    didMount?(instance: PixiInstance, parent: PixiContainer): void;

    /**
     * Instance will unmount
     * This is called during React reconciliation.
     *
     * @param {PixiDisplayObject} instance
     * @param {PixiContainer} parent
     */
    willUnmount?(instance: PixiInstance, parent: PixiContainer): void;

    /**
     * Apply props for this custom component.
     * This is called during React reconciliation.
     *
     * @param {PixiDisplayObject} instance
     * @param oldProps
     * @param newProps
     */
    applyProps?(
        instance: PixiInstance,
        oldProps: Readonly<P>,
        newProps: Readonly<P>
    ): void;

    /**
     * Reconcile config
     */
    config?: {
        /**
         * Destroy instance on unmount?
         * @default true
         */
        destroy?: boolean;

        /**
         * Destroy child instances?
         * @default true
         */
        destroyChildren?: boolean,

        destroyTexture: boolean,
        destroyBaseTexture: boolean,
    };
}

export const COMPONENTS: Record<string, ICustomComponent<PropsType, PixiDisplayObject>>;

/**
 * Create a Custom PIXI Component
 *
 * @example
 *
 * type RectangleProps = { x: number, y: number, color: number };
 *
 * const Rectangle = PixiComponent<RectangleProps, PixiGraphics>('Rectangle', {
 *   create() {
 *     return new PixiGraphics();
 *   }
 *   applyProps(ins: PixiGraphics, oldProps: RectangleProps, newProps: RectangleProps) {
 *     ins.clear();
 *     ins.beginFill(newProps.color);
 *     ins.drawRect(newProps.x, newProps.y, 100, 100);
 *     ins.endFill();
 *   }
 * });
 */
export const PixiComponent: <Props extends { [key: string]: any; }, PixiInstance extends PixiDisplayObject>(
    componentName: string,
    lifecycle: ICustomComponent<Props, PixiInstance>
) => React.FC<Props & { ref?: React.Ref<PixiInstance> }>;

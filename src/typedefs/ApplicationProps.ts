import type {
    Application,
    ApplicationOptions,
    ExtensionFormatLoose,
    TextStyle,
    TextStyleOptions,
} from 'pixi.js';
import type {
    Key,
    RefObject,
} from 'react';
import type { PixiReactChildNode } from './PixiReactChildNode';

export interface BaseApplicationProps
{
    /**
     * @description Whether this application chould be attached to the dev tools. NOTE: This should only be enabled on one application at a time.
     * @deprecated Pixi.js handles this automatically, making this option superfluous.
     */
    attachToDevTools?: boolean

    /** @description CSS classes to be applied to the Pixi Application's canvas element. */
    className?: string

    /** @description Child components. */
    children?: PixiReactChildNode;

    /** @description The default style to be applied to text nodes. */
    defaultTextStyle?: TextStyle | TextStyleOptions,

    /** @description An array of Pixi extensions to be loaded before initialisation. */
    extensions?: (ExtensionFormatLoose | any)[],

    /** @description A unique key which allows React to manage this component across changes in parent state. */
    key?: Key,

    /** @description Callback to be fired when the application finishes initializing. */
    onInit?: (app: Application) => void

    /** @description An element (or React ref) to which the application's canvas will be resized. */
    resizeTo?: HTMLElement | Window | RefObject<HTMLElement>
}

export type ApplicationProps = BaseApplicationProps & Partial<{
    [K in keyof ApplicationOptions as K]?: K extends keyof BaseApplicationProps
        ? BaseApplicationProps[K]
        : ApplicationOptions[K];
}>;

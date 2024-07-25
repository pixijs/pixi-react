import type {
    Application,
    ApplicationOptions,
    TextStyle,
    TextStyleOptions,
} from 'pixi.js';
import type { RefObject } from 'react';
import type { HostConfig } from './HostConfig.ts';

export interface BaseApplicationProps
{
    /** @description Whether this application chould be attached to the dev tools. NOTE: This should only be enabled on one application at a time. */
    attachToDevTools?: boolean

    /** @description CSS classes to be applied to the Pixi Application's canvas element. */
    className?: string

    /** @description Child components. */
    children?: HostConfig['instance'] | HostConfig['instance'][];

    /** @description The default style to be applied to text nodes. */
    defaultTextStyle?: TextStyle | TextStyleOptions,

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

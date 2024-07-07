import type {
    Application,
    ApplicationOptions,
    TextStyle,
    TextStyleOptions,
} from 'pixi.js';
import type {
    PropsWithChildren,
    RefObject,
} from 'react';
import type { Overwrite } from './Overwrite.ts';

export interface BaseApplicationProps extends ApplicationOptions
{
    /** @description Whether this application chould be attached to the dev tools. NOTE: This should only be enabled on one application at a time. */
    attachToDevTools?: boolean
    /** @description CSS classes to be applied to the Pixi Application's canvas element. */
    className?: string
    /** @description The default style to be applied to text nodes. */
    defaultTextStyle?: TextStyle | TextStyleOptions,
    /** @description Callback to be fired when the application finishes initializing. */
    onInit?: (app: Application) => void
}
export type ApplicationPropsWithResizeToRef = Overwrite<BaseApplicationProps, { resizeTo?: HTMLElement | Window | RefObject<HTMLElement> }>;

export type ApplicationProps = Partial<PropsWithChildren<Omit<ApplicationPropsWithResizeToRef, 'children'>>>;

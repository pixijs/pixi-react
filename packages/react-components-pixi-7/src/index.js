import * as components from './components';
import { applyDefaultProps } from './utils/props';

/**
 * -------------------------------------------
 * Public API
 * -------------------------------------------
 */

export {
    Context as AppContext,
    AppProvider,
    AppConsumer,
    withPixiApp,
} from './stage/provider';
export { useTick, useApp } from './hooks';
export { withFilters } from './hoc';
export { eventHandlers } from './utils/pixi';
export { configurePixiReactStage } from './stage';
export { configurePixiReactRenderAPI } from './render';
export { applyDefaultProps };

/**
 * Available tag types
 *
 * @type {Object}
 */
export const TYPES = {
    BitmapText: 'BitmapText',
    Container: 'Container',
    Graphics: 'Graphics',
    NineSlicePlane: 'NineSlicePlane',
    ParticleContainer: 'ParticleContainer',
    Sprite: 'Sprite',
    AnimatedSprite: 'AnimatedSprite',
    Text: 'Text',
    TilingSprite: 'TilingSprite',
    SimpleMesh: 'SimpleMesh',
    SimpleRope: 'SimpleRope',
};

export const BitmapText = TYPES.BitmapText;
export const Container = TYPES.Container;
export const Graphics = TYPES.Graphics;
export const NineSlicePlane = TYPES.NineSlicePlane;
export const ParticleContainer = TYPES.ParticleContainer;
export const Sprite = TYPES.Sprite;
export const AnimatedSprite = TYPES.AnimatedSprite;
export const Text = TYPES.Text;
export const TilingSprite = TYPES.TilingSprite;
export const SimpleMesh = TYPES.SimpleMesh;
export const SimpleRope = TYPES.SimpleRope;

export function configurePixiReactComponents(
    PixiComponent,
)
{
    // Register default components in `react-modular`'s COMPONENTS hash
    Object.keys(TYPES).forEach((type) => PixiComponent(type, components[type]));

    return {
        TYPES,
        applyDefaultProps,
    };
}

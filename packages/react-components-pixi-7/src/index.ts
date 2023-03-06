/// <reference path="./global.d.ts" />
import type { ComponentsType, PixiComponentType } from '@pixi/react-types';

import {
    AnimatedSprite as AnimatedSpriteComponent,
    BitmapText as BitmapTextComponent,
    Container as ContainerComponent,
    Graphics as GraphicsComponent,
    NineSlicePlane as NineSlicePlaneComponent,
    ParticleContainer as ParticleContainerComponent,
    SimpleMesh as SimpleMeshComponent,
    SimpleRope as SimpleRopeComponent,
    Sprite as SpriteComponent,
    Text as TextComponent,
    TilingSprite as TilingSpriteComponent,
} from './components';
import { applyDefaultProps } from './utils/props';

import type {
    PixiReactContainer,
    ReactStageComponent,
    ReactAnimatedSpriteComponent,
    ReactBitmapTextComponent,
    ReactContainerComponent,
    ReactGraphicsComponent,
    ReactNineSlicePlaneComponent,
    ReactParticleContainerComponent,
    ReactSimpleMeshComponent,
    ReactSimpleRopeComponent,
    ReactSpriteComponent,
    ReactTextComponent,
    ReactTilingSpriteComponent,
} from './types';

/**
 * -------------------------------------------
 * Public API
 * -------------------------------------------
 */

export { Context as AppContext, AppProvider, AppConsumer, withPixiApp } from './stage/provider';
export { useTick, useApp } from './hooks';
export { withFilters } from './hoc';
export { eventHandlers } from './utils/pixi';
export { configurePixiReactStage } from './stage';
export { configurePixiReactRenderAPI } from './render';
export { applyDefaultProps };
export type { PixiReactContainer, ReactStageComponent };

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

export const BitmapText = TYPES.BitmapText as unknown as ReactBitmapTextComponent;
export const Container = TYPES.Container as unknown as ReactContainerComponent;
export const Graphics = TYPES.Graphics as unknown as ReactGraphicsComponent;
export const NineSlicePlane = TYPES.NineSlicePlane as unknown as ReactNineSlicePlaneComponent;
export const ParticleContainer = TYPES.ParticleContainer as unknown as ReactParticleContainerComponent;
export const Sprite = TYPES.Sprite as unknown as ReactSpriteComponent;
export const AnimatedSprite = TYPES.AnimatedSprite as unknown as ReactAnimatedSpriteComponent;
export const Text = TYPES.Text as unknown as ReactTextComponent;
export const TilingSprite = TYPES.TilingSprite as unknown as ReactTilingSpriteComponent;
export const SimpleMesh = TYPES.SimpleMesh as unknown as ReactSimpleMeshComponent;
export const SimpleRope = TYPES.SimpleRope as unknown as ReactSimpleRopeComponent;

const components: ComponentsType = {
    AnimatedSprite: AnimatedSpriteComponent,
    BitmapText: BitmapTextComponent,
    Container: ContainerComponent,
    Graphics: GraphicsComponent,
    NineSlicePlane: NineSlicePlaneComponent,
    ParticleContainer: ParticleContainerComponent,
    SimpleMesh: SimpleMeshComponent,
    SimpleRope: SimpleRopeComponent,
    Sprite: SpriteComponent,
    Text: TextComponent,
    TilingSprite: TilingSpriteComponent,
};

export function configurePixiReactComponents(
    PixiComponent: PixiComponentType,
)
{
    // Register default components in `react-modular`'s COMPONENTS hash
    Object.keys(TYPES).forEach((type) => PixiComponent(type, components[type]));

    return {
        TYPES,
        applyDefaultProps,
    };
}

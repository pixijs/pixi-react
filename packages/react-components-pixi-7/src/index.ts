/// <reference path="./global.d.ts" />
import type * as React from 'react';
import type { ComponentsType, ComponentType, PixiComponentType, PropsType } from '@pixi/react-types';

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

import type { ExpandoContainer, StageType } from './types';
import type { BitmapTextProps } from './components/BitmapText';
import type { SpriteProps } from './components/Sprite';
import type { GraphicsProps } from './components/Graphics';
import type { TextProps } from './components/Text';
import type { NineSlicePlaneProps } from './components/NineSlicePlane';
import type { ParticleContainerProps } from './components/ParticleContainer';
import type { TilingSpriteProps } from './components/TilingSprite';
import type { SimpleRopeProps } from './components/SimpleRope';
import type { SimpleMeshProps } from './components/SimpleMesh';
import type { AnimatedSpriteProps } from './components/AnimatedSprite';

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
export type { StageType, ExpandoContainer };

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

export const BitmapText = TYPES.BitmapText as unknown as React.FC<BitmapTextProps>;
export const Container = TYPES.Container as unknown as React.FC<React.PropsWithChildren<PropsType>>;
export const Graphics = TYPES.Graphics as unknown as React.FC<GraphicsProps>;
export const NineSlicePlane = TYPES.NineSlicePlane as unknown as React.FC<NineSlicePlaneProps>;
export const ParticleContainer = TYPES.ParticleContainer as unknown as React.FC<
React.PropsWithChildren<ParticleContainerProps>
>;
export const Sprite = TYPES.Sprite as unknown as React.FC<React.PropsWithChildren<SpriteProps>>;
export const AnimatedSprite = TYPES.AnimatedSprite as unknown as React.FC<AnimatedSpriteProps>;
export const Text = TYPES.Text as unknown as React.FC<TextProps>;
export const TilingSprite = TYPES.TilingSprite as unknown as React.FC<TilingSpriteProps>;
export const SimpleMesh = TYPES.SimpleMesh as unknown as React.FC<SimpleMeshProps>;
export const SimpleRope = TYPES.SimpleRope as unknown as React.FC<SimpleRopeProps>;

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
    PixiComponent: PixiComponentType<PropsType, ComponentType<PropsType, ExpandoContainer>>,
)
{
    // Register default components in `react-modular`'s COMPONENTS hash
    Object.keys(TYPES).forEach((type) => PixiComponent(type, components[type]));

    return {
        TYPES,
        applyDefaultProps,
    };
}

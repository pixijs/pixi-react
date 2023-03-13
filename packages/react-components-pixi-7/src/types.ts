import type * as React from 'react';
import type { Container } from '@pixi/display';
import type { IPoint, Resource, Texture } from '@pixi/core';
import type { AnimatedSprite, FrameObject } from '@pixi/sprite-animated';
import type { Graphics } from '@pixi/graphics';
import type { BitmapText, IBitmapTextStyle } from '@pixi/text-bitmap';
import type { NineSlicePlane, SimpleMesh, SimpleRope } from '@pixi/mesh-extras';
import type { ParticleContainer } from '@pixi/particle-container';
import type { Sprite } from '@pixi/sprite';
import type { TilingSprite } from '@pixi/sprite-tiling';
import type { Text, TextStyle } from '@pixi/text';
import type { ObservablePoint, Point } from '@pixi/math';
import type {
    PropsType,
    InteractionEvents,
    PointCoords,
    PointLike as GenericPointLike,
    WithSource as GenericWithSource,
    ReactContainerProps as GenericReactContainerProps,
    PixiReactContainer as BasePixiReactContainer,
    DisplayObjectSettableProperty,
    createInstanceType as genericCreateInstanceType,
    Roots as GenericRoots,
    CreateRootType as GenericCreateRootType,
    RenderType as GenericRenderType,
    UnmountComponentAtNodeType as GenericUnmountComponentAtNodeType,
    ReactStageComponent as GenericReactStageComponent,
    StageProps as GenericStageProps,
    MinimalContainer,
} from '@pixi/react-types';
import type { Application, IApplicationOptions } from '@pixi/app';
import type { DRAW_MODES } from '@pixi/constants';

// TODO: this is a circular dependency, but writing a working interface for BaseStage is a nightmare
import type { BaseStage } from './stage';

export type { DisplayObjectSettableProperty, InteractionEvents, PointCoords, PropsType };

// These are types for the "expando" Pixi instances, that are returned from
// the component lifecycle create method with additional properties/methods
// added for interopability with Pixi React
export type PixiReactAnimatedSprite = BasePixiReactContainer<Container, AnimatedSprite>;
export type PixiReactBitmapText = BasePixiReactContainer<Container, BitmapText>;
export type PixiReactContainer = BasePixiReactContainer<Container, Container>;
export type PixiReactGraphics = BasePixiReactContainer<Container, Graphics>;
export type PixiReactNineSlicePlane = BasePixiReactContainer<Container, NineSlicePlane>;
export type PixiReactParticleContainer = BasePixiReactContainer<Container, ParticleContainer>;
export type PixiReactSimpleMesh = BasePixiReactContainer<Container, SimpleMesh>;
export type PixiReactSimpleRope = BasePixiReactContainer<Container, SimpleRope>;
export type PixiReactSprite = BasePixiReactContainer<Container, Sprite>;
export type PixiReactText = BasePixiReactContainer<Container, Text>;
export type PixiReactTilingSprite = BasePixiReactContainer<Container, TilingSprite>;

export type PixiReactTexture = Texture & {
    __reactpixi?: {
        root: PixiReactContainer | null;
    };
};

type WithSource = GenericWithSource<Texture>;
export type PointLike = GenericPointLike<Point, ObservablePoint>;

export type BaseReactContainerProps<PixiInstance extends MinimalContainer, Props = object> = GenericReactContainerProps<
Point,
ObservablePoint,
Container,
PixiInstance,
Props
>;

// These are types for all of the React props each of the predefined Pixi React
// Components requires, the first definitions are properties specific to the
// Pixi React versions, below they are combined with all the properties pulled
// from each specific Pixi Component, as well as all the inherited DisplayObject
// and Container props
// TODO: do some of these props just come from the PIXI components?
// Compare with original handwritten types
// Might also be nicer if these were colocated with the components themselves
export type AnimatedSpriteTexturesProp = Texture<Resource>[] | FrameObject[];
export type AnimatedSpriteProps = PropsType & {
    textures?: AnimatedSpriteTexturesProp;
    images?: string[];
    isPlaying?: boolean;
    initialFrame?: number;
};
export type BitmapTextProps = PropsType & {
    text: string;
    style: Partial<IBitmapTextStyle>;
};
export type SpriteProps = PropsType & WithSource;
export type TextProps = PropsType &
WithSource & {
    text?: string;
    style?: Partial<TextStyle>;
    isSprite?: boolean;
};
export type GraphicsProps = PropsType & {
    draw?(graphics: Graphics): void;
    geometry?: Graphics;
};
export type NineSlicePlaneProps = PropsType &
WithSource & {
    leftWidth?: number;
    topWidth?: number;
    rightWidth?: number;
    bottomWidth?: number;
};
export type ParticleContainerProps = PropsType & {
    maxSize?: number;
    // TODO: properties contents
    properties?: object;
    batchSize?: number;
    autoResize?: boolean;
};
export type TilingSpriteProps = PropsType &
WithSource & {
    tilePosition?: PointLike;
    tileScale?: PointLike;
};
export type SimpleMeshProps = PropsType &
WithSource & {
    image?: string | HTMLImageElement;
    texture?: Texture;
    vertices?: Float32Array;
    uvs?: Float32Array;
    indices?: Uint16Array;
    drawMode?: DRAW_MODES;
};
export type SimpleRopeProps = PropsType &
WithSource & {
    points: IPoint[];
};

// Merge above props with relevant Pixi Component and DisplayObject/Container props
export type ReactStageProps = GenericStageProps<Application, IApplicationOptions>;
export type ReactAnimatedSpriteProps = BaseReactContainerProps<AnimatedSprite, AnimatedSpriteProps>;
export type ReactBitmapTextProps = BaseReactContainerProps<BitmapText, BitmapTextProps>;
export type ReactContainerProps = BaseReactContainerProps<Container>;
export type ReactGraphicsProps = BaseReactContainerProps<Graphics, GraphicsProps>;
export type ReactNineSlicePlaneProps = BaseReactContainerProps<NineSlicePlane, NineSlicePlaneProps>;
export type ReactParticleContainerProps = BaseReactContainerProps<ParticleContainer, ParticleContainerProps>;
export type ReactSimpleMeshProps = BaseReactContainerProps<SimpleMesh, SimpleMeshProps>;
export type ReactSimpleRopeProps = BaseReactContainerProps<SimpleRope, SimpleRopeProps>;
export type ReactSpriteProps = BaseReactContainerProps<Sprite, SpriteProps>;
export type ReactTextProps = BaseReactContainerProps<Text, TextProps>;
export type ReactTilingSpriteProps = BaseReactContainerProps<TilingSprite, TilingSpriteProps>;

// Types for the actual React components themselves for when they're rendered in JSX
export type ReactStageComponent = GenericReactStageComponent<BaseStage, Application, IApplicationOptions>;
export type ReactAnimatedSpriteComponent = React.FC<ReactAnimatedSpriteProps>;
export type ReactBitmapTextComponent = React.FC<ReactBitmapTextProps>;
export type ReactContainerComponent = React.FC<React.PropsWithChildren<ReactContainerProps>>;
export type ReactGraphicsComponent = React.FC<ReactGraphicsProps>;
export type ReactNineSlicePlaneComponent = React.FC<ReactNineSlicePlaneProps>;
export type ReactParticleContainerComponent = React.FC<React.PropsWithChildren<ReactParticleContainerProps>>;
export type ReactSimpleMeshComponent = React.FC<ReactSimpleMeshProps>;
export type ReactSimpleRopeComponent = React.FC<ReactSimpleRopeProps>;
export type ReactSpriteComponent = React.FC<React.PropsWithChildren<ReactSpriteProps>>;
export type ReactTextComponent = React.FC<ReactTextProps>;
export type ReactTilingSpriteComponent = React.FC<ReactTilingSpriteProps>;

// TODO: Do we need to create Concrete types like this for everything?
// Can we supply the Generics on the functions themselves rather than the
// function type? It might work and create simpler code/types but will need
// the functions themselves to be rewritten as Generic. This could be a way to
// minimize the size of the versioned pixi components package

// Concrete types for this version of PIXI, with the Container/ExpandoContainer generics pre-supplied
export type createInstanceType = genericCreateInstanceType<PixiReactContainer, PixiReactContainer>;

export type Roots = GenericRoots<PixiReactContainer>;

export type CreateRootType = GenericCreateRootType<PixiReactContainer>;

export type RenderType = GenericRenderType<Container>;

export type UnmountComponentAtNodeType = GenericUnmountComponentAtNodeType<Container>;

import type { Container } from '@pixi/display';
import type { Texture } from '@pixi/core';
import type { AnimatedSprite } from '@pixi/sprite-animated';
import type { Graphics } from '@pixi/graphics';
import type { BitmapText } from '@pixi/text-bitmap';
import type { NineSlicePlane, SimpleMesh, SimpleRope } from '@pixi/mesh-extras';
import type { ParticleContainer } from '@pixi/particle-container';
import type { Sprite } from '@pixi/sprite';
import type { TilingSprite } from '@pixi/sprite-tiling';
import type { Text } from '@pixi/text';
import type { ObservablePoint, Point } from '@pixi/math';
import type {
    PropsType,
    PixiReactMinimalExpandoContainer,
    lifeCycleConfigType,
    createInstanceType as genericCreateInstanceType,
    applyPropsType as genericApplyPropsType,
    didMountType as genericDidMountType,
    willUnmountType as genericWillUnmountType,
    Roots as GenericRoots,
    CreateRootType as GenericCreateRootType,
    RenderType as GenericRenderType,
    UnmountComponentAtNodeType as GenericUnmountComponentAtNodeType,
    StageType as GenericStageType,
    ComponentType as GenericComponentType,
    PixiComponentType as GenericPixiComponentType,
} from '@pixi/react-types';
import type { Application, IApplicationOptions } from '@pixi/app';
// TODO: this is a circular dependency
import type { BaseStage } from './stage';

export { PropsType };

export type PointCoords = [number, number] | [number];
export type PointLike = Point | ObservablePoint | PointCoords | number | { x?: number; y?: number };

// TODO: fill these out more and apply them to components
export type DisplayObjectSettableProperties = {
    alpha: number;
    buttonMode: boolean;
    cacheAsBitmap: boolean;
    cursor: null;
    filterArea: null;
    filters: null;
    hitArea: null;
    interactive: boolean;
    mask: null;
    pivot: number;
    position: number;
    renderable: boolean;
    rotation: number;
    scale: number;
    skew: number;
    transform: null;
    visible: boolean;
    x: number;
    y: number;
};
export type DisplayObjectSettableProperty = keyof DisplayObjectSettableProperties;

export type PixiReactExpandoContainer<PixiContainer extends PixiReactMinimalExpandoContainer> = {
    config?: lifeCycleConfigType;
    applyProps?: genericApplyPropsType<PropsType, PixiContainer>;
    didMount?: genericDidMountType<PixiContainer>;
    willUnmount?: genericWillUnmountType<PixiContainer>;
    __reactpixi?: {
        root: PixiContainer | null;
    };
};

// TODO: this expando stuff breaks the inheritance chain which is annoying for duck typing
// AnimatedSprite extends from Container but ExpandoAnimatedSprite does not extend from ExpandoContainer
export type ExpandoAnimatedSprite = AnimatedSprite & PixiReactExpandoContainer<AnimatedSprite>;
export type ExpandoBitmapText = BitmapText & PixiReactExpandoContainer<BitmapText>;
export type ExpandoContainer = Container & PixiReactExpandoContainer<Container>;
export type ExpandoGraphics = Graphics & PixiReactExpandoContainer<Graphics>;
export type ExpandoNineSlicePlane = NineSlicePlane & PixiReactExpandoContainer<NineSlicePlane>;
export type ExpandoParticleContainer = ParticleContainer & PixiReactExpandoContainer<ParticleContainer>;
export type ExpandoSimpleMesh = SimpleMesh & PixiReactExpandoContainer<SimpleMesh>;
export type ExpandoSimpleRope = SimpleRope & PixiReactExpandoContainer<SimpleRope>;
export type ExpandoSprite = Sprite & PixiReactExpandoContainer<Sprite>;
export type ExpandoText = Text & PixiReactExpandoContainer<Text>;
export type ExpandoTilingSprite = TilingSprite & PixiReactExpandoContainer<TilingSprite>;
export type ExpandoTexture = Texture & {
    __reactpixi?: {
        root: ExpandoContainer | null;
    };
};

// Concrete types for this version of PIXI, with the Container/ExpandoContainer generics pre-supplied
export type createInstanceType = genericCreateInstanceType<ExpandoContainer>;

export type Roots = GenericRoots<ExpandoContainer>;

export type CreateRootType = GenericCreateRootType<ExpandoContainer>;

export type RenderType = GenericRenderType<Container>;

export type UnmountComponentAtNodeType = GenericUnmountComponentAtNodeType<Container>;

export type StageType = GenericStageType<BaseStage, Application, IApplicationOptions>;

export type applyPropsType = genericApplyPropsType<PropsType, ExpandoContainer>;

export type didMountType = genericDidMountType<ExpandoContainer>;

export type willUnmountType = genericWillUnmountType<ExpandoContainer>;

export type ComponentType = GenericComponentType<ExpandoContainer>;

export type PixiComponentType = GenericPixiComponentType<PropsType, ExpandoContainer>;

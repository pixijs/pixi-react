import type * as PIXI from 'pixi.js';
import type * as React from 'react';

type PixiType = typeof PIXI;
type Overloads<T> = T extends {
    new (...args: infer A1): infer R1;
    new (...args: infer A2): infer R2;
    new (...args: infer A3): infer R3;
    new (...args: infer A4): infer R4;
}
    ? [
        new (...args: A1) => R1,
        new (...args: A2) => R2,
        new (...args: A3) => R3,
        new (...args: A4) => R4
    ]
    : T extends {
        new (...args: infer A1): infer R1;
        new (...args: infer A2): infer R2;
        new (...args: infer A3): infer R3;
    }
        ? [new (...args: A1) => R1, new (...args: A2) => R2, new (...args: A3) => R3]
        : T extends {
            new (...args: infer A1): infer R1;
            new (...args: infer A2): infer R2;
        }
            ? [new (...args: A1) => R1, new (...args: A2) => R2]
            : T extends {
                new (...args: infer A1): infer R1;
            }
                ? [new (...args: A1) => R1]
                : any;
type ConstructorWithOneParam<T extends new (...args: any[]) => any> =
	T extends new (args: infer A) => any ? A : never;
type ConstructorParams<T extends new (...args: any[]) => any> =
	ConstructorWithOneParam<Overloads<T>[number]>;

export type TargetKeys =
	| 'Container'
	| 'AnimatedSprite'
	| 'NineSliceSprite'
	| 'TilingSprite'
	| 'Mesh'
	| 'Sprite'
	| 'Graphics'
	| 'Text'
	| 'HTMLText';

type AutoFilteredKeys = {
    [K in keyof PixiType]: K extends TargetKeys
        ? PixiType[K] extends new (...args: any) => any
            ? K
            : never
        : never;
}[keyof PixiType];

type PixiElements = {
    [K in AutoFilteredKeys]: [
        Lowercase<K>,
        React.PropsWithChildren<
        ConstructorParams<PixiType[K]>
        & { init?: readonly any[] }
        > & React.PropsWithRef<{ ref?: React.MutableRefObject<InstanceType<PixiType[K]>> }>
    ];
};

type PixiElementsImpl = {
    [K in keyof PixiElements as PixiElements[K][0]]: PixiElements[K][1];
};

declare global
{
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace React.JSX
    {
        interface IntrinsicElements extends PixiElementsImpl {}
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace PixiMixins
    {
        interface Container
        {
            __handlers: Record<string, (...args: any[]) => any>;
            busy: boolean;
        }
    }
}

export {};

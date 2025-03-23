import {
    animate as motionAnimate,
    MotionConfigContext,
    type ValueAnimationTransition,
} from 'motion/react';
import {
    type ComponentProps,
    createElement,
    type JSX,
    use,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
import { useCompareEffect } from './useCompareEffect.js';
import { useLatestFunction } from './useLatestFunction.js';

import type { PixiElements } from 'typedefs/PixiElements.js';

const basicProps = [
    'alpha',
    'angle',
    'rotation',
    'x',
    'y',
    'width',
    'height',
] as const;
const nestedProps = ['scale', 'pivot', 'position', 'skew'] as const;
const supportedProps = [...basicProps, ...nestedProps] as const;

type SupportedProps = (typeof supportedProps)[number];

/**
 * elements that accept all the above properties
 */
export type SupportedElements = keyof {
    [K in keyof PixiElements as Required<PixiElements[K]> extends Record<
        SupportedProps,
        unknown
    >
        ? PixiElements[K] extends never
            ? never
            : K
        : never]: never
};

type SupportedValues = {
    [K in SupportedProps]: ComponentProps<SupportedElements>[K]
};

type PropertyTransitions = {
    [K in SupportedProps]?: ValueAnimationTransition
} & ValueAnimationTransition;

type WithMotionProps<Props> = Props & {
    initial?: Partial<SupportedValues>
    animate?: Partial<SupportedValues> & { transition?: PropertyTransitions }
    transition?: PropertyTransitions
};

export type PixiMotionComponent<TagName extends SupportedElements> = (
    props: WithMotionProps<ComponentProps<TagName>>,
) => JSX.Element;

const filterTransition = (transition: ValueAnimationTransition | undefined) =>
{
    if (transition === undefined) return undefined;

    const withRemovedKeys = Object.fromEntries(
        Object.entries(transition).filter(([key]) => !(key in supportedProps)),
    );

    if (Object.keys(withRemovedKeys).length === 0) return undefined;

    return withRemovedKeys as ValueAnimationTransition;
};

export function createMotionComponent<TagName extends SupportedElements>(
    Component: TagName,
): PixiMotionComponent<TagName>
{
    return function MotionComponent({
        initial,
        animate,
        ref: userRef,
        transition,
        ...props
    })
    {
        const ref = useRef<PixiElements[TagName]>(null);

        useImperativeHandle<
            PixiElements[TagName] | null,
            PixiElements[TagName] | null
        >(userRef as typeof ref, () => ref.current);
        const firstRenderRef = useRef(true);
        const defaultTransition = use(MotionConfigContext)
            .transition as PropertyTransitions;

        /**
         * get the transition options for a particular property
         */
        const getTransitionDetails = useLatestFunction(
            (property: SupportedProps): ValueAnimationTransition | undefined =>
            {
                // extract from the animate property
                const scopedVague = animate?.transition;
                const scopedSpecific = animate?.transition?.[property];

                // extract from the transition property
                const transitionPropertyVague = transition;
                const transitionPropertySpecific = transition?.[property];

                // extract from motion config
                const motionConfigVague = defaultTransition;
                const motionConfigSpecific = defaultTransition?.[property];

                // TODO: how does motion/react handle precedence?
                return (
                    filterTransition(scopedSpecific)
                    ?? filterTransition(scopedVague)
                    ?? filterTransition(transitionPropertySpecific)
                    ?? filterTransition(transitionPropertyVague)
                    ?? filterTransition(motionConfigSpecific)
                    ?? filterTransition(motionConfigVague)
                );
            },
        );

        /**
         * get the initial state for a property
         *
         * the priority matters here: initial always wins, then prefer props over animate
         */
        const useInitialState = (key: SupportedProps) =>
            useRef(initial?.[key] ?? props[key] ?? animate?.[key]).current;

        /**
         * animate to a certain state
         */
        const to = useCallback(
            (key: SupportedProps, value?: SupportedValues[SupportedProps]) =>
            {
                if (value === undefined) return;
                if (!ref.current) return;

                const transition = getTransitionDetails(key);

                if (typeof value === 'object')
                {
                    const { x, y } = value;

                    if (x !== undefined)
                    {
                        motionAnimate(ref.current[key], { x }, transition);
                    }
                    if (y !== undefined)
                    {
                        motionAnimate(ref.current[key], { y }, transition);
                    }
                }
                else
                {
                    motionAnimate(ref.current, { [key]: value }, transition);
                }
            },
            [getTransitionDetails],
        );

        /**
         * instantly jump to a certain state, interrupting any running animations
         */
        const set = useCallback(
            <T extends SupportedProps>(key: T, value?: SupportedValues[T]) =>
            {
                if (value === undefined) return;
                if (firstRenderRef.current) return;
                if (!ref.current) return;

                // @ts-expect-error propably not possible to narrow, but types will catch it
                ref.current[key] = value;
            },
            [],
        );

        const initialProps: Partial<
            Record<SupportedProps, SupportedValues[SupportedProps]>
        > = {};

        for (const key of supportedProps)
        {
            /**
             * track our initial values, which never change after mount
             */
            initialProps[key] = useInitialState(key);
            /**
             * instantly jump to a new value when that prop changes
             */
            useCompareEffect(() => set(key), [set, props[key]]);
            /**
             * animate our values when they change
             */
            useCompareEffect(() => to(key, animate?.[key]), [to, animate?.[key]]);
        }

        /**
         * this effect must be last, or it won't be usable in our other effects
         */
        useEffect(() =>
        {
            firstRenderRef.current = false;
        }, []);

        return createElement(Component, {
            ...props,
            ...initialProps,
            ref,
        });
    };
}

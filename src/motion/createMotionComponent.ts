import {
    animate as motionAnimate,
    MotionConfigContext,
    type ValueAnimationTransition,
} from 'motion/react';
import { type ObservablePoint } from 'pixi.js';
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
import { useLatestFunction } from './useLatestFunction.js';
import { usePointCompareEffect, usePointCompareMemo } from './usePointCompare.js';

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

/**
 * filter out property keys from transitions so that we don't accidentally pass an empty transition to motion
 */
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
         * get the instant state for a property
         *
         * on first render, this is the initial values
         * if the value passed directly to a prop ever changes, it will become the instant value for future renders
         */
        const useInstantState = (key: SupportedProps) =>
        {
            const instantValue = props[key];
            // the priority matters here: initial always wins, then prefer props over animate
            const initialValue = useRef(initial?.[key] ?? instantValue ?? animate?.[key]).current;

            return usePointCompareMemo(() =>
            {
                if (firstRenderRef.current) return initialValue;

                return instantValue;
            }, instantValue);
        };

        /**
         * manage running animations so they don't continue to run after a value changes
         */
        const runningAnimations = useRef<
            Partial<
                Record<
                    SupportedProps,
                    ReturnType<typeof motionAnimate>[]
                >
            >
        >({});
        const saveAnimation = useCallback((key: SupportedProps, value: ReturnType<typeof motionAnimate>) =>
        {
            runningAnimations.current[key] ??= [];
            runningAnimations.current[key].push(value);
        }, []);
        const clear = useCallback((key: SupportedProps) =>
        {
            runningAnimations.current[key]?.forEach((animation) => animation.stop());
            runningAnimations.current[key] = [];
        }, []);

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
                    const nestedValue = ref.current?.[key] as ObservablePoint;
                    const { x, y } = value;

                    if (!nestedValue) return;

                    if (x !== undefined)
                    {
                        saveAnimation(key, motionAnimate(nestedValue, {
                            x: [
                                nestedValue.x,
                                x
                            ]
                        }, transition));
                    }
                    if (y !== undefined)
                    {
                        saveAnimation(key, motionAnimate(nestedValue, {
                            y: [
                                nestedValue.y, y
                            ]
                        }, transition));
                    }
                }
                else
                {
                    saveAnimation(key, motionAnimate(ref.current, { [key]: value }, transition));
                }
            },
            [getTransitionDetails],
        );

        const propsToPass = useRef<Partial<
            Record<SupportedProps, SupportedValues[SupportedProps]>
        >>({});

        for (const key of supportedProps)
        {
            /**
             * track our initial/instant values
             */
            propsToPass.current[key] = useInstantState(key);
            /**
             * stop our animations when values jump
             */
            usePointCompareEffect(() =>
                () => clear(key), props[key]);
            /**
             * animate our values when they change
             */
            usePointCompareEffect(() => to(key, animate?.[key]), animate?.[key]);
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
            ...propsToPass.current,
            ref,
        });
    };
}

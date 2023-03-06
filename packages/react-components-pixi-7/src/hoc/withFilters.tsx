import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { invariant } from '@pixi/react-invariant';
import type { Filter } from '@pixi/core';
import { hasKey, not } from '../utils/fp';
import type { Container } from '@pixi/display';
import type { BaseReactContainerProps } from '../types';

export type FilterClassMap = Record<string, typeof Filter>;
export type FilterInstanceMap = Record<string, Filter>;

export type WrapperProps = {
    apply?: (filters: FilterInstanceMap) => void;
    [key: string]:
        | {
              construct?: any[];
              [key: string]: any;
          }
        | any;
};

// TODO: P seems to be missing some Container props in code completion eg. x, y
export const withFilters = <T extends Container, P extends BaseReactContainerProps<T>>(
    WrapperComponent: React.ComponentType<P>,
    filters: FilterClassMap,
) =>
{
    invariant(typeof filters === 'object', 'Second argument needs to be an indexed object with { prop: Filter }');

    const filterKeys = Object.keys(filters);

    // TODO: It would be nice to Omit 'filters' from Wrapper but this breaks the
    // apply typing for some reason
    const Wrapper = ({ apply, children, ...props }: P & WrapperProps) =>
    {
        // TODO: useRef shouldn't wrap a useMemo... what's the point of the useRef?
        // create filters
        const filterList = useRef<Filter[]>(
            useMemo(
                () =>
                    filterKeys.map((prop) =>
                    {
                        const constructorArgs = props?.[prop]?.construct || [];

                        return new filters[prop](...constructorArgs);
                    }),
                [filterKeys],
            ),
        );

        const filterObj: FilterInstanceMap = useMemo(
            () => filterKeys.reduce((all, c, i) => ({ ...all, [c]: filterList.current[i] }), {}),
            [filterKeys],
        );

        // get rest props
        const restProps = useMemo(
            () =>
                Object.keys(props)
                    .filter(not(hasKey(filterKeys)))
                    .reduce((all, c) => ({ ...all, [c]: props[c] }), {}),
            [props, filterKeys],
        );

        // update filter params
        filterKeys.forEach((k, i) => Object.assign(filterList.current[i], props[k]));

        // use apply ?
        apply?.call?.(WrapperComponent, filterObj);

        return (
            <WrapperComponent {...(restProps as P)} filters={filterList.current}>
                {children}
            </WrapperComponent>
        );
    };

    Wrapper.displayName = 'FilterWrapper';

    Wrapper.propTypes = {
        children: PropTypes.node,
        apply: PropTypes.func,
    };

    return Wrapper;
};

import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import invariant from '../utils/invariant';
import { hasKey, isFunction, not } from '../helpers';

export const withFilters = (WrapperComponent, filters) =>
{
    invariant(typeof filters === 'object', 'Second argument needs to be an indexed object with { prop: Filter }');

    const keys = Object.keys(filters);

    const Wrapper = ({ children, apply, ...props }) =>
    {
    // create filters
        const filterList = useRef(
            useMemo(() =>
                keys.map((prop) =>
                {
                    const constructorArgs = props?.[prop]?.construct || [];

                    return new filters[prop](...constructorArgs);
                }), [keys])
        );

        const filterObj = useMemo(() =>
            keys.reduce((all, c, i) => ({ ...all, [c]: filterList.current[i] }), {}), [keys]);

        // get rest props
        const restProps = useMemo(() =>
            Object.keys(props)
                .filter(not(hasKey(keys)))
                .reduce((all, c) => ({ ...all, [c]: props[c] }), {}), [props, keys]);

        // update filter params
        keys.forEach((k, i) => Object.assign(filterList.current[i], props[k]));

        // use apply ?
        if (apply && isFunction(apply))
        {
            apply.call(WrapperComponent, filterObj);
        }

        return (
            <WrapperComponent {...restProps} filters={filterList.current}>
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

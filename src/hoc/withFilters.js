import React from 'react'
import PropTypes from 'prop-types'
import { Filter as PixiFilter } from 'pixi.js'
import { isFunction, lcFirst } from '../helpers'

export const withFilters = (WrappedComponent, filters) => {
  const filterWrapper = ({ children = [], apply, ...props }) => {
    const filterObj = {}
    const arrayOfFilter = filters.constructor === Array ? filters : [filters]
    const isMultiFilter = arrayOfFilter.length > 1
    const appliedFilters = arrayOfFilter
      .filter(f => isFunction(f))
      .map(f => {
        const filterName = f.name
        const filterPropName = lcFirst(filterName)
        const filter = !filterObj[filterPropName] ? new f() : filterObj[filterPropName]
        filterObj[filterPropName] = filter
        const allFilterProps = props[filterPropName] && isMultiFilter ? props[filterPropName] : props
        Object.keys(allFilterProps).forEach(function(o) {
          filter[o] = allFilterProps[o]
        })

        return filter
      })
    if (apply && typeof apply === 'function') {
      apply.call(WrappedComponent, filterObj)
    }
    return (
      <WrappedComponent name="FilterWrapper" filters={appliedFilters} {...props}>
        {children}
      </WrappedComponent>
    )
  }

  filterWrapper.displayName = 'FilterWrapper'
  filterWrapper.propTypes = {
    children: PropTypes.node,
    apply: PropTypes.function,
  }

  return filterWrapper
}

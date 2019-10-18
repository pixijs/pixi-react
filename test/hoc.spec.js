import * as PIXI from 'pixi.js'
import { withFilters } from '../src/hoc/withFilters'
import { createElement, TYPES, TYPES_INJECTED, PixiComponent } from '../src/utils/element'
import { Container } from '../src'

class BlurFilter {
	constructor(blur, quality) {
        this.blur = blur;
        this.quality = quality;
    }
} 
class AlphaFilter{
		constructor(alpha) {
	        this.alpha = alpha;
	    }
} 

describe('withFilters', () => {
  test('create the filter wrapper and pass to its component used as a container the filter instances and the rest of props', () => {
    const props = { x: 100, y: 200 }
    const filterizedContainer = withFilters(Container, [BlurFilter, AlphaFilter])(props)
    expect(filterizedContainer.props.filters[0].constructor.name).toEqual('BlurFilter')
    expect(filterizedContainer.props.filters[1].constructor.name).toEqual('AlphaFilter')
    expect(filterizedContainer.props.x).toEqual(100)
    expect(filterizedContainer.props.y).toEqual(200)
  })
  test('create the filter wrapper and pass to the apply prop all filter instances', () => {
    let filters = {}
    const apply = (filterObj) => {
      filters = filterObj;
    }
    const filterizedContainer = withFilters(Container, [BlurFilter, AlphaFilter])({
      apply
    })
    expect(filters.blurFilter.constructor.name).toEqual('BlurFilter')
    expect(filters.alphaFilter.constructor.name).toEqual('AlphaFilter')
  })

  test('create the filter wrapper with one filter only and setting its properties', () => {
    const props = { blur: 10, quality: 5 }
    const filterizedContainer = withFilters(Container, [BlurFilter])(props)
    expect(filterizedContainer.props.filters[0].blur).toEqual(10)
    expect(filterizedContainer.props.filters[0].quality).toEqual(5)
  })

  test('create the filter wrapper with multiple filters setting properties for each of them', () => {
    const props = { blurFilter: { blur: 10, quality: 5}, alphaFilter: {alpha: 0.5} }
    const filterizedContainer = withFilters(Container, [BlurFilter, AlphaFilter])(props)
    expect(filterizedContainer.props.filters[0].blur).toEqual(10)
    expect(filterizedContainer.props.filters[0].quality).toEqual(5)
    expect(filterizedContainer.props.filters[1].alpha).toEqual(0.5)
  })

})

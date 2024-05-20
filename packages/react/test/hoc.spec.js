import React from 'react';
import renderer from 'react-test-renderer';
import { withFilters } from '../src/hoc';
import { Container } from '../src';

class BlurFilter
{
    constructor(blur, quality)
    {
        this.blur = blur;
        this.quality = quality;
    }
}

class AlphaFilter
{
    constructor(alpha)
    {
        this.alpha = alpha;
    }
}

class ColorMatrixFilter
{
    greyscale(scale)
    {
        this.greyscaleAmount = scale;
    }
}

describe('withFilters', () =>
{
    let Filters;

    beforeAll(() =>
    {
        Filters = withFilters(Container, { blurFilter: BlurFilter, alphaFilter: AlphaFilter });
    });

    test('create hoc and delegate wrapper component props', () =>
    {
        const r = renderer.create(<Filters scale={2} x={100} y={200} />).toJSON();

        expect(r).toHaveProperty('type', 'Container');
        expect(r).toHaveProperty('props.scale', 2);
        expect(r).toHaveProperty('props.x', 100);
        expect(r).toHaveProperty('props.y', 200);
    });

    test('set correct `filters` prop on wrapper component', () =>
    {
        const r = renderer.create(<Filters scale={2} x={100} y={100} />).toJSON();

        expect(r).toHaveProperty('props.filters');
        expect(r.props.filters).toHaveLength(2);
        expect(r.props.filters[0]).toBeInstanceOf(BlurFilter);
        expect(r.props.filters[1]).toBeInstanceOf(AlphaFilter);
    });

    test('update filter param based on prop key `blurFilter`', () =>
    {
        const r = renderer.create(<Filters alphaFilter={{ alpha: 0.5 }} blurFilter={{ blur: 10, quality: 5 }} />).toJSON();

        expect(r.props.filters[0]).toHaveProperty('blur', 10);
        expect(r.props.filters[0]).toHaveProperty('quality', 5);
        expect(r.props.filters[1]).toHaveProperty('alpha', 0.5);
    });

    test('use `apply` prop to do custom filter logic', () =>
    {
        Filters = withFilters(Container, {
            blurFilter: BlurFilter,
            colorMatrixFilter: ColorMatrixFilter,
        });

        const r = renderer
            .create(
                <Filters
                    blurFilter={{ blur: 10, quality: 5 }}
                    apply={({ colorMatrixFilter }) =>
                    {
                        colorMatrixFilter.greyscale(2);
                    }}
                />
            )
            .toJSON();

        expect(r.props.filters[1]).toHaveProperty('greyscaleAmount', 2);
    });
});

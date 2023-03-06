import { Filter } from '@pixi/core';
import renderer from 'react-test-renderer';
import type { ReactTestRendererJSON } from 'react-test-renderer';
import { Container, withFilters } from '../src';

class MockBlurFilter extends Filter
{
    blur: number = 0;
    quality: number = 0;
}

class MockAlphaFilter extends Filter
{
    alpha: number = 0;
}

class MockColorMatrixFilter extends Filter
{
    greyscaleAmount: number = 0;

    greyscale(scale: number)
    {
        this.greyscaleAmount = scale;
    }
}

describe('withFilters', () =>
{
    test('create hoc and delegate wrapper component props', () =>
    {
        const Filters = withFilters(Container, { blurFilter: MockBlurFilter, alphaFilter: MockAlphaFilter });
        const r = renderer.create(<Filters scale={2} x={100} y={200} />).toJSON() as ReactTestRendererJSON;

        expect(r).toHaveProperty('type', 'Container');
        expect(r).toHaveProperty('props.scale', 2);
        expect(r).toHaveProperty('props.x', 100);
        expect(r).toHaveProperty('props.y', 200);
    });

    test('set correct `filters` prop on wrapper component', () =>
    {
        const Filters = withFilters(Container, { blurFilter: MockBlurFilter, alphaFilter: MockAlphaFilter });
        const r = renderer.create(<Filters scale={2} x={100} y={100} />).toJSON() as ReactTestRendererJSON;

        expect(r).toHaveProperty('props.filters');
        expect(r.props.filters).toHaveLength(2);
        expect(r.props.filters[0]).toBeInstanceOf(MockBlurFilter);
        expect(r.props.filters[1]).toBeInstanceOf(MockAlphaFilter);
    });

    test('update filter param based on prop key `blurFilter`', () =>
    {
        const Filters = withFilters(Container, { blurFilter: MockBlurFilter, alphaFilter: MockAlphaFilter });
        const r = renderer
            .create(<Filters alphaFilter={{ alpha: 0.5 }} blurFilter={{ blur: 10, quality: 5 }} />)
            .toJSON() as ReactTestRendererJSON;

        expect(r.props.filters[0]).toHaveProperty('blur', 10);
        expect(r.props.filters[0]).toHaveProperty('quality', 5);
        expect(r.props.filters[1]).toHaveProperty('alpha', 0.5);
    });

    test('use `apply` prop to do custom filter logic', () =>
    {
        const Filters = withFilters(Container, {
            blurFilter: MockBlurFilter,
            colorMatrixFilter: MockColorMatrixFilter,
        });

        const r = renderer
            .create(
                <Filters
                    blurFilter={{ blur: 10, quality: 5 }}
                    apply={({ colorMatrixFilter }) =>
                    {
                        (colorMatrixFilter as MockColorMatrixFilter).greyscale(2);
                    }}
                />,
            )
            .toJSON() as ReactTestRendererJSON;

        expect(r.props.filters[1]).toHaveProperty('greyscaleAmount', 2);
    });
});

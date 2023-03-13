import * as index from '../src/index';
const { PixiComponent, COMPONENTS } = index;

describe('index', () =>
{
    test('export modules for react-modular', () =>
    {
        expect(index).toMatchSnapshot();
    });
});

describe('PixiComponent', () =>
{
    afterEach(() =>
    {
        Object.keys(COMPONENTS).forEach((type) =>
        {
            delete COMPONENTS[type];
        });
    });

    test('type must be defined', () =>
    {
        expect(() => new PixiComponent(null)).toThrow('Expect type to be defined, got `null`');
    });

    test('cannot override existing component', () =>
    {
        new PixiComponent('Text', {});

        expect(() => new PixiComponent('Text', {})).toThrow(
            'Component `Text` could not be created, a component with that name already exists.'
        );
    });

    test('inject custom component', () =>
    {
        const lifecycle = { create: (props) => {} };

        // eslint-disable-next-line no-new
        new PixiComponent('Rectangle', lifecycle);
        expect(COMPONENTS).toHaveProperty('Rectangle', lifecycle);
    });
});


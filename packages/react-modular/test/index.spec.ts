import * as index from '../src/index';
const { configurePixiComponent } = index;

describe('index', () =>
{
    test('export modules for react-modular', () =>
    {
        expect(index).toMatchSnapshot();
    });
});

describe('PixiComponent', () =>
{
    test('type must be defined', () =>
    {
        const { PixiComponent } = configurePixiComponent();

        // @ts-ignore: specifically testing untyped case
        expect(() => PixiComponent(null, { create: () => {} })).toThrow('Expect type to be defined, got `null`');
    });

    test('cannot override existing component', () =>
    {
        const { PixiComponent } = configurePixiComponent();

        // @ts-ignore - ignore for test case
        PixiComponent('Text', { create: () => {} });

        // @ts-ignore - ignore for test case
        expect(() => PixiComponent('Text', { create: () => {} })).toThrow(
            'Component `Text` could not be created, a component with that name already exists.',
        );
    });

    test('inject custom component', () =>
    {
        const { COMPONENTS, PixiComponent } = configurePixiComponent();

        const lifecycle = { create: () => {} };

        // @ts-ignore - ignore for test case
        PixiComponent('Rectangle', lifecycle);
        expect(COMPONENTS).toHaveProperty('Rectangle', lifecycle);
    });
});

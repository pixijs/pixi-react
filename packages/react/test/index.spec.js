import * as index from '../src/index';

describe('index', () =>
{
    test('export modules for pixi-react', () =>
    {
        expect(index).toMatchSnapshot();
    });
});

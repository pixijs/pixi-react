import * as index from '../src/index';

describe('index', () =>
{
    test('export modules for react-fiber', () =>
    {
        expect(index).toMatchSnapshot();
    });
});

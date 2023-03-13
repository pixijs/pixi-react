import * as index from '../src/index';

describe('index', () =>
{
    test('export modules for react-spring', () =>
    {
        expect(index).toMatchSnapshot();
    });
});

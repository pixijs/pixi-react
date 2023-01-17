import * as index from '../src/index';

describe('index', () =>
{
    test('export modules for react-spring legacy', () =>
    {
        expect(index).toMatchSnapshot();
    });
});
